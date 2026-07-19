import type { SlaBucket } from "@/types";

export function getSlaBucket(kargoSayisi: number, slaDisi: number): SlaBucket {
  if (kargoSayisi === 0) return "no-data";
  const oran = (slaDisi / kargoSayisi) * 100;
  if (oran >= 25) return "critical";
  if (oran >= 10) return "high";
  if (oran > 0) return "moderate";
  return "clean";
}

// DESIGN.md > colors ile birebir senkron tutulmalı
export const SLA_BUCKET_COLORS: Record<SlaBucket, string> = {
  critical: "#e5342a",
  high: "#f5a623",
  moderate: "#2ca0db",
  clean: "#8bc34a",
  "no-data": "#c4c4c4",
};

export const SLA_BUCKET_LABELS: Record<SlaBucket, string> = {
  critical: "%25+",
  high: "%24 - %10",
  moderate: "%9 - %0.01",
  clean: "%0",
  "no-data": "Gönderim Yok",
};
