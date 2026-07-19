"use client";

import { useMemo, useState } from "react";
import TurkeyMap, { type IlStat } from "./TurkeyMap";
import DistrictMap, { type IlceStat } from "./DistrictMap";
import MapLegend from "./MapLegend";
import CityDetailPanel from "./CityDetailPanel";
import { normalizeRegionName } from "@/lib/text";
import type { RegionStat } from "@/types";

export interface SelectedRegion {
  il: string;
  /** null ise il seviyesinde seçili, dolu ise o ilin bir ilçesi seçili. */
  ilce: string | null;
}

interface MapPanelProps {
  regionStats: RegionStat[];
  /** Verilirse MapPanel kontrollü çalışır (karşılaştırma görünümünde senkron seçim için). */
  selected?: SelectedRegion | null;
  onSelect?: (region: SelectedRegion | null) => void;
}

export default function MapPanel({ regionStats, selected: controlledSelected, onSelect }: MapPanelProps) {
  const [localSelected, setLocalSelected] = useState<SelectedRegion | null>(null);
  const isControlled = controlledSelected !== undefined;
  const selected = isControlled ? controlledSelected : localSelected;

  function setSelected(region: SelectedRegion | null) {
    onSelect?.(region);
    if (!isControlled) setLocalSelected(region);
  }

  const selectedIl = selected?.il ?? null;

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

  const detail = useMemo(() => {
    if (!selected) return null;
    if (selected.ilce) {
      const stat = ilceStats.get(selected.ilce);
      const row = regionStats.find((r) => r.il === selected.il && r.ilce === selected.ilce);
      return {
        name: selected.ilce,
        kargoSayisi: stat?.kargoSayisi ?? 0,
        slaIci: row?.sla_ici ?? 0,
        slaDisi: stat?.slaDisi ?? 0,
      };
    }
    const stat = ilStats.get(selected.il) ?? { kargoSayisi: 0, slaDisi: 0 };
    const slaIci = regionStats
      .filter((row) => row.il === selected.il)
      .reduce((sum, row) => sum + row.sla_ici, 0);
    return { name: selected.il, kargoSayisi: stat.kargoSayisi, slaIci, slaDisi: stat.slaDisi };
  }, [selected, ilStats, ilceStats, regionStats]);

  function handleIlClick(il: string) {
    setSelected({ il, ilce: null });
  }

  function handleIlceClick(ilce: string) {
    if (!selectedIl) return;
    setSelected({ il: selectedIl, ilce });
  }

  function handleBack() {
    setSelected(null);
  }

  return (
    <div className="relative">
      {selectedIl ? (
        <div>
          <button type="button" onClick={handleBack} className="mb-2 text-body-sm text-primary">
            ← Türkiye
          </button>
          <DistrictMap
            ilSlug={normalizeRegionName(selectedIl)}
            ilceStats={ilceStats}
            onIlceClick={handleIlceClick}
            selectedName={selected?.ilce ?? null}
          />
        </div>
      ) : (
        <TurkeyMap ilStats={ilStats} onIlClick={handleIlClick} selectedName={selected?.il ?? null} />
      )}
      <MapLegend />
      {detail && (
        <CityDetailPanel
          name={detail.name}
          kargoSayisi={detail.kargoSayisi}
          slaIci={detail.slaIci}
          slaDisi={detail.slaDisi}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
