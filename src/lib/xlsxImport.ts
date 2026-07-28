import { read, utils } from "xlsx";
import { resolveRegion } from "./geo";
import { normalizeRegionName } from "./text";
import type { UnmatchedRowDetail } from "@/types";

const EXPECTED_HEADERS = ["Mali no", "İl", "İlçe", "SLA durum"];

export interface RegionAggregate {
  il: string;
  ilce: string;
  kargoSayisi: number;
  slaIci: number;
  slaDisi: number;
}

export interface ParsedKargoWorkbook {
  aggregates: RegionAggregate[];
  totalRows: number;
  matchedRows: number;
  unmatchedRows: number;
  unmatchedDetails: UnmatchedRowDetail[];
}

const SLA_ICI = "sla içi";
const SLA_DISI = "sla dışı";

// Veri satırları sütun pozisyonuna göre okunuyor (bkz. aşağıdaki row[1]/row[2]/row[3]),
// başlık satırının içeriği aksi halde hiç kontrol edilmiyor. Sütun sırası beklenenden
// farklıysa (ör. İl/İlçe yer değiştirmiş) veri sessizce yanlış eşleşir — bu yüzden
// başlık satırı burada EXPECTED_HEADERS'a karşı doğrulanıyor, uymazsa içe aktarma
// hata ile durduruluyor.
function validateHeaderRow(headerRow: unknown[]): void {
  for (let i = 0; i < EXPECTED_HEADERS.length; i++) {
    const actual = String(headerRow[i] ?? "").trim();
    if (normalizeRegionName(actual) !== normalizeRegionName(EXPECTED_HEADERS[i])) {
      throw new Error(
        `${i + 1}. sütun "${EXPECTED_HEADERS[i]}" olmalı, "${actual || "(boş)"}" bulundu. Sütun sırası: ${EXPECTED_HEADERS.join(" / ")}.`,
      );
    }
  }
}

export function parseKargoWorkbook(buffer: Buffer): ParsedKargoWorkbook {
  const workbook = read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  // header: 1 -> satırları A/B/C/D sırasına göre dizi olarak okur.
  const rows = utils.sheet_to_json<unknown[]>(sheet, { header: 1, blankrows: false });

  validateHeaderRow(rows[0] ?? []);
  const dataRows = rows.slice(1); // ilk satır başlık, atlanıyor.

  const totals = new Map<string, RegionAggregate>();
  const unmatchedDetails: UnmatchedRowDetail[] = [];
  let matchedRows = 0;

  dataRows.forEach((row, index) => {
    const rowNumber = index + 2; // xlsx'teki gerçek satır no (1-index + başlık satırı)
    const ilRaw = String(row[1] ?? "").trim();
    const ilceRaw = String(row[2] ?? "").trim();
    const slaRaw = String(row[3] ?? "").trim();
    const slaNormalized = normalizeRegionName(slaRaw);

    if (slaNormalized !== SLA_ICI && slaNormalized !== SLA_DISI) {
      unmatchedDetails.push({ row: rowNumber, il: ilRaw, ilce: ilceRaw, reason: "SLA durum tanınmadı" });
      return;
    }

    const resolved = resolveRegion(ilRaw, ilceRaw);
    if (!resolved) {
      unmatchedDetails.push({ row: rowNumber, il: ilRaw, ilce: ilceRaw, reason: "il/ilçe eşleşmedi" });
      return;
    }

    matchedRows += 1;
    const key = `${resolved.il}||${resolved.ilce}`;
    const existing = totals.get(key) ?? {
      il: resolved.il,
      ilce: resolved.ilce,
      kargoSayisi: 0,
      slaIci: 0,
      slaDisi: 0,
    };
    existing.kargoSayisi += 1;
    if (slaNormalized === SLA_ICI) existing.slaIci += 1;
    else existing.slaDisi += 1;
    totals.set(key, existing);
  });

  return {
    aggregates: Array.from(totals.values()),
    totalRows: dataRows.length,
    matchedRows,
    unmatchedRows: unmatchedDetails.length,
    unmatchedDetails,
  };
}
