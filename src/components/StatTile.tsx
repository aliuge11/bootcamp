interface StatTileProps {
  value: string;
  label: string;
  /** Küçük destekleyici metrikler için (kargo sayısı, SLA içi/dışı) — hero olmayan tek başarı oranı dışındakiler. */
  compact?: boolean;
}

export default function StatTile({ value, label, compact = false }: StatTileProps) {
  return (
    <div
      className={
        compact
          ? "rounded-md border border-hairline bg-surface-card p-2"
          : "rounded-md border border-hairline bg-surface-card p-panel-padding"
      }
    >
      <div className={compact ? "text-headline-sm text-ink" : "text-display-lg text-ink"}>{value}</div>
      <div className="text-label-caps text-muted">{label}</div>
    </div>
  );
}
