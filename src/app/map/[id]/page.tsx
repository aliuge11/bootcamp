import { query } from "@/lib/db";
import MapPanel from "@/components/MapPanel";
import type { RegionStat, UploadRecord } from "@/types";

async function getUpload(id: string) {
  const uploads = await query<UploadRecord>("SELECT * FROM uploads WHERE id = $1", [id]);
  return uploads[0] ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const upload = await getUpload(id);
  const name = upload?.display_name ?? upload?.original_filename;
  return { title: name ? `${name} — Etkileşimli Şehir Haritası` : "Etkileşimli Şehir Haritası" };
}

export default async function MapPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const upload = await getUpload(id);
  if (!upload) {
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
      <h1 className="text-headline-sm mb-2 text-ink">{upload.display_name ?? upload.original_filename}</h1>
      <MapPanel regionStats={regionStats} />
    </div>
  );
}
