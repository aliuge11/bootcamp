"use client";

import { useEffect, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { Topology, GeometryObject } from "topojson-specification";
import { getSlaBucket, SLA_BUCKET_COLORS } from "@/lib/slaColor";
import { getBolge, type Bolge } from "@/lib/bolge";
import MapTooltip from "./MapTooltip";

const WIDTH = 960;
const HEIGHT = 500;
// Kenar illerin adları (ör. "Ardahan") SVG kenarına dayanıp kırpılmasın diye
// harita kenarlardan biraz içeri alınıyor — etiketlere yer açılıyor.
const MARGIN_X = 40;
const MARGIN_Y = 24;

interface IlFeature {
  type: "Feature";
  properties: { name: string };
  geometry: GeoJSON.Geometry;
}

export interface IlStat {
  kargoSayisi: number;
  slaIci: number;
  slaDisi: number;
}

interface TurkeyMapProps {
  /** il adı -> o ilin toplam kargo/SLA dışı sayısı. Veri yoksa ilgili il gri (no-data) boyanır. */
  ilStats?: Map<string, IlStat>;
  onIlClick?: (il: string) => void;
  /** Senkron seçili il adı — primary renkte kalın bir kontur ile vurgulanır. */
  selectedName?: string | null;
  /**
   * "il" (varsayılan): her ilin adı kendi üzerine yazılır.
   * "bolge": dolgu rengi ve il sınırları aynı kalır (SLA hâlâ il bazlı ölçülüyor),
   * sadece etiketler 81 il adı yerine 7 coğrafi bölge adına dönüşür — illerin
   * kendi verisi/rengi bozulmadan sadece daha üst düzey bir okuma sağlar.
   */
  labelMode?: "il" | "bolge";
}

export default function TurkeyMap({ ilStats, onIlClick, selectedName, labelMode = "il" }: TurkeyMapProps) {
  const [topology, setTopology] = useState<Topology | null>(null);
  const [hovered, setHovered] = useState<{ name: string; x: number; y: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/geo/turkey.topojson")
      .then((res) => res.json())
      .then((topo: Topology) => {
        if (!cancelled) setTopology(topo);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!topology) {
    return (
      <div className="text-body-md p-6 text-muted">Harita yükleniyor…</div>
    );
  }

  const objectKey = Object.keys(topology.objects)[0];
  const object = topology.objects[objectKey];
  const fc = feature(topology, object) as unknown as { features: IlFeature[] };
  const features = fc.features;

  const projection = geoMercator().fitExtent(
    [
      [MARGIN_X, MARGIN_Y],
      [WIDTH - MARGIN_X, HEIGHT - MARGIN_Y],
    ],
    { type: "FeatureCollection", features } as GeoJSON.FeatureCollection,
  );
  const path = geoPath(projection);

  // "Bölge bazlı" etiket konumu: gerçek bölge sınırı birleştirilmiyor (renk/il
  // sınırları hep il bazlı kalıyor), sadece o bölgedeki illerin centroid'lerinin
  // ortalaması alınıp bölge adı oraya yazılıyor.
  let bolgeLabelPositions: [Bolge, [number, number]][] = [];
  if (labelMode === "bolge") {
    const groups = new Map<Bolge, [number, number][]>();
    for (const f of features) {
      const bolge = getBolge(f.properties.name);
      if (!bolge) continue;
      const centroid = path.centroid(f.geometry as GeoJSON.Geometry);
      const list = groups.get(bolge) ?? [];
      list.push(centroid);
      groups.set(bolge, list);
    }
    bolgeLabelPositions = Array.from(groups.entries()).map(([bolge, points]) => {
      const x = points.reduce((sum, p) => sum + p[0], 0) / points.length;
      const y = points.reduce((sum, p) => sum + p[1], 0) / points.length;
      return [bolge, [x, y]] as [Bolge, [number, number]];
    });
  }

  // "Bölge bazlı"da il sınırları aynı kalıyor ama iki farklı bölgedeki komşu
  // iller arasındaki sınır ayrıca kalın bir çizgiyle vurgulanıyor. topojson'un
  // paylaşılan ark (arc) yapısı sayesinde poligon birleştirmeye gerek kalmadan,
  // sadece "iki tarafındaki il farklı bölgedeyse" filtresiyle o kesişim
  // çizgileri (mesh) tek bir path olarak çiziliyor.
  let bolgeBorderPath: string | null = null;
  if (labelMode === "bolge") {
    const bordersGeo = mesh(topology, object as GeometryObject, (a, b) => {
      if (!b) return false;
      const nameA = (a as GeometryObject & { properties?: { name: string } }).properties?.name;
      const nameB = (b as GeometryObject & { properties?: { name: string } }).properties?.name;
      if (!nameA || !nameB) return false;
      return getBolge(nameA) !== getBolge(nameB);
    });
    bolgeBorderPath = path(bordersGeo as unknown as GeoJSON.Geometry);
  }

  // Şekiller ve etiketler iki ayrı geçişte çiziliyor (önce tüm dolgular, sonra
  // etiketler): aksi halde sonradan çizilen komşu ilin dolgusu, önceki ilin
  // etiketini örtüp "eksik/kaybolan" etiket sorununa yol açıyordu.
  const cells = features
    .map((f) => {
      const d = path(f.geometry as GeoJSON.Geometry);
      if (!d) return null;
      const centroid = path.centroid(f.geometry as GeoJSON.Geometry);
      const stat = ilStats?.get(f.properties.name);
      const bucket = getSlaBucket(stat?.kargoSayisi ?? 0, stat?.slaDisi ?? 0);
      return { name: f.properties.name, d, centroid, fill: SLA_BUCKET_COLORS[bucket] };
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

  const selectedCell = selectedName ? cells.find((c) => c.name === selectedName) : null;
  const hoveredStat = hovered ? ilStats?.get(hovered.name) : undefined;

  return (
    <>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full overflow-hidden"
        role="img"
        aria-label="Türkiye il haritası"
      >
        {/* 1. geçiş: dolgular + etkileşim */}
        {cells.map((c) => (
          <path
            key={c.name}
            d={c.d}
            fill={c.fill}
            stroke="var(--color-map-boundary)"
            strokeWidth={1.5}
            onClick={onIlClick ? () => onIlClick(c.name) : undefined}
            onMouseEnter={(e) => setHovered({ name: c.name, x: e.clientX, y: e.clientY })}
            onMouseMove={(e) => setHovered({ name: c.name, x: e.clientX, y: e.clientY })}
            onMouseLeave={() => setHovered(null)}
            className={onIlClick ? "cursor-pointer" : undefined}
          />
        ))}
        {/* Seçili il konturu — tüm dolguların üstünde (komşu dolgu örtmesin). */}
        {selectedCell && (
          <path
            d={selectedCell.d}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth={2.5}
            className="pointer-events-none"
          />
        )}
        {bolgeBorderPath && (
          <path
            d={bolgeBorderPath}
            fill="none"
            stroke="var(--color-map-boundary)"
            strokeWidth={5}
            strokeDasharray="9 5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none"
          />
        )}
        {/* 2. geçiş: etiketler — her zaman en üstte. */}
        {labelMode === "il" &&
          cells.map((c) => (
            <text
              key={c.name}
              x={c.centroid[0]}
              y={c.centroid[1]}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-map-label pointer-events-none select-none"
            >
              {c.name}
            </text>
          ))}
        {bolgeLabelPositions.map(([bolge, [x, y]]) => (
          <text
            key={bolge}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-map-label pointer-events-none select-none"
          >
            {bolge}
          </text>
        ))}
      </svg>
      {hovered && (
        <MapTooltip
          name={hovered.name}
          kargoSayisi={hoveredStat?.kargoSayisi ?? 0}
          slaIci={hoveredStat?.slaIci ?? 0}
          slaDisi={hoveredStat?.slaDisi ?? 0}
          x={hovered.x}
          y={hovered.y}
        />
      )}
    </>
  );
}
