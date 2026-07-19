"use client";

import MapPanel, { type SelectedRegion } from "./MapPanel";
import NavToolbar from "./NavToolbar";
import { useSelectionHistory } from "@/lib/useSelectionHistory";
import type { RegionStat } from "@/types";

export interface CompareMap {
  id: string;
  regionStats: RegionStat[];
}

// 3-4 harita tek sırada (1x3/1x4) çok dar kalıyor; 2 sütuna bölününce her
// harita daha geniş render oluyor (harita en-boy oranı zaten yatay, dar bir
// sütundan çok dar bir satıra razı olmak daha pahalıya patlıyor). 3 harita
// 2 üstte + 1 altta, 4 harita 2x2 — CSS grid'in doğal auto-flow'u kullanılıyor,
// satır sayısı elle hesaplanmıyor.
function gridColumns(count: number): number {
  return count <= 2 ? count : 2;
}

function borderClass(index: number, count: number): string | undefined {
  const columns = gridColumns(count);
  const classes: string[] = [];
  const isLastInRow = (index + 1) % columns === 0;
  if (!isLastInRow && index + 1 < count) classes.push("border-r");
  if (index + columns < count) classes.push("border-b");
  return classes.length > 0 ? `${classes.join(" ")} border-hairline` : undefined;
}

export default function CompareView({ maps }: { maps: CompareMap[] }) {
  const history = useSelectionHistory<SelectedRegion | null>(null);
  const columns = gridColumns(maps.length);

  return (
    <div className="p-container-padding">
      <NavToolbar
        onBack={history.goBack}
        onForward={history.goForward}
        canGoBack={history.canGoBack}
        canGoForward={history.canGoForward}
      />
      <div className="grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {maps.map((map, index) => (
          <div key={map.id} className={borderClass(index, maps.length)}>
            <MapPanel regionStats={map.regionStats} selected={history.current} onSelect={history.push} />
          </div>
        ))}
      </div>
    </div>
  );
}
