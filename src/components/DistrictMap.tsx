"use client";

import { useEffect, useState } from "react";
import { geoIdentity, geoPath } from "d3-geo";
import { toTitleCaseTr } from "@/lib/text";
import { getSlaBucket, SLA_BUCKET_COLORS } from "@/lib/slaColor";

const WIDTH = 960;
const HEIGHT = 500;

interface IlceFeature {
  type: "Feature";
  properties: { name: string };
  geometry: GeoJSON.Geometry;
}

export interface IlceStat {
  kargoSayisi: number;
  slaDisi: number;
}

interface DistrictMapProps {
  ilSlug: string;
  /** ilçe adı (title-case) -> o ilçenin toplam kargo/SLA dışı sayısı. */
  ilceStats?: Map<string, IlceStat>;
  onIlceClick?: (ilce: string) => void;
  /** Senkron seçili ilçe adı — primary renkte kalın bir kontur ile vurgulanır. */
  selectedName?: string | null;
}

export default function DistrictMap({ ilSlug, ilceStats, onIlceClick, selectedName }: DistrictMapProps) {
  const [features, setFeatures] = useState<IlceFeature[] | null>(null);

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
    .fitSize([WIDTH, HEIGHT], { type: "FeatureCollection", features } as GeoJSON.FeatureCollection);
  const path = geoPath(projection);

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-auto w-full overflow-hidden"
      role="img"
      aria-label="İlçe haritası"
    >
      {features.map((f) => {
        const d = path(f.geometry as GeoJSON.Geometry);
        const centroid = path.centroid(f.geometry as GeoJSON.Geometry);
        if (!d) return null;

        const label = toTitleCaseTr(f.properties.name);
        const stat = ilceStats?.get(label);
        const bucket = getSlaBucket(stat?.kargoSayisi ?? 0, stat?.slaDisi ?? 0);
        const fill = SLA_BUCKET_COLORS[bucket];

        return (
          <g
            key={f.properties.name}
            onClick={onIlceClick ? () => onIlceClick(label) : undefined}
            className={onIlceClick ? "cursor-pointer" : undefined}
          >
            <path
              d={d}
              fill={fill}
              stroke="var(--color-map-boundary)"
              strokeWidth={1}
              strokeOpacity={0.7}
            />
            {selectedName === label && (
              <path d={d} fill="none" stroke="var(--color-primary)" strokeWidth={2.5} />
            )}
            <text
              x={centroid[0]}
              y={centroid[1]}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-map-label-district pointer-events-none select-none"
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
