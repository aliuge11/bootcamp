import { query } from "@/lib/db";
import HomeContent from "@/components/HomeContent";
import type { UploadRecord } from "@/types";

// Yükleme geçmişi her istekte güncel olmalı — build zamanında statik snapshot alınamaz.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const uploads = await query<UploadRecord>(
    "SELECT * FROM uploads WHERE hidden = false ORDER BY uploaded_at DESC",
  );
  const firstUploadId = uploads.length >= 2 ? uploads[uploads.length - 1].id : null;
  const lastUploadId = uploads.length >= 2 ? uploads[0].id : null;
  return <HomeContent uploads={uploads} firstUploadId={firstUploadId} lastUploadId={lastUploadId} />;
}
