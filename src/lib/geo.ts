import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import { normalizeRegionName, toTitleCaseTr } from "./text";

export { normalizeRegionName, toTitleCaseTr };

export interface RegionIndexEntry {
  canonicalIl: string;
  ilSlug: string;
  /** normalizedIlce -> canonical (title-case) ilce adı */
  districts: Map<string, string>;
}

let cachedIndex: Map<string, RegionIndexEntry> | null = null;

/**
 * public/geo altındaki topojson/geojson dosyalarından, il ve ilçe adlarının
 * normalize edilmiş (küçük harf, Türkçe locale) haline göre bir eşleştirme
 * indeksi kurar. Xlsx içe aktarma ve harita render'ı aynı indeksi kullanır.
 */
export function loadRegionIndex(): Map<string, RegionIndexEntry> {
  if (cachedIndex) return cachedIndex;

  const geoDir = path.join(process.cwd(), "public", "geo");
  const topology = JSON.parse(readFileSync(path.join(geoDir, "turkey.topojson"), "utf8")) as Topology;
  const objectKey = Object.keys(topology.objects)[0];
  const fc = feature(topology, topology.objects[objectKey]) as unknown as {
    features: { properties: { name: string } }[];
  };

  const index = new Map<string, RegionIndexEntry>();
  for (const f of fc.features) {
    const canonicalIl = f.properties.name;
    const ilSlug = normalizeRegionName(canonicalIl);
    const districts = new Map<string, string>();

    const districtFile = path.join(geoDir, "districts", `${ilSlug}.geojson`);
    if (existsSync(districtFile)) {
      const districtGeo = JSON.parse(readFileSync(districtFile, "utf8")) as {
        features: { properties: { name: string } }[];
      };
      for (const d of districtGeo.features) {
        const rawName = d.properties.name;
        districts.set(normalizeRegionName(rawName), toTitleCaseTr(rawName));
      }
    }

    index.set(ilSlug, { canonicalIl, ilSlug, districts });
  }

  cachedIndex = index;
  return index;
}

/** Xlsx'teki İl/İlçe adını canonical (topojson'daki) haline eşleştirir. */
export function resolveRegion(
  ilRaw: string,
  ilceRaw: string,
): { il: string; ilce: string } | null {
  const index = loadRegionIndex();
  const entry = index.get(normalizeRegionName(ilRaw));
  if (!entry) return null;

  const ilce = entry.districts.get(normalizeRegionName(ilceRaw));
  if (!ilce) return null;

  return { il: entry.canonicalIl, ilce };
}
