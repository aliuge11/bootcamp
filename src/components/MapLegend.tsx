import { SLA_BUCKET_COLORS, SLA_BUCKET_LABELS } from "@/lib/slaColor";
import type { SlaBucket } from "@/types";

const ORDER: SlaBucket[] = ["critical", "high", "moderate", "clean", "no-data"];

export default function MapLegend() {
  return (
    <div className="absolute bottom-4 right-4 rounded-sm border border-hairline bg-surface-card p-3 text-body-sm shadow-sm">
      {ORDER.map((bucket) => (
        <div key={bucket} className="flex items-center gap-2 py-0.5">
          <span
            className="h-3 w-3 shrink-0 rounded-none"
            style={{ backgroundColor: SLA_BUCKET_COLORS[bucket] }}
          />
          <span className="text-body-sm">{SLA_BUCKET_LABELS[bucket]}</span>
        </div>
      ))}
    </div>
  );
}
