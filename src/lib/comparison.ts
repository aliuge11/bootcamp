import type { RegionStat } from "@/types";

export interface AggregateTotals {
  kargoSayisi: number;
  slaIci: number;
  slaDisi: number;
}

export interface RegionFilter {
  il?: string;
  ilce?: string;
}

export function aggregateRegionStats(rows: RegionStat[], filter?: RegionFilter): AggregateTotals {
  const filtered = rows.filter((r) => {
    if (filter?.il && r.il !== filter.il) return false;
    if (filter?.ilce && r.ilce !== filter.ilce) return false;
    return true;
  });
  return filtered.reduce<AggregateTotals>(
    (acc, r) => ({
      kargoSayisi: acc.kargoSayisi + r.kargo_sayisi,
      slaIci: acc.slaIci + r.sla_ici,
      slaDisi: acc.slaDisi + r.sla_disi,
    }),
    { kargoSayisi: 0, slaIci: 0, slaDisi: 0 },
  );
}

export function basariOrani(totals: AggregateTotals): number | null {
  if (totals.kargoSayisi === 0) return null;
  return (totals.slaIci / totals.kargoSayisi) * 100;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export interface ComparisonResult {
  scopeLabel: string;
  earlierKargo: number;
  laterKargo: number;
  earlierRate: number | null;
  laterRate: number | null;
  diff: number | null;
  direction: "arttı" | "azaldı" | "değişmedi" | null;
}

export function compareTotals(
  scopeLabel: string,
  earlier: AggregateTotals,
  later: AggregateTotals,
): ComparisonResult {
  const earlierRate = basariOrani(earlier);
  const laterRate = basariOrani(later);

  if (earlierRate === null || laterRate === null) {
    return {
      scopeLabel,
      earlierKargo: earlier.kargoSayisi,
      laterKargo: later.kargoSayisi,
      earlierRate,
      laterRate,
      diff: null,
      direction: null,
    };
  }

  const diff = round1(laterRate - earlierRate);
  const direction = diff > 0 ? "arttı" : diff < 0 ? "azaldı" : "değişmedi";

  return {
    scopeLabel,
    earlierKargo: earlier.kargoSayisi,
    laterKargo: later.kargoSayisi,
    earlierRate: round1(earlierRate),
    laterRate: round1(laterRate),
    diff,
    direction,
  };
}
