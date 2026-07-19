import { NextResponse } from "next/server";
import { parseKargoWorkbook } from "@/lib/xlsxImport";
import { generateUploadId } from "@/lib/slug";
import { withTransaction } from "@/lib/db";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Xlsx dosyası bulunamadı." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const parsed = parseKargoWorkbook(buffer);
  const id = generateUploadId();

  await withTransaction(async (query) => {
    await query(
      `INSERT INTO uploads (id, original_filename, total_rows, matched_rows, unmatched_rows, unmatched_details)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        id,
        file.name,
        parsed.totalRows,
        parsed.matchedRows,
        parsed.unmatchedRows,
        parsed.unmatchedDetails.length > 0 ? JSON.stringify(parsed.unmatchedDetails) : null,
      ],
    );

    for (const agg of parsed.aggregates) {
      await query(
        `INSERT INTO region_stats (upload_id, il, ilce, kargo_sayisi, sla_ici, sla_disi)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [id, agg.il, agg.ilce, agg.kargoSayisi, agg.slaIci, agg.slaDisi],
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
