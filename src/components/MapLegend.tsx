import { SLA_BUCKET_COLORS, SLA_BUCKET_LABELS } from "@/lib/slaColor";
import type { SlaBucket } from "@/types";

const ORDER: SlaBucket[] = ["critical", "high", "moderate", "clean", "no-data"];

export default function MapLegend() {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-sm border border-hairline bg-surface-card px-3 py-2">
      {ORDER.map((bucket) => (
        <div key={bucket} className="flex items-center gap-2">
          <span
            className="h-3 w-3 shrink-0 rounded-none"
            style={{ backgroundColor: SLA_BUCKET_COLORS[bucket] }}
          />
          <span className="text-body-sm text-body">{SLA_BUCKET_LABELS[bucket]}</span>
        </div>
      ))}
    </div>
  );
}
