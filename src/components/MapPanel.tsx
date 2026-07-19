"use client";

import { useMemo, useState } from "react";
import TurkeyMap, { type IlStat } from "./TurkeyMap";
import DistrictMap, { type IlceStat } from "./DistrictMap";
import MapLegend from "./MapLegend";
import { normalizeRegionName } from "@/lib/text";
import type { RegionStat } from "@/types";

interface MapPanelProps {
  regionStats: RegionStat[];
}

export default function MapPanel({ regionStats }: MapPanelProps) {
  const [selectedIl, setSelectedIl] = useState<string | null>(null);

  const ilStats = useMemo(() => {
    const map = new Map<string, IlStat>();
    for (const row of regionStats) {
      const existing = map.get(row.il) ?? { kargoSayisi: 0, slaDisi: 0 };
      existing.kargoSayisi += row.kargo_sayisi;
      existing.slaDisi += row.sla_disi;
      map.set(row.il, existing);
    }
    return map;
  }, [regionStats]);

  const ilceStats = useMemo(() => {
    const map = new Map<string, IlceStat>();
    if (!selectedIl) return map;
    for (const row of regionStats) {
      if (row.il === selectedIl) {
        map.set(row.ilce, { kargoSayisi: row.kargo_sayisi, slaDisi: row.sla_disi });
      }
    }
    return map;
  }, [regionStats, selectedIl]);

  return (
    <div className="relative">
      {selectedIl ? (
        <div>
          <button
            type="button"
            onClick={() => setSelectedIl(null)}
            className="mb-2 text-body-sm text-primary"
          >
            ← Türkiye
          </button>
          <DistrictMap ilSlug={normalizeRegionName(selectedIl)} ilceStats={ilceStats} />
        </div>
      ) : (
        <TurkeyMap ilStats={ilStats} onIlClick={setSelectedIl} />
      )}
      <MapLegend />
    </div>
  );
}
