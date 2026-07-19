"use client";

import MapPanel, { type SelectedRegion } from "./MapPanel";
import NavToolbar from "./NavToolbar";
import { useSelectionHistory } from "@/lib/useSelectionHistory";
import type { RegionStat } from "@/types";

export interface CompareMap {
  id: string;
  regionStats: RegionStat[];
}

// 4 harita yan yana (1x4) çok dar kalıyor; 2x2'ye bölünce her harita daha
// geniş render oluyor (yükseklikten kazanılandan fazlasını genişlikten
// kazanıyor, çünkü harita en-boy oranı zaten yatay).
function gridColumns(count: number): number {
  return count === 4 ? 2 : count;
}

function borderClass(index: number, count: number): string | undefined {
  const columns = gridColumns(count);
  if (columns === count) {
    // Tek satır: sonuncu hariç hepsinde sağ kenarlık.
    return index < count - 1 ? "border-r border-hairline" : undefined;
  }
  // 2x2: sağ sütun hariç sağ kenarlık, alt satır hariç alt kenarlık.
  const classes: string[] = [];
  if (index % columns !== columns - 1) classes.push("border-r");
  if (index < count - columns) classes.push("border-b");
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
