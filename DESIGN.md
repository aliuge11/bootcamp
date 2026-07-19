---
name: Etkileşimli Şehir Haritası
description: BMW'nin kurumsal sitesinden ilham alan, veri yoğun bir lojistik/SLA kontrol paneli için tasarım sistemi. Harita renklendirmesi ödeal'in "SLA Dışı Kuralanlar" raporundaki 5 kategorili skalayı temel alıyor.
colors:
  primary: "#1C69D4"
  primary-hover: "#0653B6"
  primary-disabled: "#D6D6D6"
  navy: "#101B33"
  ink: "#1A1A1A"
  body: "#3C3C3C"
  muted: "#6B6B6B"
  muted-soft: "#9A9A9A"
  hairline: "#E6E6E6"
  hairline-strong: "#CCCCCC"
  surface: "#F7F6F3"
  surface-card: "#FFFFFF"
  sla-critical: "#E5342A"
  sla-critical-soft: "#FBE4E2"
  sla-high: "#F5A623"
  sla-high-soft: "#FDF0DC"
  sla-moderate: "#2CA0DB"
  sla-moderate-soft: "#E4F3FA"
  sla-clean: "#8BC34A"
  sla-clean-soft: "#EEF6E4"
  sla-no-data: "#C4C4C4"
  map-boundary: "#FFFFFF"
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: "700"
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: "700"
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: "600"
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: "400"
    lineHeight: 18px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: "600"
    lineHeight: 14px
    letterSpacing: 0.06em
  metric-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "600"
    lineHeight: 20px
    fontFeature: tnum
  map-label:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: "700"
    lineHeight: 14px
    letterSpacing: 0em
  map-label-district:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: "600"
    lineHeight: 13px
    letterSpacing: 0em
rounded:
  none: 0px
  sm: 4px
  DEFAULT: 6px
  md: 8px
  lg: 12px
spacing:
  unit: 8px
  container-padding: 24px
  card-gap: 16px
  section-margin: 32px
  panel-padding: 20px
components:
  app-header:
    backgroundColor: "{colors.navy}"
    textColor: "#FFFFFF"
    typography: "{typography.headline-sm}"
    height: 56px
  map-panel:
    backgroundColor: "{colors.surface-card}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.none}"
  map-province-boundary:
    strokeColor: "{colors.map-boundary}"
    strokeWidth: 1.5px
  map-district-boundary:
    strokeColor: "{colors.map-boundary}"
    strokeWidth: 1px
    strokeOpacity: 0.7
  map-legend:
    backgroundColor: "{colors.surface-card}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.sm}"
    typography: "{typography.body-sm}"
  stat-tile:
    backgroundColor: "{colors.surface-card}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.md}"
    padding: "{spacing.panel-padding}"
  stat-tile-value:
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
  stat-tile-label:
    textColor: "{colors.muted}"
    typography: "{typography.label-caps}"
  badge-sla:
    typography: "{typography.label-caps}"
    rounded: "{rounded.sm}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    typography: "{typography.body-md}"
    rounded: "{rounded.DEFAULT}"
    height: 40px
    padding: 0 16px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-primary-disabled:
    backgroundColor: "{colors.primary-disabled}"
    textColor: "#FFFFFF"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    borderColor: "{colors.hairline-strong}"
    rounded: "{rounded.DEFAULT}"
  upload-dropzone:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.hairline-strong}"
    textColor: "{colors.muted}"
    rounded: "{rounded.md}"
  table-row:
    borderColor: "{colors.hairline}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
---

## Overview

Referans: BMW'nin kurumsal sitesi — BMW M'in motorsport-gösterişli varyantından ayrı olarak, ölçülü ve oturaklı bir kurumsal-endüstriyel arayüz. Bu proje bir lojistik operasyon konsolu; "premium otomotiv konfigüratörü" sakinliğini, SLA verisiyle çalışan bir kontrol odasına taşıyor.

