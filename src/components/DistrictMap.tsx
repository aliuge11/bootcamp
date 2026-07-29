"use client";

import { useEffect, useState } from "react";
import { geoIdentity, geoPath } from "d3-geo";
import { toTitleCaseTr } from "@/lib/text";
import { getSlaBucket, SLA_BUCKET_COLORS } from "@/lib/slaColor";
import MapTooltip from "./MapTooltip";

const WIDTH = 960;
const HEIGHT = 500;
// İlçe adları SVG kenarına dayanıp kırpılmasın diye harita kenarlardan biraz
// içeri alınıyor (bkz. TurkeyMap).
const MARGIN_X = 40;
const MARGIN_Y = 24;

interface IlceFeature {
  type: "Feature";
  properties: { name: string };
  geometry: GeoJSON.Geometry;
}

export interface IlceStat {
  kargoSayisi: number;
  slaIci: number;
  slaDisi: number;
}

interface DistrictMapProps {
  ilSlug: string;
  /** ilçe adı (title-case) -> o ilçenin toplam kargo/SLA dışı sayısı. */
  ilceStats?: Map<string, IlceStat>;
  onIlceClick?: (ilce: string) => void;
  /** Senkron seçili ilçe adı — primary renkte kalın bir kontur ile vurgulanır. */
  selectedName?: string | null;
  /** İlçe haritasında boş alana tıklayınca veya Esc'e basınca çağrılır — il bazlı haritaya döner. */
  onBackgroundClick?: () => void;
}

export default function DistrictMap({
  ilSlug,
  ilceStats,
  onIlceClick,
  selectedName,
  onBackgroundClick,
}: DistrictMapProps) {
  const [features, setFeatures] = useState<IlceFeature[] | null>(null);
  const [hovered, setHovered] = useState<{ name: string; x: number; y: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setFeatures(null);
    fetch(`/geo/districts/${ilSlug}.geojson`)
      .then((res) => res.json())
      .then((fc: { features: IlceFeature[] }) => {
        if (!cancelled) setFeatures(fc.features);
      });
    return () => {
      cancelled = true;
    };
  }, [ilSlug]);

  // Esc → il bazlı haritaya dön (boş-alan tıklamanın klavye karşılığı, sunumda
  // pratik). Karşılaştırmada birden fazla DistrictMap aynı anda tetiklense de
  // useSelectionHistory aynı değeri arka arkaya itmiyor, sorun olmuyor.
  useEffect(() => {
    if (!onBackgroundClick) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onBackgroundClick!();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onBackgroundClick]);

  if (!features) {
    return (
      <div className="text-body-md p-6 text-muted">İlçeler yükleniyor…</div>
    );
  }

  // Bu ilçe dosyaları kendi yerel koordinat uzayında (bkz. MEMORY.md) —
  // ülke haritasıyla aynı projeksiyon kullanılamaz, geoIdentity + fitSize
  // ile bağımsız olarak render ediliyor.
  const projection = geoIdentity()
    .reflectY(true)
    .fitExtent(
      [
        [MARGIN_X, MARGIN_Y],
        [WIDTH - MARGIN_X, HEIGHT - MARGIN_Y],
      ],
      { type: "FeatureCollection", features } as GeoJSON.FeatureCollection,
    );
  const path = geoPath(projection);

  // İki geçiş (önce dolgular, sonra etiketler) — komşu ilçe dolgusu etiketi
  // örtmesin (bkz. TurkeyMap).
  const cells = features
    .map((f) => {
      const d = path(f.geometry as GeoJSON.Geometry);
      if (!d) return null;
      const centroid = path.centroid(f.geometry as GeoJSON.Geometry);
      const label = toTitleCaseTr(f.properties.name);
      const stat = ilceStats?.get(label);
      const bucket = getSlaBucket(stat?.kargoSayisi ?? 0, stat?.slaDisi ?? 0);
      return { key: f.properties.name, label, d, centroid, fill: SLA_BUCKET_COLORS[bucket] };
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

  const selectedCell = selectedName ? cells.find((c) => c.label === selectedName) : null;
  const hoveredStat = hovered ? ilceStats?.get(hovered.name) : undefined;

  return (
    <>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full overflow-hidden"
        role="img"
        aria-label="İlçe haritası"
        // Boş alana (ilçe olmayan yer) tıklayınca il bazlı haritaya dön.
        // İlçe tıklamaları stopPropagation ile buraya ulaşmıyor.
        onClick={onBackgroundClick}
      >
        {/* 1. geçiş: dolgular + etkileşim */}
        {cells.map((c) => (
          <path
            key={c.key}
            d={c.d}
            fill={c.fill}
            stroke="var(--color-map-boundary)"
            strokeWidth={1}
            strokeOpacity={0.7}
            onClick={
              onIlceClick
                ? (e) => {
                    e.stopPropagation();
                    onIlceClick(c.label);
                  }
                : undefined
            }
            onMouseEnter={(e) => setHovered({ name: c.label, x: e.clientX, y: e.clientY })}
            onMouseMove={(e) => setHovered({ name: c.label, x: e.clientX, y: e.clientY })}
            onMouseLeave={() => setHovered(null)}
            className={onIlceClick ? "cursor-pointer" : undefined}
          />
        ))}
        {/* Seçili ilçe konturu — tüm dolguların üstünde. */}
        {selectedCell && (
          <path
            d={selectedCell.d}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth={2.5}
            className="pointer-events-none"
          />
        )}
        {/* 2. geçiş: etiketler — her zaman en üstte. */}
        {cells.map((c) => (
          <text
            key={c.key}
            x={c.centroid[0]}
            y={c.centroid[1]}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-map-label-district pointer-events-none select-none"
          >
            {c.label}
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
