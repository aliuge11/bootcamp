# PLAN.md — Sıfırdan MVP'ye

Bu dosya, projeyi sıfırdan çalışan bir MVP'ye tek oturumda götürecek 10 adımı tanımlar. Bu talimatları yürüten Claude Code'a: adımları sırayla, atlamadan uygula.

## Kurallar

- **Soru sorma.** Bir belirsizlikle karşılaşırsan sırayla şuraya bak: (1) bu dosyadaki ilgili adım, (2) [INTENT](docs/intent/etkilesimli-sehir-haritasi.md) / [CLAUDE.md](CLAUDE.md) / [DESIGN.md](DESIGN.md) / [STYLE.md](STYLE.md) / [MEMORY.md](MEMORY.md). Hâlâ belirsizse, bu dosyalardaki kararların ruhuna en uygun, en basit seçeneği uygula ve MEMORY.md'ye neden o kararı verdiğini not düş. Kullanıcıya asla soru sorma.
- **Her adımın sonunda dört şey yapılır, sırayla:** (1) o adımın Kabul Kriteri'ndeki her kontrol geçene kadar düzelt, (2) `git add` + `git commit` (adımın Commit mesajı ile), (3) MEMORY.md > Oturum Özetleri'ne tarihli bir satır ekle, (4) o adımda ortaya çıkan, başka hiçbir dosyada yazılı olmayan bir teknik gerçek varsa MEMORY.md > Bilinen Gerçekler'e ekle.
- Bir adımın Kabul Kriteri geçmeden bir sonraki adıma geçme.
- Tüm UI metni Türkçe ve [STYLE.md](STYLE.md)'ye uygun. Tüm renk/tipografi/bileşen kararı [DESIGN.md](DESIGN.md)'deki token'lardan. Tüm mimari kısıt [CLAUDE.md](CLAUDE.md) ve INTENT.md'den.
- Paket yöneticisi **npm**. Node.js LTS varsayılıyor, internet erişimi (npm registry + GitHub raw) mevcut varsayılıyor.
- UI doğrulaması gerçek tarayıcıda yapılır (dev server + browser tool) — "muhtemelen çalışıyor" yeterli değildir, gerçekten açıp bakılır.

## Hedef klasör yapısı

```
bootcamp/
  .env.example
  next.config.ts
  postcss.config.mjs
  db/schema.sql
  scripts/db-setup.mjs
  scripts/generate-fixture.mjs
  public/geo/turkey.topojson
  public/geo/districts/{il-slug}.geojson   (81 dosya)
  src/app/layout.tsx
  src/app/page.tsx
  src/app/globals.css
  src/app/api/uploads/route.ts
  src/app/api/uploads/[id]/route.ts
  src/app/map/[id]/page.tsx
  src/app/map/compare/page.tsx
  src/components/{TurkeyMap,DistrictMap,MapPanel,MapLegend,CityDetailPanel,StatTile,Badge,UploadDropzone,UploadHistoryList}.tsx
  src/lib/{db,xlsxImport,slaColor,geo,slug}.ts
  src/types/index.ts
  test/fixtures/sample-kargo.xlsx
  test/{xlsxImport,slaColor,geo}.test.ts
```

## Sabit teknik kararlar (değiştirilmez, sorgulanmaz)

