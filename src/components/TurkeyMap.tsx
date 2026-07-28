"use client";

import { useEffect, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import { getSlaBucket, SLA_BUCKET_COLORS } from "@/lib/slaColor";
import { getBolge, type Bolge } from "@/lib/bolge";

const WIDTH = 960;
const HEIGHT = 500;

interface IlFeature {
  type: "Feature";
  properties: { name: string };
  geometry: GeoJSON.Geometry;
}

export interface IlStat {
  kargoSayisi: number;
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
  const [features, setFeatures] = useState<IlFeature[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/geo/turkey.topojson")
      .then((res) => res.json())
      .then((topology: Topology) => {
        if (cancelled) return;
        const objectKey = Object.keys(topology.objects)[0];
        const fc = feature(topology, topology.objects[objectKey]) as unknown as {
          features: IlFeature[];
        };
        setFeatures(fc.features);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!features) {
    return (
      <div className="text-body-md p-6 text-muted">Harita yükleniyor…</div>
    );
  }

  const projection = geoMercator().fitSize(
    [WIDTH, HEIGHT],
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

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-auto w-full overflow-hidden"
      role="img"
      aria-label="Türkiye il haritası"
    >
      {features.map((f) => {
        const d = path(f.geometry as GeoJSON.Geometry);
        const centroid = path.centroid(f.geometry as GeoJSON.Geometry);
        if (!d) return null;

        const stat = ilStats?.get(f.properties.name);
        const bucket = getSlaBucket(stat?.kargoSayisi ?? 0, stat?.slaDisi ?? 0);
        const fill = SLA_BUCKET_COLORS[bucket];

        return (
          <g
            key={f.properties.name}
            onClick={onIlClick ? () => onIlClick(f.properties.name) : undefined}
            className={onIlClick ? "cursor-pointer" : undefined}
          >
            <path d={d} fill={fill} stroke="var(--color-map-boundary)" strokeWidth={1.5} />
            {selectedName === f.properties.name && (
              <path d={d} fill="none" stroke="var(--color-primary)" strokeWidth={2.5} />
            )}
            {labelMode === "il" && (
              <text
                x={centroid[0]}
                y={centroid[1]}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-map-label pointer-events-none select-none"
              >
                {f.properties.name}
              </text>
            )}
          </g>
        );
      })}
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
  );
}
