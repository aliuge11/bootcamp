import { describe, expect, it } from "vitest";
import { aggregateRegionStats, basariOrani, compareTotals } from "@/lib/comparison";
import type { RegionStat } from "@/types";

const rows: RegionStat[] = [
  { upload_id: "a", il: "Van", ilce: "Erciş", kargo_sayisi: 10, sla_ici: 7, sla_disi: 3 },
  { upload_id: "a", il: "Van", ilce: "Saray", kargo_sayisi: 5, sla_ici: 5, sla_disi: 0 },
  { upload_id: "a", il: "Kayseri", ilce: "Melikgazi", kargo_sayisi: 20, sla_ici: 18, sla_disi: 2 },
];

describe("aggregateRegionStats", () => {
  it("filtresiz tüm satırları topluyor", () => {
    expect(aggregateRegionStats(rows)).toEqual({ kargoSayisi: 35, slaIci: 30, slaDisi: 5 });
  });

  it("il filtresiyle sadece o ilin ilçelerini topluyor", () => {
    expect(aggregateRegionStats(rows, { il: "Van" })).toEqual({
      kargoSayisi: 15,
      slaIci: 12,
      slaDisi: 3,
    });
  });

  it("il+ilçe filtresiyle tek satırı döndürüyor", () => {
    expect(aggregateRegionStats(rows, { il: "Van", ilce: "Erciş" })).toEqual({
      kargoSayisi: 10,
      slaIci: 7,
      slaDisi: 3,
    });
  });
});

describe("basariOrani", () => {
  it("kargo yoksa null döndürüyor", () => {
    expect(basariOrani({ kargoSayisi: 0, slaIci: 0, slaDisi: 0 })).toBeNull();
  });

  it("oranı doğru hesaplıyor", () => {
    expect(basariOrani({ kargoSayisi: 10, slaIci: 7, slaDisi: 3 })).toBe(70);
  });
});

describe("compareTotals", () => {
  it("artışı doğru raporluyor", () => {
    const result = compareTotals(
      "Toplam",
      { kargoSayisi: 10, slaIci: 7, slaDisi: 3 },
      { kargoSayisi: 20, slaIci: 18, slaDisi: 2 },
    );
    expect(result.earlierRate).toBe(70);
    expect(result.laterRate).toBe(90);
    expect(result.diff).toBe(20);
    expect(result.direction).toBe("arttı");
  });

  it("azalışı doğru raporluyor", () => {
    const result = compareTotals(
      "Toplam",
      { kargoSayisi: 10, slaIci: 9, slaDisi: 1 },
      { kargoSayisi: 10, slaIci: 5, slaDisi: 5 },
    );
    expect(result.diff).toBe(-40);
    expect(result.direction).toBe("azaldı");
  });

  it("değişmediğinde doğru raporluyor", () => {
    const result = compareTotals(
      "Toplam",
      { kargoSayisi: 10, slaIci: 5, slaDisi: 5 },
      { kargoSayisi: 20, slaIci: 10, slaDisi: 10 },
    );
    expect(result.diff).toBe(0);
    expect(result.direction).toBe("değişmedi");
  });

  it("bir tarafta veri yoksa null döndürüyor", () => {
    const result = compareTotals("Toplam", { kargoSayisi: 0, slaIci: 0, slaDisi: 0 }, {
      kargoSayisi: 10,
      slaIci: 5,
      slaDisi: 5,
    });
    expect(result.earlierRate).toBeNull();
    expect(result.diff).toBeNull();
    expect(result.direction).toBeNull();
  });
});
