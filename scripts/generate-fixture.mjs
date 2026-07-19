import { utils, writeFile } from "xlsx";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

let maliNo = 1000;
const rows = [["Mali no", "İl", "İlçe", "SLA durum"]];

function addRows(il, ilce, slaIciCount, slaDisiCount) {
  for (let i = 0; i < slaIciCount; i++) {
    rows.push([maliNo++, il, ilce, "SLA içi"]);
  }
  for (let i = 0; i < slaDisiCount; i++) {
    rows.push([maliNo++, il, ilce, "SLA dışı"]);
  }
}

addRows("Van", "Erciş", 7, 3); // %30 -> kırmızı (critical)
addRows("Mersin", "Tarsus", 17, 3); // %15 -> turuncu (high)
addRows("Bursa", "Nilüfer", 19, 1); // %5 -> mavi (moderate)
addRows("Kayseri", "Melikgazi", 15, 0); // %0 -> yeşil (clean)
addRows("Kayseri", "Talas", 6, 4); // aynı ilde farklı renkte ilçe

// Eşleşmeyen satırlar
rows.push([maliNo++, "", "", "SLA içi"]); // İl boş
rows.push([maliNo++, "Marslılık", "Test", "SLA içi"]); // tanınmayan il
rows.push([maliNo++, "Adana", "Seyhan", "Bilinmiyor"]); // geçersiz SLA durum

const sheet = utils.aoa_to_sheet(rows);
const workbook = utils.book_new();
utils.book_append_sheet(workbook, sheet, "Kargo");

mkdirSync(fileURLToPath(new URL("../test/fixtures", import.meta.url)), { recursive: true });
writeFile(workbook, fileURLToPath(new URL("../test/fixtures/sample-kargo.xlsx", import.meta.url)));
console.log(`Fixture üretildi: ${rows.length - 1} veri satırı.`);
