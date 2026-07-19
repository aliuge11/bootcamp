import StatTile from "./StatTile";
import Badge from "./Badge";
import { getSlaBucket } from "@/lib/slaColor";

interface CityDetailPanelProps {
  name: string;
  kargoSayisi: number;
  slaIci: number;
  slaDisi: number;
  onClose: () => void;
}

function formatPercent(value: number): string {
  if (value === 0) return "%0";
  const rounded = Math.round(value * 100) / 100;
  return `%${rounded}`;
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
      <div className="mb-4 flex items-start justify-between">
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
      <div className="grid grid-cols-2 gap-card-gap">
        <StatTile value={String(kargoSayisi)} label="Kargo Sayısı" />
        <StatTile value={String(slaIci)} label="SLA İçi" />
        <StatTile value={String(slaDisi)} label="SLA Dışı" />
        <StatTile value={formatPercent(basariOrani)} label="Başarı Oranı" />
      </div>
    </div>
  );
}
