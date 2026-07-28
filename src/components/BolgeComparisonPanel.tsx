import Badge from "./Badge";
import { aggregateByBolge } from "@/lib/bolge";
import { getSlaBucket } from "@/lib/slaColor";
import { formatPercent } from "@/lib/format";
import type { RegionStat } from "@/types";

export default function BolgeComparisonPanel({ regionStats }: { regionStats: RegionStat[] }) {
  const rows = aggregateByBolge(regionStats)
    .map((agg) => ({
      ...agg,
      slaDisiOrani: agg.kargoSayisi > 0 ? (agg.slaDisi / agg.kargoSayisi) * 100 : 0,
    }))
    // En kötü (en yüksek SLA dışı oranı) önce — operasyonel önceliğe göre.
    .sort((a, b) => b.slaDisiOrani - a.slaDisiOrani);

  return (
    <div className="h-full border-l border-l-hairline-strong bg-surface-card p-panel-padding">
      <h2 className="text-headline-sm mb-2 text-ink">Bölge Karşılaştırması</h2>
      <ul className="divide-y divide-hairline">
        {rows.map((row) => (
          <li key={row.bolge} className="flex items-center justify-between gap-2 py-2">
            <div className="min-w-0">
              <div className="text-body-md truncate text-ink">{row.bolge}</div>
              <div className="text-body-sm text-muted">
                {row.kargoSayisi} kargo · {row.slaIci} SLA İçi
              </div>
              <div className="text-body-sm text-muted">{row.slaDisi} SLA Dışı</div>
            </div>
            <Badge bucket={getSlaBucket(row.kargoSayisi, row.slaDisi)}>
              {formatPercent(row.slaDisiOrani)}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}
