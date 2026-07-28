import { formatPercent } from "@/lib/format";

interface MapTooltipProps {
  name: string;
  kargoSayisi: number;
  slaIci: number;
  slaDisi: number;
  x: number;
  y: number;
}

// Bir şehre/ilçeye mouse ile üzerine gelince açılan küçük özet — tıklayınca
// açılan CityDetailPanel'in aynı bilgisini (başarı oranı + kargo/SLA içi/dışı),
// tıklamadan önce hızlıca göz atmak için. Fare imlecini takip ediyor
// (position: fixed), tıklama/drill-down davranışına dokunmuyor.
export default function MapTooltip({ name, kargoSayisi, slaIci, slaDisi, x, y }: MapTooltipProps) {
  const basariOrani = kargoSayisi > 0 ? (slaIci / kargoSayisi) * 100 : 0;

  return (
    <div
      className="pointer-events-none fixed z-50 rounded-md border border-hairline-strong bg-surface-card p-2"
      style={{ left: x + 14, top: y + 14 }}
    >
      <div className="text-body-sm text-ink">{name}</div>
      <div className="text-headline-sm text-ink">{formatPercent(basariOrani)}</div>
      <div className="text-label-caps text-muted">Başarı Oranı</div>
      <div className="text-body-sm mt-1 text-muted">
        {kargoSayisi} kargo · {slaIci} SLA İçi · {slaDisi} SLA Dışı
      </div>
    </div>
  );
}
