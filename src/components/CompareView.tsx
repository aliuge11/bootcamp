"use client";

import { useState } from "react";
import MapPanel, { type SelectedRegion } from "./MapPanel";
import type { RegionStat } from "@/types";

export interface CompareMap {
  id: string;
  regionStats: RegionStat[];
}

export default function CompareView({ maps }: { maps: CompareMap[] }) {
  const [selected, setSelected] = useState<SelectedRegion | null>(null);

  return (
    <div className="grid h-full" style={{ gridTemplateColumns: `repeat(${maps.length}, 1fr)` }}>
      {maps.map((map, index) => (
        <div
          key={map.id}
          className={index < maps.length - 1 ? "border-r border-hairline" : undefined}
        >
          <MapPanel regionStats={map.regionStats} selected={selected} onSelect={setSelected} />
        </div>
      ))}
    </div>
  );
}
