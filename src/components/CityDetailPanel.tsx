import StatTile from "./StatTile";
import Badge from "./Badge";
import { getSlaBucket } from "@/lib/slaColor";
import { formatPercent } from "@/lib/format";

interface CityDetailPanelProps {
  name: string;
  kargoSayisi: number;
  slaIci: number;
  slaDisi: number;
  onClose: () => void;
}

export default function CityDetailPanel({
  name,
  kargoSayisi,
  slaIci,
  slaDisi,
  onClose,
}: CityDetailPanelProps) {
  const slaDisiOrani = kargoSayisi > 0 ? (slaDisi / kargoSayisi) * 100 : 0;
  const basariOrani = kargoSayisi > 0 ? (slaIci / kargoSayisi) * 100 : 0;
  const bucket = getSlaBucket(kargoSayisi, slaDisi);

  return (
    <div className="h-full border-l border-l-hairline-strong bg-surface-card p-panel-padding">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h2 className="text-headline-sm text-ink">{name}</h2>
          <div className="mt-1">
            <Badge bucket={bucket}>{`${formatPercent(slaDisiOrani)} SLA Dışı`}</Badge>
          </div>
        </div>
        <button type="button" onClick={onClose} className="text-body-sm text-muted" aria-label="Kapat">
          ✕
        </button>
      </div>
      {/* Başarı oranı tek hero kutu (asıl bakılacak sayı); kargo/SLA içi/SLA dışı
          küçük ve yan yana — dört büyük kutuyu alt alta dizmek paneli
          gereksiz uzatıp ekranın altındaki karşılaştırma özetini görünmez
          kılıyordu. "SLA İçi"/"SLA Dışı" tam terimi korunuyor (kısaltma
          yok); dar sütunda kırılmalarını önlemek için compact StatTile'ın
          yatay padding'i daraltıldı, bkz. StatTile.tsx. */}
      <div className="flex flex-col gap-2">
        <StatTile value={formatPercent(basariOrani)} label="Başarı Oranı" />
        <div className="grid grid-cols-3 gap-2">
          <StatTile compact value={String(kargoSayisi)} label="Kargo" />
          <StatTile compact value={String(slaIci)} label="SLA İçi" />
          <StatTile compact value={String(slaDisi)} label="SLA Dışı" />
        </div>
      </div>
    </div>
  );
}
