import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { utils, write } from "xlsx";
import { parseKargoWorkbook } from "@/lib/xlsxImport";

function buildWorkbookBuffer(rows: unknown[][]): Buffer {
  const sheet = utils.aoa_to_sheet(rows);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, sheet, "Sheet1");
  return write(workbook, { type: "buffer", bookType: "xlsx" });
}

function loadFixture() {
  const buffer = readFileSync(path.join(process.cwd(), "test/fixtures/sample-kargo.xlsx"));
  return parseKargoWorkbook(buffer);
}

describe("parseKargoWorkbook", () => {
  it("toplam/eşleşen/eşleşmeyen satır sayılarını doğru hesaplıyor", () => {
    const result = loadFixture();
    expect(result.totalRows).toBe(78);
    expect(result.matchedRows).toBe(75);
    expect(result.unmatchedRows).toBe(3);
  });

  it("eşleşmeyen satırların sebeplerini doğru işaretliyor", () => {
    const result = loadFixture();
    const reasons = result.unmatchedDetails.map((d) => d.reason).sort();
    expect(reasons).toEqual(["SLA durum tanınmadı", "il/ilçe eşleşmedi", "il/ilçe eşleşmedi"]);
  });

  function findAggregate(result: ReturnType<typeof loadFixture>, il: string, ilce: string) {
    return result.aggregates.find((a) => a.il === il && a.ilce === ilce);
  }

  it("Van/Erciş için %30 SLA dışı oranını doğru topluyor", () => {
    const agg = findAggregate(loadFixture(), "Van", "Erciş");
    expect(agg).toEqual({ il: "Van", ilce: "Erciş", kargoSayisi: 10, slaIci: 7, slaDisi: 3 });
  });

  it("Mersin/Tarsus için %15 SLA dışı oranını doğru topluyor", () => {
    const agg = findAggregate(loadFixture(), "Mersin", "Tarsus");
    expect(agg).toEqual({ il: "Mersin", ilce: "Tarsus", kargoSayisi: 20, slaIci: 17, slaDisi: 3 });
  });

  it("Bursa/Nilüfer için %5 SLA dışı oranını doğru topluyor", () => {
    const agg = findAggregate(loadFixture(), "Bursa", "Nilüfer");
    expect(agg).toEqual({ il: "Bursa", ilce: "Nilüfer", kargoSayisi: 20, slaIci: 19, slaDisi: 1 });
  });

  it("Kayseri/Melikgazi için %0 SLA dışı oranını doğru topluyor", () => {
    const agg = findAggregate(loadFixture(), "Kayseri", "Melikgazi");
    expect(agg).toEqual({ il: "Kayseri", ilce: "Melikgazi", kargoSayisi: 15, slaIci: 15, slaDisi: 0 });
  });

  it("aynı ilin farklı ilçelerini ayrı satır olarak topluyor (Kayseri/Talas)", () => {
    const agg = findAggregate(loadFixture(), "Kayseri", "Talas");
    expect(agg).toEqual({ il: "Kayseri", ilce: "Talas", kargoSayisi: 10, slaIci: 6, slaDisi: 4 });
  });

  it("sütun sırası beklenenden farklıysa (İl/İlçe yer değiştirmiş) hata fırlatıyor", () => {
    const buffer = buildWorkbookBuffer([
      ["Mali no", "İlçe", "İl", "SLA durum"],
      ["1", "Kadıköy", "İstanbul", "SLA İçi"],
    ]);
    expect(() => parseKargoWorkbook(buffer)).toThrow(/2\. sütun "İl" olmalı, "İlçe" bulundu/);
  });

  it("başlık satırı eksikse (dosya boşsa) hata fırlatıyor", () => {
    const buffer = buildWorkbookBuffer([["Mali no", "İl"]]);
    expect(() => parseKargoWorkbook(buffer)).toThrow(/3\. sütun "İlçe" olmalı, "\(boş\)" bulundu/);
  });
});
