import { describe, expect, it } from "vitest";
import { getSlaBucket } from "@/lib/slaColor";

describe("getSlaBucket", () => {
  it("kargo yoksa no-data", () => {
    expect(getSlaBucket(0, 0)).toBe("no-data");
  });

  it("%0 SLA dışı ise clean", () => {
    expect(getSlaBucket(100, 0)).toBe("clean");
  });

  it("%0.01 SLA dışı ise moderate (alt sınır)", () => {
    expect(getSlaBucket(10000, 1)).toBe("moderate");
  });

  it("%9.99 SLA dışı ise moderate (üst sınır)", () => {
    expect(getSlaBucket(10000, 999)).toBe("moderate");
  });

  it("%9 SLA dışı ise moderate", () => {
    expect(getSlaBucket(100, 9)).toBe("moderate");
  });

  it("%10 SLA dışı ise high (alt sınır)", () => {
    expect(getSlaBucket(100, 10)).toBe("high");
  });

  it("%24 SLA dışı ise high (üst sınıra yakın)", () => {
    expect(getSlaBucket(100, 24)).toBe("high");
  });

  it("%25 SLA dışı ise critical (alt sınır)", () => {
    expect(getSlaBucket(100, 25)).toBe("critical");
  });

  it("%30 SLA dışı ise critical", () => {
    expect(getSlaBucket(10, 3)).toBe("critical");
  });
});
