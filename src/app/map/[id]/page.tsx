import { query } from "@/lib/db";
import TurkeyMap, { type IlStat } from "@/components/TurkeyMap";
import MapLegend from "@/components/MapLegend";
import type { UploadRecord } from "@/types";

interface IlAggregateRow {
  il: string;
  kargo_sayisi: string;
  sla_disi: string;
}

export default async function MapPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const uploads = await query<UploadRecord>("SELECT * FROM uploads WHERE id = $1", [id]);
  if (uploads.length === 0) {
    return (
      <div className="p-6">
        <p className="text-body-md">Bu harita bulunamadı. Bağlantıyı kontrol et.</p>
      </div>
    );
  }

  const ilRows = await query<IlAggregateRow>(
    `SELECT il, SUM(kargo_sayisi) AS kargo_sayisi, SUM(sla_disi) AS sla_disi
     FROM region_stats WHERE upload_id = $1 GROUP BY il`,
    [id],
  );

  const ilStats = new Map<string, IlStat>(
    ilRows.map((row) => [
      row.il,
      { kargoSayisi: Number(row.kargo_sayisi), slaDisi: Number(row.sla_disi) },
    ]),
  );

  return (
    <div className="relative p-6">
      <TurkeyMap ilStats={ilStats} />
      <MapLegend />
    </div>
  );
}