Ekranın işi ikna etmek değil, okunmak. Kullanıcı (iç ekip) zaten neden burada olduğunu biliyor; arayüzün görevi 81 ilin performansını tek bakışta okunur kılmak, sonra bir ile tıklandığında o ilin ilçelerine sakin bir şekilde inmek. Kompozisyon kırık beyaz/krem tonlu bir zemin üzerinde oturuyor; koyu lacivert bant yalnızca üst başlıkta (app-header) kullanılıyor. Haritanın kendi renk dili ise mevcut bir kurumsal rapordan (ödeal'in "SLA Dışı Kuralanlar" il bazlı haritası) doğrudan devralınıyor — bu proje o statik PowerPoint haritasının etkileşimli/canlı karşılığı, aynı 5 renkli okuma dilini konuşuyor.

## Colors

İki ayrı renk katmanı var: arayüz kromu (BMW'den ilham alan nötr + tek mavi vurgu) ve harita verisi (ödeal raporundan devralınan 5 kategorili SLA skalası). Bu ikisi asla karışmıyor — mavi (primary) hiçbir zaman haritanın SLA verisini boyamak için kullanılmıyor, harita renkleri de hiçbir zaman arayüz kromunda (buton, header) kullanılmıyor.

**Arayüz kromu:**
- **Primary — {colors.primary} (BMW mavisi):** Tek etkileşim rengi. Sadece birincil buton, seçili filtre ve link için. Haritada sadece "senkron seçili şehir" konturunda kullanılıyor (bkz. Map & Veri Görselleştirme) — SLA verisini değil, kullanıcı etkileşimini temsil ediyor.
- **Navy — {colors.navy}:** Sadece üst başlık (app-header) bandında.
- **Ink / Body / Muted / Muted-soft:** Metin hiyerarşisi. Ink başlıklarda ve büyük metrik rakamlarında, body varsayılan gövde metninde, muted ikincil etiketlerde, muted-soft yer tutucu metinde.
- **Hairline / Hairline-strong:** Kart kenarlıkları ve tablo ayırıcıları — haritanın kendi sınır çizgileriyle (map-boundary) karıştırılmıyor, ayrı bir token.
- **Surface / Surface-card:** Sayfa zemini kırık beyaz, kartlar/paneller saf beyaz.

**Harita / SLA skalası** — bir il veya ilçenin rengi, o bölgenin **SLA dışı oranına** (SLA dışı satır sayısı / toplam satır sayısı × 100) göre, referans rapordaki dört eşik ve gri "veri yok" durumuyla birebir aynı şekilde belirleniyor:

| Aralık | Token | Renk |
|:--|:--|:--|
| SLA dışı oranı ≥ %25 | {colors.sla-critical} | Kırmızı |
| %10 ≤ SLA dışı oranı ≤ %24 | {colors.sla-high} | Turuncu |
| %0.01 ≤ SLA dışı oranı ≤ %9 | {colors.sla-moderate} | Mavi (harita mavisi — primary'den farklı bir ton) |
| SLA dışı oranı = %0 (kargo var, hepsi SLA içi) | {colors.sla-clean} | Yeşil |
| O bölgede hiç kargo verisi yok | {colors.sla-no-data} | Gri |

Bu beş renk, harita dışında da aynı anlamda kullanılıyor: bir şehrin detay panelindeki SLA dışı rozeti (badge-sla) ve tablo satırındaki oran hücresi, o şehrin harita üzerindeki rengiyle birebir eşleşiyor — kullanıcı haritada gördüğü kırmızıyı panelde tekrar gördüğünde eşleşmeyi hemen kurabiliyor. `-soft` varyantları (ör. {colors.sla-critical-soft}) sadece rozet arka planında, metin rengi her zaman ana tonun kendisi.

- **Map-boundary — {colors.map-boundary}:** İl ve ilçe sınır çizgisi. Her zaman beyaz; dolgu rengi ne olursa olsun (kırmızıdan griye) üstünde okunur kalıyor.

## Typography

Tek aile: **Inter**. Yoğun sayısal veriyle çalışan bir kontrol panelinde ikinci bir aileye yer yok; hiyerarşi ağırlık ve boyutla kuruluyor.

- **Display-lg:** Şehir/ilçe detay panelindeki büyük metrikler (kargo sayısı, başarı oranı).
- **Headline-md / Headline-sm:** Sayfa başlıkları ve kart başlıkları.
- **Body-md / Body-sm:** Gövde metni ve tablo hücreleri.
- **Label-caps:** Büyük harf etiketler — rozetler, kolon başlıkları, metrik altyazıları.
- **Metric-md:** Tablo içi sayısal hücreler; `tnum` ile rakamlar dikey hizalanıyor.
- **Map-label / Map-label-district:** Haritanın üzerine doğrudan yazılan il/ilçe adları. Map-label (il, genel görünümde) map-label-district'ten (ilçe, bir ile girildiğinde) bir tık daha büyük ve ağır — il seviyesi her zaman ilçe seviyesinden görsel olarak daha baskın.

## Layout

- **Izgara:** 8px temel birim.
- **Kontrol şeridi:** Üstte sabit, {colors.navy} zeminli app-header.
- **Harita bölmesi:** Ekranın ana gövdesi. Tek harita yüklüyse tam genişlik; 2-4 harita yüklüyse eşit genişlikte dikey hairline ile ayrılmış sütunlara bölünüyor.
- **Harita lejantı:** Her haritanın sağ alt köşesinde sabit, referans rapordaki gibi 5 satırlık küçük bir kutu (map-legend) — renk kutusu + aralık etiketi.
- **Detay paneli:** Bir şehre tıklandığında haritanın sağından kayan sabit genişlikli bir panel (drawer).
- **Yoğunluk:** Container-padding (24px) ve card-gap (16px) dışında gereksiz negatif alan yok.

## Elevation & Depth

Derinlik gölgeyle değil, hairline kenarlıkla kuruluyor.

- **Seviye 1 (Zemin):** {colors.surface}, düz, dokusuz.
- **Seviye 2 (Kart/panel):** {colors.surface-card} + 1px {colors.hairline} kenarlık. Gölge yok veya en fazla `0 1px 2px rgba(0,0,0,0.04)`.
- **Seviye 3 (Detay paneli/drawer):** Seviye 2 ile aynı yüzey, ayrışmak için biraz daha belirgin bir sol kenarlık ({colors.hairline-strong}).
- Cam efekti, glow, gradient yok.

## Shapes

- **Kartlar/paneller:** {rounded.md} (8px).
- **Butonlar/input/rozet:** {rounded.DEFAULT} (6px), rozetler {rounded.sm} (4px). Pill-shape yok.
- **Harita:** {rounded.none}. İl/ilçe şekillerinin kendisi de gerçek coğrafi sınırları takip ediyor — sadeleştirilmiş/yuvarlatılmış poligon yok.

## Components

### Stat tile
İl/ilçe detay panelindeki her metrik (kargo sayısı, SLA içi, SLA dışı, başarı oranı) bir stat-tile. Bir panelde en fazla 4 stat-tile yan yana; sıkışınca 2x2'ye düşüyor.

### Badge (SLA dışı oranı)
badge-sla, o bölgenin SLA dışı oranı bucket'ına göre 5 renkten birini alıyor (sla-critical/high/moderate/clean/no-data — bkz. Colors tablosu), arka planı `-soft` varyantı. Rozet metni her zaman bir sayı içeriyor (ör. "%32 SLA Dışı"), sadece renk asla tek başına anlam taşımıyor.

### Button
Birincil aksiyon button-primary; ikincil aksiyonlar button-ghost. Sayfada aynı anda tek bir button-primary olmalı.

### Upload dropzone
Xlsx yükleme alanı sade bir kesikli-kenarlıklı (hairline-strong) dikdörtgen. Yükleme her zaman açık — yüklemeler kalıcı ve sınırsız (bkz. INTENT.md). 4 harita sınırı yükleme anında değil, geçmiş listesinden karşılaştırma için seçim yaparken uygulanıyor: 5. dosya seçilmeye çalışılırsa "en fazla 4 harita" uyarısı gösteriliyor, seçim engelleniyor.

### Map legend
Referans rapordaki lejant kutusunun birebir karşılığı: 5 satır, her satırda küçük bir renk karesi + aralık metni ("%25+", "%24 - %10", "%9 - %0.01", "%0", "Gönderim Yok"). Her haritanın kendi lejantı var (4 harita yan yanaysa 4 lejant).

## Map & Veri Görselleştirme

- **Dolgu rengi:** Her il (ve drill-down'da her ilçe), Colors bölümündeki 5 kategorili SLA dışı oranı skalasına göre boyanıyor. Bu bir gradient/sürekli skala değil — referans rapordaki gibi kesin dört eşikli, kategorik bir boyama.
- **Etiketler:** Her ilin adı, genel harita görünümünde doğrudan o ilin şekli üzerine yazılıyor (map-label). Bir ile tıklanıp o ilin ilçelerine girildiğinde, her ilçenin adı da kendi şekli üzerine yazılıyor (map-label-district). Referans rapordaki gibi haritanın dışına taşan kesikli ok/bağlantı çizgili etiketleme **kullanılmıyor** — bütün etiketler ilgili bölgenin üzerinde, haritanın içinde.
- **Sınır çizgileri:** Genel (ülke) görünümünde sadece il sınırları çizgiyle ayrılıyor (map-province-boundary, {colors.map-boundary}, 1.5px). Bir ile girildiğinde o ilin içindeki ilçe sınırları da çizgiyle ayrılıyor (map-district-boundary, aynı renk, 1px, %70 opaklık — il sınırından bir tık daha ince/soluk, böylece "bir alt kademe" hissi veriyor). Sınır çizgileri hiçbir zaman tamamen kaldırılmıyor — aksi halde aynı renkteki komşu bölgeler birbirine karışır.
- **Etiket okunabilirliği:** map-label ve map-label-district her zaman beyaz metin + koyu halo/text-shadow (`0 0 2px rgba(0,0,0,0.55)`) ile yazılıyor. Bu, dolgu rengi kırmızıdan açık griye kadar değişse bile (özellikle {colors.sla-no-data} ve {colors.sla-clean} gibi açık tonlarda) etiketin okunur kalmasını garantiliyor — dolgu rengine göre metin rengini değiştirme mantığı kurulmuyor, tek bir halo tekniği her bucket'ta çalışıyor.
- **Veri yok:** {colors.sla-no-data}, düz gri. Kırmızı veya turuncu değil — "veri yok" bir performans hatası değil.
- **Seçili/senkron şehir:** Bir haritada tıklanan şehir {colors.primary} renginde 2-2.5px kalınlığında bir dış kontur alıyor (dolgu rengi değişmiyor, sadece kontur ekleniyor); aynı şehir diğer (en fazla 4) haritada da aynı konturla vurgulanıyor. Bu konturun haritada mavi (primary) kullanılan tek yer olması bilinçli — SLA verisiyle karışmıyor, sadece "şu an seçili" anlamına geliyor.
- **PowerPoint / projeksiyon:** Harita, Web Viewer eklentisiyle bir slayt alanına ve projeksiyona sığacağı için 5 rengin birbirinden (özellikle kırmızı/turuncu ve mavi/gri ikilileri) uzaktan ve düşük kontrastlı bir projektörde bile ayırt edilebilir olması gerekiyor; ton ayarlanırken bu ikili karşılaştırmalar gözle test ediliyor.

## Do's and Don'ts

- **Do** haritadaki 5 rengi (kırmızı/turuncu/mavi/yeşil/gri) sadece SLA dışı oranı için kullan, başka hiçbir görsel anlam için kullanma.
- **Do** il/ilçe adlarını doğrudan ilgili bölgenin üzerine yaz; okunabilirlik için beyaz metin + halo kullan.
- **Do** il sınırlarını genel görünümde, ilçe sınırlarını sadece o ile girildiğinde göster — ikisini aynı anda tüm haritada göstermiyoruz (görsel gürültü).
- **Don't** referans rapordaki kesikli ok/bağlantı çizgili dış etiketleme stilini kopyalama — bizim haritamızda veri zaten bölgenin üzerinde.
- **Don't** haritaya veya kartlara gradient, glow, cam efekti (glassmorphism), gölge yığını ekleme.
- **Don't** primary maviyi SLA verisini boyamak için kullanma; mavi sadece "seçili şehir" konturu ve arayüz etkileşimi için.
- **Don't** pill-shape (tam yuvarlak) buton veya rozet kullanma; {rounded.DEFAULT}/{rounded.sm} dışına çıkma.
- **Don't** dört haritayı yan yana koyarken aralarına kart gölgesi/çerçevesi ekleme — tek bir ince hairline ayırıcı yeterli.
- **Don't** aynı renkteki komşu il/ilçeleri sınır çizgisiz bırakma — bitişik iki kırmızı il, aralarında çizgi olmadan tek bir leke gibi görünür.
