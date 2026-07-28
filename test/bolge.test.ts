import { describe, expect, it } from "vitest";
import { loadRegionIndex } from "@/lib/geo";
import { getBolge } from "@/lib/bolge";

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
