"use client";

import { useEffect, useState } from "react";
import { geoIdentity, geoPath } from "d3-geo";
import { toTitleCaseTr } from "@/lib/text";

const WIDTH = 960;
const HEIGHT = 500;

interface IlceFeature {
  type: "Feature";
  properties: { name: string };
  geometry: GeoJSON.Geometry;
}

export default function DistrictMap({ ilSlug }: { ilSlug: string }) {
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
      className="h-auto w-full"
      role="img"
      aria-label="İlçe haritası"
    >
      {features.map((f) => {
        const d = path(f.geometry as GeoJSON.Geometry);
        const centroid = path.centroid(f.geometry as GeoJSON.Geometry);
        if (!d) return null;
        return (
          <g key={f.properties.name}>
            <path
              d={d}
              className="fill-surface-card"
              stroke="var(--color-map-boundary)"
              strokeWidth={1}
              strokeOpacity={0.7}
            />
            <text
              x={centroid[0]}
              y={centroid[1]}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-map-label-district pointer-events-none select-none"
            >
              {toTitleCaseTr(f.properties.name)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
