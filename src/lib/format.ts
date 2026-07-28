export function formatPercent(value: number): string {
  if (value === 0) return "%0";
  const rounded = Math.round(value * 100) / 100;
  return `%${rounded}`;
}
