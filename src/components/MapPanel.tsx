"use client";

import { useEffect, useMemo, useState } from "react";
import TurkeyMap, { type IlStat } from "./TurkeyMap";
import DistrictMap, { type IlceStat } from "./DistrictMap";
import MapLegend from "./MapLegend";
import CityDetailPanel from "./CityDetailPanel";
import BolgeComparisonPanel from "./BolgeComparisonPanel";
import NavToolbar from "./NavToolbar";
import { useSelectionHistory } from "@/lib/useSelectionHistory";
import { normalizeRegionName } from "@/lib/text";
import type { RegionStat } from "@/types";

export interface SelectedRegion {
  il: string;
  /** null ise il seviyesinde seçili, dolu ise o ilin bir ilçesi seçili. */
  ilce: string | null;
}

interface MapPanelProps {
  regionStats: RegionStat[];
  /** Verilirse MapPanel kontrollü çalışır (karşılaştırma görünümünde senkron seçim için); Geri/İleri de üst bileşen tarafından yönetilir. */
  selected?: SelectedRegion | null;
  onSelect?: (region: SelectedRegion | null) => void;
  /** Verilirse İl/Bölge etiket modu da üst bileşen tarafından senkron yönetilir (karşılaştırmada bir haritada değiştirince hepsi değişsin diye). */
  labelMode?: "il" | "bolge";
  onLabelModeChange?: (mode: "il" | "bolge") => void;
}

export default function MapPanel({
  regionStats,
  selected: controlledSelected,
  onSelect,
  labelMode: controlledLabelMode,
  onLabelModeChange,
}: MapPanelProps) {
  const isControlled = controlledSelected !== undefined;
  const localHistory = useSelectionHistory<SelectedRegion | null>(null);
  const selected = isControlled ? controlledSelected : localHistory.current;

  const isLabelModeControlled = controlledLabelMode !== undefined;
  const [localLabelMode, setLocalLabelMode] = useState<"il" | "bolge">("il");
  const labelMode = isLabelModeControlled ? controlledLabelMode : localLabelMode;

  function setLabelMode(mode: "il" | "bolge") {
    if (isLabelModeControlled) {
      onLabelModeChange?.(mode);
    } else {
      setLocalLabelMode(mode);
    }
  }

  function setSelected(region: SelectedRegion | null) {
    if (isControlled) {
      onSelect?.(region);
    } else {
      localHistory.push(region);
    }
  }

  const selectedIl = selected?.il ?? null;

  // Detay paneli, seçim değiştiğinde (tıklama veya Geri/İleri) otomatik açılıyor;
  // ✕ ile kapatmak sadece paneli gizliyor, drill-down durumunu bozmuyor —
  // kullanıcı panel kapalıyken de ilçeleri serbestçe tıklayabiliyor.
  const [detailOpen, setDetailOpen] = useState(false);
  useEffect(() => {
    if (selected) setDetailOpen(true);
  }, [selected]);

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

  return (
    <div>
      {!isControlled && (
        <NavToolbar
          onBack={localHistory.goBack}
          onForward={localHistory.goForward}
          canGoBack={localHistory.canGoBack}
          canGoForward={localHistory.canGoForward}
        />
      )}
      {!selectedIl && (
        <div className="mb-2 flex gap-2">
          <button
            type="button"
            onClick={() => setLabelMode("il")}
            className={
              labelMode === "il"
                ? "text-body-sm h-8 rounded border border-primary bg-primary px-3 text-white"
                : "text-body-sm h-8 rounded border border-hairline-strong bg-surface-card px-3 text-ink"
            }
          >
            İl bazlı
          </button>
          <button
            type="button"
            onClick={() => setLabelMode("bolge")}
            className={
              labelMode === "bolge"
                ? "text-body-sm h-8 rounded border border-primary bg-primary px-3 text-white"
                : "text-body-sm h-8 rounded border border-hairline-strong bg-surface-card px-3 text-ink"
            }
          >
            Bölge bazlı
          </button>
        </div>
      )}
      <div className="flex items-start">
        <div className="relative min-w-0 flex-1 overflow-hidden">
          {selectedIl ? (
            <DistrictMap
              ilSlug={normalizeRegionName(selectedIl)}
              ilceStats={ilceStats}
              onIlceClick={handleIlceClick}
              selectedName={selected?.ilce ?? null}
            />
          ) : (
            <TurkeyMap
              ilStats={ilStats}
              onIlClick={handleIlClick}
              selectedName={selected?.il ?? null}
              labelMode={labelMode}
            />
          )}
          <MapLegend />
        </div>
        {detail && detailOpen && (
          <div className={isControlled ? "w-64 shrink-0" : "w-80 shrink-0"}>
            <CityDetailPanel
              name={detail.name}
              kargoSayisi={detail.kargoSayisi}
              slaIci={detail.slaIci}
              slaDisi={detail.slaDisi}
              onClose={() => setDetailOpen(false)}
            />
          </div>
        )}
        {!detail && labelMode === "bolge" && (
          <div className={isControlled ? "w-64 shrink-0" : "w-80 shrink-0"}>
            <BolgeComparisonPanel regionStats={regionStats} />
          </div>
        )}
      </div>
    </div>
  );
}
