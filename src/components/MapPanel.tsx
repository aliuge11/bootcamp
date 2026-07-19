"use client";

import { useMemo, useState } from "react";
import TurkeyMap, { type IlStat } from "./TurkeyMap";
import DistrictMap, { type IlceStat } from "./DistrictMap";
import MapLegend from "./MapLegend";
import CityDetailPanel from "./CityDetailPanel";
import { normalizeRegionName } from "@/lib/text";
import type { RegionStat } from "@/types";

interface MapPanelProps {
  regionStats: RegionStat[];
}

interface SelectedDetail {
  name: string;
  kargoSayisi: number;
  slaIci: number;
  slaDisi: number;
}

export default function MapPanel({ regionStats }: MapPanelProps) {
  const [selectedIl, setSelectedIl] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<SelectedDetail | null>(null);

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

  function handleIlClick(il: string) {
    setSelectedIl(il);
    const stat = ilStats.get(il) ?? { kargoSayisi: 0, slaDisi: 0 };
    const slaIci = regionStats
      .filter((row) => row.il === il)
      .reduce((sum, row) => sum + row.sla_ici, 0);
    setSelectedDetail({ name: il, kargoSayisi: stat.kargoSayisi, slaIci, slaDisi: stat.slaDisi });
  }

  function handleIlceClick(ilce: string) {
    const stat = ilceStats.get(ilce);
    const row = regionStats.find((r) => r.il === selectedIl && r.ilce === ilce);
    if (!stat || !row) return;
    setSelectedDetail({ name: ilce, kargoSayisi: stat.kargoSayisi, slaIci: row.sla_ici, slaDisi: stat.slaDisi });
  }

  function handleBack() {
    setSelectedIl(null);
    setSelectedDetail(null);
  }

  return (
    <div className="relative">
      {selectedIl ? (
        <div>
          <button
            type="button"
            onClick={handleBack}
            className="mb-2 text-body-sm text-primary"
          >
            ← Türkiye
          </button>
          <DistrictMap ilSlug={normalizeRegionName(selectedIl)} ilceStats={ilceStats} onIlceClick={handleIlceClick} />
        </div>
      ) : (
        <TurkeyMap ilStats={ilStats} onIlClick={handleIlClick} />
      )}
      <MapLegend />
      {selectedDetail && (
        <CityDetailPanel
          name={selectedDetail.name}
          kargoSayisi={selectedDetail.kargoSayisi}
          slaIci={selectedDetail.slaIci}
          slaDisi={selectedDetail.slaDisi}
          onClose={() => setSelectedDetail(null)}
        />
      )}
    </div>
  );
}
