import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { RegionStat, UploadRecord } from "@/types";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const uploads = await query<UploadRecord>("SELECT * FROM uploads WHERE id = $1", [id]);
  if (uploads.length === 0) {
    return NextResponse.json({ error: "Yükleme bulunamadı." }, { status: 404 });
  }

  const regionStats = await query<RegionStat>(
    "SELECT * FROM region_stats WHERE upload_id = $1 ORDER BY il, ilce",
    [id],
  );

  return NextResponse.json({ upload: uploads[0], regionStats });
}

// Satır kalıcı olarak silinmiyor, sadece geçmiş listesinden gizleniyor —
// /map/[id] linki (ör. PowerPoint'e gömülü) çalışmaya devam ediyor.
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const result = await query<UploadRecord>(
    "UPDATE uploads SET hidden = true WHERE id = $1 RETURNING id",
    [id],
  );
  if (result.length === 0) {
    return NextResponse.json({ error: "Yükleme bulunamadı." }, { status: 404 });
  }

  return NextResponse.json({ id });
}
