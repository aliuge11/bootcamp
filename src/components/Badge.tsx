import { SLA_BUCKET_COLORS } from "@/lib/slaColor";
import type { SlaBucket } from "@/types";

const SOFT_BG: Record<SlaBucket, string> = {
  critical: "#3a1e1c",
  high: "#3a2e18",
  moderate: "#162a33",
  clean: "#1e2a16",
  "no-data": "#2a2a2a",
};

export default function Badge({ bucket, children }: { bucket: SlaBucket; children: string }) {
  return (
    <span
      className="text-label-caps inline-block shrink-0 whitespace-nowrap rounded-sm px-2 py-1"
      style={{ backgroundColor: SOFT_BG[bucket], color: SLA_BUCKET_COLORS[bucket] }}
    >
      {children}
    </span>
  );
}
