import { query } from "@/lib/db";
import CompareView from "@/components/CompareView";
import type { RegionStat, UploadRecord } from "@/types";

const MAX_MAPS = 4;

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const { ids: idsParam } = await searchParams;
  const requestedIds = (idsParam ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const tooMany = requestedIds.length > MAX_MAPS;
  const ids = requestedIds.slice(0, MAX_MAPS);

  const maps = [];
  for (const id of ids) {
    const uploads = await query<UploadRecord>("SELECT * FROM uploads WHERE id = $1", [id]);
    if (uploads.length === 0) continue;
    const regionStats = await query<RegionStat>(
      "SELECT * FROM region_stats WHERE upload_id = $1 ORDER BY il, ilce",
      [id],
    );
    maps.push({ id, regionStats });
  }

  return (
    <div className="flex h-[calc(100vh-56px)] flex-col">
      {tooMany && (
        <p className="text-body-sm bg-sla-critical-soft p-3 text-sla-critical">
          En fazla 4 harita aynı anda gösterilebilir. 5. dosyayı yüklemeden önce birini kapat.
        </p>
      )}
      {maps.length === 0 ? (
        <div className="p-6">
          <p className="text-body-md">Gösterilecek harita bulunamadı. Bağlantıyı kontrol et.</p>
        </div>
      ) : (
        <CompareView maps={maps} />
      )}
    </div>
  );
}
