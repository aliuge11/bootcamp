import { NextResponse } from "next/server";
import { parseKargoWorkbook } from "@/lib/xlsxImport";
import { generateUploadId } from "@/lib/slug";
import { query, withTransaction } from "@/lib/db";
import type { UploadRecord } from "@/types";

export async function GET() {
  const uploads = await query<UploadRecord>(
    "SELECT * FROM uploads WHERE hidden = false ORDER BY uploaded_at DESC",
  );
  return NextResponse.json({ uploads });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Xlsx dosyası bulunamadı." }, { status: 400 });
  }

  const nameField = formData.get("name");
  const displayName = typeof nameField === "string" && nameField.trim() ? nameField.trim() : null;

  const buffer = Buffer.from(await file.arrayBuffer());
  let parsed;
  try {
    parsed = parseKargoWorkbook(buffer);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Xlsx dosyası okunamadı.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
  const id = generateUploadId();

  await withTransaction(async (query) => {
    await query(
      `INSERT INTO uploads (id, original_filename, display_name, total_rows, matched_rows, unmatched_rows, unmatched_details)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        id,
        file.name,
        displayName,
        parsed.totalRows,
        parsed.matchedRows,
        parsed.unmatchedRows,
        parsed.unmatchedDetails.length > 0 ? JSON.stringify(parsed.unmatchedDetails) : null,
      ],
    );

    // region_stats satırları tek tek değil, toplu (multi-row) INSERT ile
    // yazılıyor: gerçek bir aylık dosya yüzlerce benzersiz il/ilçe üretebiliyor
    // (ör. 491), her biri için ayrı INSERT yapmak Netlify fonksiyon süresini
    // aşıp yüklemeyi "format hatası" gibi gösteren bir timeout'a yol açıyordu.
    // Postgres'in ~65535 parametre sınırına takılmamak için parçalara bölünüyor.
    const CHUNK = 500; // 500 satır × 6 sütun = 3000 parametre, sınırın çok altında
    for (let start = 0; start < parsed.aggregates.length; start += CHUNK) {
      const chunk = parsed.aggregates.slice(start, start + CHUNK);
      const placeholders = chunk
        .map((_, i) => {
          const b = i * 6;
          return `($${b + 1}, $${b + 2}, $${b + 3}, $${b + 4}, $${b + 5}, $${b + 6})`;
        })
        .join(", ");
      const params = chunk.flatMap((agg) => [
        id,
        agg.il,
        agg.ilce,
        agg.kargoSayisi,
        agg.slaIci,
        agg.slaDisi,
      ]);
      await query(
        `INSERT INTO region_stats (upload_id, il, ilce, kargo_sayisi, sla_ici, sla_disi) VALUES ${placeholders}`,
        params,
      );
    }
  });

  return NextResponse.json({
    id,
    totalRows: parsed.totalRows,
    matchedRows: parsed.matchedRows,
    unmatchedRows: parsed.unmatchedRows,
    unmatchedDetails: parsed.unmatchedDetails,
  });
}
