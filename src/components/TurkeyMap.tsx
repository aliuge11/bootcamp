"use client";

import { useEffect, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";

const WIDTH = 960;
const HEIGHT = 500;

interface IlFeature {
  type: "Feature";
  properties: { name: string };
  geometry: GeoJSON.Geometry;
}

export default function TurkeyMap() {
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

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-auto w-full"
      role="img"
      aria-label="Türkiye il haritası"
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
              strokeWidth={1.5}
            />
            <text
              x={centroid[0]}
              y={centroid[1]}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-map-label pointer-events-none select-none"
            >
              {f.properties.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
