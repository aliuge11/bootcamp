import { aggregateRegionStats, compareTotals } from "@/lib/comparison";
import type { SelectedRegion } from "./MapPanel";
import type { RegionStat } from "@/types";

export interface ComparisonMapInfo {
  label: string;
  regionStats: RegionStat[];
}

interface ComparisonSummaryProps {
  earlier: ComparisonMapInfo;
  later: ComparisonMapInfo;
  selected: SelectedRegion | null;
}

function scopeLabelFor(selected: SelectedRegion | null): string {
  if (!selected) return "Türkiye (toplam)";
  if (!selected.ilce) return selected.il;
  return `${selected.il} / ${selected.ilce}`;
}

export default function ComparisonSummary({ earlier, later, selected }: ComparisonSummaryProps) {
  const filter = selected ? { il: selected.il, ilce: selected.ilce ?? undefined } : undefined;

  const earlierTotals = aggregateRegionStats(earlier.regionStats, filter);
  const laterTotals = aggregateRegionStats(later.regionStats, filter);
  const result = compareTotals(scopeLabelFor(selected), earlierTotals, laterTotals);
  const { diff, direction, earlierRate, laterRate } = result;

  return (
    <div className="mt-container-padding rounded-md border border-hairline bg-surface-card p-panel-padding">
      <div className="text-label-caps text-muted">Karşılaştırma</div>
      <h2 className="text-headline-sm mt-1 text-ink">{result.scopeLabel}</h2>
      <p className="text-body-sm mt-1 text-muted">
        {earlier.label} → {later.label}
      </p>

      {diff === null || direction === null || earlierRate === null || laterRate === null ? (
        <p className="text-body-md mt-3 text-ink">
          {result.earlierKargo === 0
            ? `${earlier.label} yüklemesinde bu bölge için veri yok.`
            : `${later.label} yüklemesinde bu bölge için veri yok.`}{" "}
          Karşılaştırma yapılamıyor.
        </p>
      ) : (
        <p className="text-body-md mt-3 text-ink">
          Başarı oranı %{earlierRate} → %{laterRate} ({diff > 0 ? "+" : ""}
          {diff} puan, {direction}). Kargo sayısı {result.earlierKargo} → {result.laterKargo}.
        </p>
      )}
    </div>
  );
}
