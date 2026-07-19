import { query } from "@/lib/db";
import HomeContent from "@/components/HomeContent";
import type { UploadRecord } from "@/types";

// Yükleme geçmişi her istekte güncel olmalı — build zamanında statik snapshot alınamaz.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const uploads = await query<UploadRecord>(
    "SELECT * FROM uploads WHERE hidden = false ORDER BY uploaded_at DESC",
  );
  return <HomeContent uploads={uploads} />;
}
