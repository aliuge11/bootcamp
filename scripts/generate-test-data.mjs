import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { utils, writeFile } from "xlsx";

function normalize(name) {
  return name.trim().toLocaleLowerCase("tr-TR");
}
function toTitleCaseTr(name) {
  return name
    .split(" ")
    .map((w) => (w.length === 0 ? w : w[0].toLocaleUpperCase("tr-TR") + w.slice(1).toLocaleLowerCase("tr-TR")))
    .join(" ");
}

const geoDir = fileURLToPath(new URL("../public/geo", import.meta.url));
const topology = JSON.parse(readFileSync(path.join(geoDir, "turkey.topojson"), "utf8"));
const objectKey = Object.keys(topology.objects)[0];
const geometries = topology.objects[objectKey].geometries;

const provinces = geometries.map((g) => {
  const il = g.properties.name;
  const ilSlug = normalize(il);
  const districtFile = path.join(geoDir, "districts", `${ilSlug}.geojson`);
  const districtGeo = JSON.parse(readFileSync(districtFile, "utf8"));
  const ilce = toTitleCaseTr(districtGeo.features[0].properties.name);
  return { il, ilce };
});

console.log(`${provinces.length} il yüklendi.`);

// 81 il, 1000 satır -> ile başına ~12 satır, kalan illere +1 dağıtılıyor.
const TOTAL_ROWS = 1000;
const base = Math.floor(TOTAL_ROWS / provinces.length);
const baseRemainder = TOTAL_ROWS - base * provinces.length;

function buildRows(seedOffset) {
  const rows = [["Mali no", "İl", "İlçe", "SLA durum"]];
  let maliNo = 100000 + seedOffset * 100000;
  let rem = baseRemainder;

  provinces.forEach((p, index) => {
    const count = base + (rem > 0 ? (rem--, 1) : 0);
    // İlden ile değişen, dosyalar arası da farklı bir SLA dışı oranı üretir
    // (%0-%40 arası) -> haritada 5 rengin de görülebilmesi ve karşılaştırma
    // özetinin anlamlı bir fark göstermesi için.
    const wave = Math.sin(index * 1.7 + seedOffset * 2.3);
    const disiRate = Math.max(0, Math.min(0.4, 0.2 + wave * 0.2));
    const disiCount = Math.round(count * disiRate);
    const iciCount = count - disiCount;

    for (let i = 0; i < iciCount; i++) rows.push([maliNo++, p.il, p.ilce, "SLA içi"]);
    for (let i = 0; i < disiCount; i++) rows.push([maliNo++, p.il, p.ilce, "SLA dışı"]);
  });

  return rows;
}

function writeWorkbook(rows, filename) {
  const sheet = utils.aoa_to_sheet(rows);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, sheet, "Kargo");
  writeFile(workbook, filename);
  console.log(`${filename}: ${rows.length - 1} veri satırı.`);
}

const outDir = process.argv[2] ?? fileURLToPath(new URL("../test-data", import.meta.url));
writeWorkbook(buildRows(0), path.join(outDir, "test-tum-iller-1.xlsx"));
writeWorkbook(buildRows(1), path.join(outDir, "test-tum-iller-2.xlsx"));
