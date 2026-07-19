export default function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-md border border-hairline bg-surface-card p-panel-padding">
      <div className="text-display-lg text-ink">{value}</div>
      <div className="text-label-caps text-muted">{label}</div>
    </div>
  );
}
