import { SLA_BUCKET_COLORS } from "@/lib/slaColor";
import type { SlaBucket } from "@/types";

const SOFT_BG: Record<SlaBucket, string> = {
  critical: "#fbe4e2",
  high: "#fdf0dc",
  moderate: "#e4f3fa",
  clean: "#eef6e4",
  "no-data": "#c4c4c4",
};

export default function Badge({ bucket, children }: { bucket: SlaBucket; children: string }) {
  return (
    <span
      className="text-label-caps inline-block rounded-sm px-2 py-1"
      style={{ backgroundColor: SOFT_BG[bucket], color: SLA_BUCKET_COLORS[bucket] }}
    >
      {children}
    </span>
  );
}
