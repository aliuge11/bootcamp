import { describe, expect, it } from "vitest";
import { normalizeRegionName, toTitleCaseTr } from "@/lib/text";
import { resolveRegion } from "@/lib/geo";

describe("normalizeRegionName", () => {
  it("trim ve Türkçe küçük harfe çeviriyor", () => {
    expect(normalizeRegionName("  İstanbul ")).toBe("istanbul");
    expect(normalizeRegionName("Isparta")).toBe("ısparta");
  });
});

describe("toTitleCaseTr", () => {
  it("Türkçe İ/I ayrımını doğru büyütüyor", () => {
    expect(toTitleCaseTr("melikgazi")).toBe("Melikgazi");
    expect(toTitleCaseTr("ısparta")).toBe("Isparta");
    expect(toTitleCaseTr("istanbul")).toBe("İstanbul");
  });
});

describe("resolveRegion", () => {
  it("bilinen il/ilçeyi canonical haline eşleştiriyor", () => {
    expect(resolveRegion("van", "erciş")).toEqual({ il: "Van", ilce: "Erciş" });
    expect(resolveRegion(" KAYSERİ ", "melikgazi")).toEqual({ il: "Kayseri", ilce: "Melikgazi" });
  });

  it("tanınmayan il için null döndürüyor", () => {
    expect(resolveRegion("Marslılık", "Test")).toBeNull();
  });

  it("bilinen ilin tanınmayan ilçesi için null döndürüyor", () => {
    expect(resolveRegion("Van", "Olmayanİlçe")).toBeNull();
  });
});
