"use client";

import { useEffect, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import { getSlaBucket, SLA_BUCKET_COLORS } from "@/lib/slaColor";

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
}

export default function TurkeyMap({ ilStats, onIlClick }: TurkeyMapProps) {
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