- **GeoJSON kaynağı:** [coskunomer/Turkish-Cities-Geojson-Dataset](https://github.com/coskunomer/Turkish-Cities-Geojson-Dataset) (MIT). `turkey.topojson` = 81 il sınırı, gerçek WGS84, `properties.name` düzgün Türkçe büyük harf (ör. "Kayseri"). `cities/{il-slug}.geojson` = 81 dosya, her biri o ilin ilçe sınırları, `properties.name` küçük harf (ör. "melikgazi"). İlçe dosyaları kendi yerel koordinat uzayında — bu yüzden ilçe haritası `d3.geoIdentity().fitSize()` ile render edilir, ülke haritasıyla aynı projeksiyon kullanılmaz.
- **Harita render katmanı:** `react-simple-maps` **kullanılmıyor** — son sürümü React 19 ile peer-dependency çakışması veriyor (16-18 istiyor). Bunun yerine doğrudan `d3-geo` + `topojson-client` ile ham SVG `<path>`/`<text>` render ediliyor (CLAUDE.md zaten "react-simple-maps / d3-geo" diyerek d3-geo'yu bağımsız alternatif olarak belirtmişti).
- **DB erişimi:** ham `pg` paketi, ORM yok. **Yerel DB:** Docker değil, native PostgreSQL 16 (winget ile) — bu makinede Docker kurulu değildi, kullanıcı native kurulumu tercih etti. `docker-compose.yml` yok.
- **Stil katmanı:** Tailwind CSS v4 (CSS-first `@theme`, `tailwind.config.ts` yok) — `npm install tailwindcss` en güncel sürümü (v4) getirdi, plan yazılırken v3 varsayılmıştı. Token'lar `src/app/globals.css`'teki `@theme` bloğunda.
- **Test:** Vitest, sadece saf mantık (`xlsxImport`, `slaColor`, `geo`) için.
- **Kalıcı URL:** `uploads.id` (nanoid, 10 karakter, küçük harf+rakam). `uploads` ve `region_stats` satırları hiçbir zaman `UPDATE`/`DELETE` edilmez, sadece `INSERT`. Tek harita: `/map/[id]`. Karşılaştırma: `/map/compare?ids=id1,id2,id3,id4`.
- **Senkron seçim + drill-down:** Karşılaştırma görünümünde bir haritada bir il/ilçeye tıklamak, görünür tüm haritalarda aynı bölgeyi hem seçili konturla (primary, 2-2.5px) işaretler hem de o bölgenin drill-down'ını ve detay panelini açar (INTENT.md: "İstanbul her iki haritada da açılmalı").

---

## Adım 1 — İskele

**Görev:**
1. `git init`, ardından mevcut dosyaları (`docs/`, `CLAUDE.md`, `DESIGN.md`, `STYLE.md`, `MEMORY.md`, `PLAN.md`) ilk commit olarak ekle.
2. `npx create-next-app@latest . --typescript --app --eslint --no-tailwind --src-dir --import-alias "@/*"` ile Next.js iskeleti kur (mevcut dosyaların üzerine yazmadığından emin ol — gerekirse `.` yerine geçici bir klasörde oluşturup dosyaları taşı).
3. Tailwind'i elle kur (`npm install -D tailwindcss @tailwindcss/postcss`, `postcss.config.mjs` ekle). Tailwind v4 CSS-first: `tailwind.config.ts` yok, tema `src/app/globals.css`'teki `@theme` bloğunda DESIGN.md'nin YAML frontmatter'ındaki `colors`/`rounded`/`spacing` değerleriyle birebir dolduruluyor (`--color-primary`, `--color-navy`, `--color-sla-critical`, vb.). `typography` token'ları Tailwind'in genel ölçeğine zorlanmıyor, DESIGN.md'deki rol adlarıyla birebir eşleşen plain CSS class'ları olarak yazılıyor (`.text-display-lg`, `.text-headline-md`, ...). Font ailesi Inter, `next/font/google` ile yükleniyor.
4. `next.config.ts`'e iframe izni ekle:
   ```ts
   import type { NextConfig } from "next";

   const nextConfig: NextConfig = {
     async headers() {
       return [
         {
           source: "/:path*",
           headers: [
             { key: "Content-Security-Policy", value: "frame-ancestors *" },
           ],
         },
       ];
     },
   };

   export default nextConfig;
   ```
   Not: `X-Frame-Options` başlığı hiç eklenmiyor (Next.js varsayılan olarak da eklemiyor) — eklenirse iframe gömme kırılır. `frame-ancestors *` bilinçli bir karar: PowerPoint Web Viewer eklentisinin hangi origin'den yükleyeceği bilinmiyor, iç araç olduğu ve auth olmadığı için (CLAUDE.md) kısıtlamanın maliyeti yok.
5. `.env.example` oluştur: `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mapapp`
6. Yerel DB: Docker yok, bu makinede native PostgreSQL 16 (`winget install -e --id PostgreSQL.PostgreSQL.16`) kuruluyor. `docker-compose.yml` yazılmıyor.
7. `npm install pg nanoid xlsx react-simple-maps d3-geo topojson-client` + `npm install -D @types/pg @types/react-simple-maps @types/topojson-client vitest`.
8. `src/app/layout.tsx`: kök layout, Inter fontu, `<html lang="tr">`, DESIGN.md'deki app-header bileşeninin (koyu lacivert bant) iskeleti.
9. CLAUDE.md'nin "Teknoloji yığını" listesine şu satırı ekle: `- **Tailwind CSS** — DESIGN.md token'larından üretilen tema ile stil katmanı.`

**Kabul Kriteri:**
- `npm run dev` hatasız açılıyor, `npm run build` hatasız tamamlanıyor.
- Boş sayfa Inter fontuyla, DESIGN.md'deki `surface` zemin rengiyle render oluyor (tarayıcıda kontrol et).
- `git log` en az 2 commit gösteriyor.

**Commit mesajı:** `Next.js iskeleti, Tailwind teması ve iframe izinleri kuruldu`

**MEMORY.md notu:** İskele adımı tamamlandı, Tailwind CLAUDE.md'ye eklendi, `frame-ancestors *` kararı ve gerekçesi.

---

## Adım 2 — Veritabanı

**Görev:**
1. `db/schema.sql`:
   ```sql
   CREATE TABLE IF NOT EXISTS uploads (
     id text PRIMARY KEY,
     original_filename text NOT NULL,
     uploaded_at timestamptz NOT NULL DEFAULT now(),
     total_rows integer NOT NULL,
     matched_rows integer NOT NULL,
     unmatched_rows integer NOT NULL,
     unmatched_details jsonb
   );

   CREATE TABLE IF NOT EXISTS region_stats (
     upload_id text NOT NULL REFERENCES uploads(id),
     il text NOT NULL,
     ilce text NOT NULL,
     kargo_sayisi integer NOT NULL,
     sla_ici integer NOT NULL,
     sla_disi integer NOT NULL,
     PRIMARY KEY (upload_id, il, ilce)
   );

   CREATE INDEX IF NOT EXISTS region_stats_upload_idx ON region_stats(upload_id);
   ```
   İl-seviyesi toplamlar hiç ayrı satır olarak tutulmuyor — her zaman `GROUP BY il` ile `region_stats`'tan türetiliyor.
2. `scripts/db-setup.mjs`:
   ```js
   import { readFileSync } from "node:fs";
   import { Client } from "pg";

   const client = new Client({ connectionString: process.env.DATABASE_URL });
   await client.connect();
   await client.query(readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8"));
   await client.end();
   console.log("Şema uygulandı.");
   ```
   `package.json`'a script ekle: `"db:setup": "node --env-file=.env scripts/db-setup.mjs"`.
3. `src/lib/db.ts`: `pg.Pool` singleton + `query<T>(text, params)` yardımcı fonksiyonu.
4. `src/types/index.ts`: `UploadRecord`, `RegionStat`, `SlaBucket` tipleri.

**Kabul Kriteri:**
- Native PostgreSQL servisi çalışıyor (Windows service olarak).
- `npm run db:setup` hatasız tamamlanıyor.
- Basit bir test insert + select (geçici bir script veya `psql -c` ile) iki tablonun da doğru şemayla var olduğunu doğruluyor.

**Commit mesajı:** `Postgres şeması ve db bağlantı katmanı eklendi`

**MEMORY.md notu:** DB kurulumu tamamlandı, şema kararı (il toplamları GROUP BY ile türetiliyor, ayrı satır yok).

---

## Adım 3 — Harita verisi ve temel render

**Görev:**
1. `public/geo/turkey.topojson`'ı `https://raw.githubusercontent.com/coskunomer/Turkish-Cities-Geojson-Dataset/main/turkey.topojson` adresinden indirip commitle.
2. 81 il dosyasını `https://raw.githubusercontent.com/coskunomer/Turkish-Cities-Geojson-Dataset/main/cities/{il-slug}.geojson`'dan `public/geo/districts/{il-slug}.geojson` olarak indir (dosya adları repodaki `cities/` klasörünün birebir aynısı, küçük harf Türkçe). Hepsini commitle.
3. `src/lib/geo.ts`: `normalizeRegionName(name: string)` (`trim().toLocaleLowerCase("tr-TR")`), `loadRegionIndex()` — `turkey.topojson`'ı `topojson-client` ile FeatureCollection'a çevirip il adlarının normalize edilmiş bir haritasını, her il için de kendi ilçe dosyasındaki ilçe adlarının normalize edilmiş halini içeren bir yapı döndürüyor (`Map<normalizedIl, { canonicalIl: string, ilceSlug: string, districts: Map<normalizedIlce, canonicalIlce> }>`).
4. `src/components/TurkeyMap.tsx`: `d3-geo`'nun `geoMercator().fitSize(...)` + `geoPath()` ile `turkey.topojson`'ı (`topojson-client`'la FeatureCollection'a çevrilmiş) ham `<svg>`/`<path>` olarak render et. Şimdilik: tek düz dolgu rengi (DESIGN.md `surface-card`), `map-boundary` (beyaz) sınır çizgisi, her ilin `properties.name`'i `map-label` class'ıyla (beyaz + halo) merkeze (`path.centroid`) yazılıyor. Tıklama yok, renk skalası yok — bu adımda sadece statik render.
5. `src/components/DistrictMap.tsx`: aynı mantığın iskeleti, tek bir `il-slug` prop'u alıp o ilin GeoJSON'unu `d3.geoIdentity().fitSize()` ile render ediyor. Bu adımda sadece iskelet, henüz hiçbir sayfaya bağlanmıyor.
6. `src/app/page.tsx`'e `TurkeyMap`'i geçici olarak yerleştir (sonraki adımlarda gerçek ana sayfa haline gelecek).

**Kabul Kriteri:**
- Tarayıcıda (dev server + browser tool) 81 il görünüyor, sınır çizgileri düzgün, hiçbir il eksik/bozuk şekil değil.
- Her ilin adı okunur şekilde üzerinde yazıyor.
- Konsolda hata/uyarı yok.
- En az 3 farklı ilin `DistrictMap`'i (Kayseri, İstanbul, Ardahan gibi büyüklük farkı olan iller) ayrı bir geçici test sayfasında render edilip ilçe şekillerinin bozuk olmadığı doğrulanıyor.

**Commit mesajı:** `Türkiye il/ilçe GeoJSON verisi eklendi, temel harita render'ı çalışıyor`

**MEMORY.md notu:** GeoJSON kaynağı ve lisansı, ilçe dosyalarının kendi koordinat uzayında olduğu ve `geoIdentity().fitSize()` gerektirdiği gerçeği.

---

## Adım 4 — Xlsx içe aktarma

**Görev:**
1. `src/lib/xlsxImport.ts`: `parseKargoWorkbook(buffer: Buffer)` fonksiyonu.
   - `xlsx` paketiyle workbook'u oku, ilk sayfayı al.
   - **İlk satır başlık kabul edilip atlanıyor.** Veri, sütun adına değil A/B/C/D sırasına göre okunuyor: 0=Mali no, 1=İl, 2=İlçe, 3=SLA durum.
   - Her satır için: İl/İlçe boşsa veya `geo.ts`'teki `loadRegionIndex()` sonucuyla (normalize edilmiş) eşleşmiyorsa → satır `unmatchedDetails`'e `{row, il, ilce, reason: "il/ilçe eşleşmedi"}` olarak ekleniyor, aggregate'e dahil edilmiyor.
   - SLA durum, trim + case-insensitive olarak `"sla içi"` veya `"sla dışı"` ile eşleşmiyorsa → aynı şekilde `unmatchedDetails`'e `{row, reason: "SLA durum tanınmadı"}` ekleniyor.
   - Eşleşen satırlar `Map<"il||ilce", {kargoSayisi, slaIci, slaDisi}>` olarak toplanıyor (canonical il/ilçe adlarıyla, normalize edilmiş değil).
   - Dönüş: `{ aggregates, totalRows, matchedRows, unmatchedRows, unmatchedDetails }`.
2. `test/fixtures/sample-kargo.xlsx` üretimi için `scripts/generate-fixture.mjs` yaz ve çalıştır (fixture dosyasını commitle). Aşağıdaki satırları üret (başlık satırı + bu satırlar):

   | İl | İlçe | SLA durum | Amaç |
   |---|---|---|---|
   | Van | Erciş | SLA dışı × 3, SLA içi × 7 (10 satır) | %30 → kırmızı (critical) |
   | Mersin | Tarsus | SLA dışı × 3, SLA içi × 17 (20 satır) | %15 → turuncu (high) |
   | Bursa | Nilüfer | SLA dışı × 1, SLA içi × 19 (20 satır) | %5 → mavi (moderate) |
   | Kayseri | Melikgazi | SLA içi × 15 (15 satır) | %0 → yeşil (clean) |
   | Kayseri | Talas | SLA dışı × 4, SLA içi × 6 (10 satır) | Aynı ilde farklı renkte ilçe |
   | *(satır)* | *(boş)* | SLA içi | Eşleşmeyen satır — İl boş |
   | Marslılık | Test | SLA içi | Eşleşmeyen satır — tanınmayan il adı |
   | Adana | Seyhan | Bilinmiyor | Eşleşmeyen satır — geçersiz SLA durum |

   Ardahan gibi bir il fixture'da hiç geçmiyor — bu, "veri yok" (gri) durumunu test etmek için bilinçli.
3. Vitest testleri (`test/xlsxImport.test.ts`, `test/geo.test.ts`): fixture'ı parse edip yukarıdaki beklenen aggregate değerlerini ve `unmatchedRows === 3` olduğunu doğrula.
4. `src/lib/slug.ts`: `generateUploadId()` — `nanoid`'in `customAlphabet` ile 10 karakter, küçük harf+rakam.
5. `src/app/api/uploads/route.ts`: `POST` — multipart form'dan xlsx al, `parseKargoWorkbook` çalıştır, `generateUploadId()` ile id üret, `uploads` + `region_stats`'a `INSERT` (transaction içinde), `{ id, totalRows, matchedRows, unmatchedRows, unmatchedDetails }` JSON döndür.
6. `src/app/api/uploads/[id]/route.ts`: `GET` — o upload'ın meta bilgisini ve `region_stats`'ını JSON döndür.

**Kabul Kriteri:**
- `npm test` tüm testler yeşil.
- Dev server açıkken `curl -F file=@test/fixtures/sample-kargo.xlsx http://localhost:3000/api/uploads` (veya eşdeğeri) ile gerçek bir POST atılıyor, dönen id ile `GET /api/uploads/[id]` çağrılıp DB'deki satırların yukarıdaki tabloyla birebir eşleştiği doğrulanıyor.
- `unmatchedRows` gerçekten 3, `unmatchedDetails` üç satırın da doğru sebebini içeriyor.

**Commit mesajı:** `Xlsx içe aktarma, aggregate hesaplama ve /api/uploads eklendi`

**MEMORY.md notu:** Xlsx okuma kuralı (sütun sırası, başlık atlama) uygulandı, fixture'ın kapsadığı senaryolar.

---

## Adım 5 — Harita renklendirme + lejant

**Görev:**
1. `src/lib/slaColor.ts`:
   ```ts
   export type SlaBucket = "critical" | "high" | "moderate" | "clean" | "no-data";

   export function getSlaBucket(kargoSayisi: number, slaDisi: number): SlaBucket {
     if (kargoSayisi === 0) return "no-data";
     const oran = (slaDisi / kargoSayisi) * 100;
     if (oran >= 25) return "critical";
     if (oran >= 10) return "high";
     if (oran > 0) return "moderate";
     return "clean";
   }

   // DESIGN.md > colors ile birebir senkron tutulmalı
   export const SLA_BUCKET_COLORS: Record<SlaBucket, string> = {
     critical: "#E5342A",
     high: "#F5A623",
     moderate: "#2CA0DB",
     clean: "#8BC34A",
     "no-data": "#C4C4C4",
   };
   ```
2. `test/slaColor.test.ts`: sınır değerlerini test et (%25 tam kırmızı, %24.99 turuncu, %10 tam turuncu, %9.99 mavi, %0.01 mavi, %0 yeşil, 0 kargo gri).
3. `TurkeyMap`'e prop olarak o upload'ın il bazlı aggregate'i (il → {kargoSayisi, slaDisi} — ilçe satırları `GROUP BY il` ile toplanmış) veriliyor, her ilin dolgu rengi `getSlaBucket` + `SLA_BUCKET_COLORS`'tan geliyor.
4. `src/components/MapLegend.tsx`: DESIGN.md'deki lejant bileşeni — 5 satır, renk karesi + aralık metni ("%25+", "%24 - %10", "%9 - %0.01", "%0", "Gönderim Yok"), haritanın sağ alt köşesinde.
5. `src/app/map/[id]/page.tsx`'i oluştur: verilen id'nin verisini `GET /api/uploads/[id]`'den çekip `TurkeyMap` + `MapLegend`'e bağla.

**Kabul Kriteri:**
- `npm test` yeşil (yeni slaColor testleri dahil).
- Sample fixture yüklenip `/map/[id]` açıldığında: Van kırmızı, Mersin turuncu, Bursa mavi, Kayseri yeşil (Melikgazi) görünüyor — tarayıcıda gözle doğrula. Veri olmayan iller (ör. Ardahan) gri.
- Lejant haritanın sağ altında, 5 satır doğru renk/metinle görünüyor.

**Commit mesajı:** `SLA dışı oranına göre 5 kategorili harita renklendirmesi ve lejant eklendi`

**MEMORY.md notu:** slaColor eşik testleri geçti, `/map/[id]` sayfası ilk kez uçtan uca çalışıyor.

---

## Adım 6 — Drill-down

**Görev:**
1. `MapPanel.tsx` bileşenini oluştur — bir haritanın tüm durumunu (`selectedIl: string | null`) tutan wrapper. `selectedIl === null` iken `TurkeyMap`, doluyken `DistrictMap` render ediyor.
2. `TurkeyMap`'e `onIlClick(il: string)` prop'u ekle; bir ile tıklanınca `MapPanel` `selectedIl`'i set ediyor.
3. `DistrictMap`'i tamamla: seçili ilin `region_stats`'ından o ilin ilçe aggregate'ini alıp aynı `getSlaBucket` mantığıyla ilçeleri renklendiriyor, ilçe sınırları (`map-district-boundary`, %70 opaklık) ve ilçe adları (`map-label-district`) görünüyor. İl sınırı bu görünümde gösterilmiyor (sadece o ilin kendi ilçe sınırları).
4. Geri dönüş kontrolü: `DistrictMap` üstünde küçük bir "Türkiye" / geri oku butonu — tıklanınca `selectedIl` null'a dönüyor, `TurkeyMap`'e geri geçiliyor.

**Kabul Kriteri:**
- Tarayıcıda bir ile (ör. Kayseri) tıklanınca harita o ilin ilçelerine geçiyor, Melikgazi yeşil, Talas turuncu/kırmızı (fixture'daki orana göre) görünüyor.
- İlçe adları okunur.
- Geri butonu Türkiye görünümüne dönüyor, önceki renklendirme korunuyor.

**Commit mesajı:** `İl → ilçe drill-down etkileşimi eklendi`

**MEMORY.md notu:** Drill-down akışı çalışıyor, MapPanel state deseni.

---

## Adım 7 — Detay paneli

**Görev:**
1. `src/components/StatTile.tsx`, `src/components/Badge.tsx`: DESIGN.md'deki `stat-tile` ve `badge-sla` bileşen spesifikasyonuna birebir uygun (bkz. DESIGN.md > Components).
2. `src/components/CityDetailPanel.tsx`: sağdan kayan drawer (DESIGN.md Elevation Seviye 3). Prop: seçili il veya ilçenin adı + `{kargoSayisi, slaIci, slaDisi}`. İçerik: 4 `StatTile` (Kargo Sayısı, SLA İçi, SLA Dışı, Başarı Oranı) + üstte bölge adı + SLA dışı oranı `badge-sla` (rengi `getSlaBucket` ile haritayla birebir eşleşiyor).
3. `MapPanel`'e bağla: bir il/ilçeye tıklanınca (Adım 6'daki `onIlClick`, ve `DistrictMap`'in kendi `onIlceClick`'i) `CityDetailPanel` açılıyor, ilgili bölge verisiyle doluyor. Kapatma butonu var.

**Kabul Kriteri:**
- Bir ile tıklandığında hem drill-down oluyor hem detay paneli açılıyor, sayılar DB'deki (fixture'daki) değerlerle birebir eşleşiyor (ör. Van: kargo 10, SLA dışı 3, başarı oranı %70).
- Panel kapatılıp yeniden bir bölgeye tıklanınca doğru veriyle yeniden açılıyor.

**Commit mesajı:** `Şehir/ilçe detay paneli (stat-tile + SLA rozeti) eklendi`

**MEMORY.md notu:** Detay paneli DB verisiyle doğrulandı.

---

## Adım 8 — Karşılaştırma + senkron seçim

**Görev:**
1. `src/app/map/compare/page.tsx`: `?ids=id1,id2,...` query param'ını okuyor. 1-4 id için o kadar `MapPanel`'i DESIGN.md'deki gibi eşit genişlikte, dikey hairline ayırıcılı sütunlarda yan yana gösteriyor. 4'ten fazla id varsa STYLE.md'deki hata mesajını göster: *"En fazla 4 harita aynı anda gösterilebilir. 5. dosyayı yüklemeden önce birini kapat."* ve sadece ilk 4'ü render et.
2. Senkron seçim: `compare` sayfası bir `selectedRegion: {level: "il"|"ilce", il: string, ilce?: string} | null` state'i tutuyor, tüm `MapPanel`'lere prop olarak geçiyor. Herhangi bir `MapPanel`'de bir bölgeye tıklanınca bu üst state güncelleniyor; her `MapPanel` kendi verisinde o bölge varsa (a) aynı bölgeye drill-down yapıyor/detay panelini açıyor, (b) primary renkli 2-2.5px kontur ekliyor. O haritada o bölge yoksa (ör. o dönemde hiç kargo yoksa) sadece "bu haritada bu bölge için veri yok" durumunu (no-data grisi zaten kendiliğinden gösteriyor) koruyor, hata vermiyor.

**Kabul Kriteri:**
- İki farklı upload id'siyle `/map/compare?ids=A,B` açılıyor, iki harita yan yana görünüyor.
- Bir haritada bir ile tıklanınca diğer haritada da aynı il seçili kontur + açık detay paneliyle görünüyor.
- 5 id ile açılınca hata mesajı görünüyor ve sadece 4 harita render ediliyor.

**Commit mesajı:** `Çoklu harita karşılaştırma ve senkron bölge seçimi eklendi`

**MEMORY.md notu:** Senkron seçim davranışı (kontur + drill-down birlikte) uçtan uca doğrulandı.

---

## Adım 9 — Ana sayfa / geçmiş

**Görev:**
1. `src/components/UploadDropzone.tsx`: DESIGN.md `upload-dropzone` spesifikasyonu, sürükle-bırak + dosya seç, `POST /api/uploads`'a gönderiyor, başarılıysa `/map/[id]`'ye yönlendiriyor. Hata durumunda STYLE.md'ye uygun somut mesaj (ör. eşleşmeyen satır sayısı varsa "N satır eşleşmedi: [liste]" uyarısı, ama upload yine de tamamlanmış sayılır — INTENT.md'nin veri kaybı olmama kriteri).
2. `src/components/UploadHistoryList.tsx`: `GET /api/uploads` (bu route'u da bu adımda ekle — tüm yüklemeleri tarihe göre listele) ile geçmiş yüklemeleri listeliyor, her satır `/map/[id]`'ye link. Bir veya daha fazla seçilip "Karşılaştır" ile `/map/compare?ids=...`'e gidilebiliyor (4 üstü seçimde aynı hata mesajı, seçim engelleniyor).
3. `src/app/page.tsx`: app-header + `UploadDropzone` + `UploadHistoryList` — gerçek ana sayfa.

**Kabul Kriteri:**
- Tarayıcıda uçtan uca: ana sayfadan yeni xlsx yükle → `/map/[id]`'ye yönlendiriliyor → ana sayfaya dön → az önceki yükleme geçmiş listesinde görünüyor → tekrar tıklanınca aynı haritaya (aynı URL) gidiyor.
- İki yükleme seçip "Karşılaştır"a basınca `/map/compare?ids=...` doğru açılıyor.
- 5 yükleme seçmeye çalışınca uyarı çıkıyor.

**Commit mesajı:** `Ana sayfa: yükleme geçmişi ve yeni xlsx yükleme akışı eklendi`

**MEMORY.md notu:** Uçtan uca altın yol (yükle → harita → geçmiş → karşılaştır) tarayıcıda doğrulandı.

---

## Adım 10 — Iframe/PowerPoint doğrulaması ve cila

**Görev:**
1. Geçici bir test HTML'i (`test/iframe-check.html`, commit'lenmeyecek/`.gitignore`'a eklenecek ya da `test/` altında kalabilir) içine `<iframe src="http://localhost:3000/map/[id]">` koy, tarayıcıda aç, haritanın gerçekten iframe içinde yüklenip tıklanabildiğini doğrula (Adım 1'deki `frame-ancestors *` başlığının çalıştığının kanıtı).
2. STYLE.md'ye karşı son geçiş: tüm buton/hata/boş-durum metinlerini STYLE.md'deki kurallarla (ünlem yok, özür yok, somut sayı, emir kipi) karşılaştır, sapma varsa düzelt.
3. DESIGN.md'nin Do's and Don'ts listesine karşı son görsel kontrol (tarayıcıda gözle): pill-shape yok, gradient/glow yok, primary mavi sadece etkileşim+seçili konturda, sınır çizgisiz komşu aynı-renk bölge yok.
4. Kısa bir `README.md` yaz: proje ne yapıyor (2-3 cümle), yerel geliştirme adımları (`docker compose up -d db`, `npm run db:setup`, `npm run dev`), hangi dosyanın ne işe yaradığı (INTENT/CLAUDE/DESIGN/STYLE/MEMORY/PLAN tek satırlık özetleriyle).
5. `npm run build` son kez temiz geçiyor mu doğrula.

**Kabul Kriteri:**
- Iframe testi: harita iframe içinde render oluyor, tıklama/drill-down/detay paneli iframe içinde de çalışıyor.
- `npm run build` hatasız.
- README güncel ve doğru.
- Tam golden-path (yükle → renkli harita → drill-down → detay paneli → karşılaştırma → geçmişten tekrar açma) tek bir tarayıcı oturumunda baştan sona çalışıyor.

**Commit mesajı:** `Iframe gömme doğrulandı, son cila ve README eklendi — MVP tamam`

**MEMORY.md notu:** MVP'nin uçtan uca tamamlandığı, iframe doğrulamasının sonucu, varsa STYLE/DESIGN'dan son anda düzeltilen sapmalar.
