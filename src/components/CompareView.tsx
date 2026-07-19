"use client";

import MapPanel, { type SelectedRegion } from "./MapPanel";
import NavToolbar from "./NavToolbar";
import { useSelectionHistory } from "@/lib/useSelectionHistory";
import type { RegionStat } from "@/types";

export interface CompareMap {
  id: string;
  regionStats: RegionStat[];
}

export default function CompareView({ maps }: { maps: CompareMap[] }) {
  const history = useSelectionHistory<SelectedRegion | null>(null);

  return (
    <div className="p-container-padding">
      <NavToolbar
        onBack={history.goBack}
        onForward={history.goForward}
        canGoBack={history.canGoBack}
        canGoForward={history.canGoForward}
      />
      <div className="grid" style={{ gridTemplateColumns: `repeat(${maps.length}, 1fr)` }}>
        {maps.map((map, index) => (
          <div
            key={map.id}
            className={index < maps.length - 1 ? "border-r border-hairline" : undefined}
          >
            <MapPanel regionStats={map.regionStats} selected={history.current} onSelect={history.push} />
          </div>
        ))}
      </div>
    </div>
  );
}
