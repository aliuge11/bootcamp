import { describe, expect, it } from "vitest";
import { loadRegionIndex } from "@/lib/geo";
import { getBolge, aggregateByBolge } from "@/lib/bolge";

describe("getBolge", () => {
  it("gerçek topojson'daki 81 ilin hepsi için bir bölge döndürüyor", () => {
    const index = loadRegionIndex();
    const missing = Array.from(index.values())
      .map((entry) => entry.canonicalIl)
      .filter((il) => getBolge(il) === null);
    expect(missing).toEqual([]);
    expect(index.size).toBe(81);
  });

  it("bilinmeyen bir il için null döndürüyor", () => {
    expect(getBolge("Marslılık")).toBeNull();
  });

  it("örnek illeri doğru bölgeye eşliyor", () => {
    expect(getBolge("İstanbul")).toBe("Marmara");
    expect(getBolge("Van")).toBe("Doğu Anadolu");
    expect(getBolge("Gaziantep")).toBe("Güneydoğu Anadolu");
  });
});

describe("aggregateByBolge", () => {
  it("aynı bölgedeki farklı illerin satırlarını topluyor", () => {
    const rows = [
      { il: "İstanbul", kargo_sayisi: 10, sla_ici: 8, sla_disi: 2 },
      { il: "Bursa", kargo_sayisi: 5, sla_ici: 5, sla_disi: 0 },
      { il: "Van", kargo_sayisi: 4, sla_ici: 1, sla_disi: 3 },
    ];
    const result = aggregateByBolge(rows);
    const marmara = result.find((r) => r.bolge === "Marmara");
    const dogu = result.find((r) => r.bolge === "Doğu Anadolu");
    expect(marmara).toEqual({ bolge: "Marmara", kargoSayisi: 15, slaIci: 13, slaDisi: 2 });
    expect(dogu).toEqual({ bolge: "Doğu Anadolu", kargoSayisi: 4, slaIci: 1, slaDisi: 3 });
  });

  it("veri olmayan bölgeleri de 0 kargo ile listede tutuyor (7 bölge her zaman dönüyor)", () => {
    const rows = [{ il: "İstanbul", kargo_sayisi: 10, sla_ici: 8, sla_disi: 2 }];
    const result = aggregateByBolge(rows);
    expect(result).toHaveLength(7);
    const ege = result.find((r) => r.bolge === "Ege");
    expect(ege).toEqual({ bolge: "Ege", kargoSayisi: 0, slaIci: 0, slaDisi: 0 });
  });

  it("tanınmayan ili yok sayıyor ama 7 bölgeyi yine de döndürüyor", () => {
    const rows = [{ il: "Marslılık", kargo_sayisi: 5, sla_ici: 5, sla_disi: 0 }];
    const result = aggregateByBolge(rows);
    expect(result).toHaveLength(7);
    expect(result.every((r) => r.kargoSayisi === 0)).toBe(true);
  });
});
