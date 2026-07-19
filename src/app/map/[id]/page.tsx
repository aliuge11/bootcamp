import { query } from "@/lib/db";
import MapPanel from "@/components/MapPanel";
import type { RegionStat, UploadRecord } from "@/types";

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

  const regionStats = await query<RegionStat>(
    "SELECT * FROM region_stats WHERE upload_id = $1 ORDER BY il, ilce",
    [id],
  );

  return (
    <div className="p-6">
      <MapPanel regionStats={regionStats} />
    </div>
  );
}
