---
name: Etkileşimli Şehir Haritası
description: BMW'nin kurumsal sitesinden ilham alan, veri yoğun bir lojistik/SLA kontrol paneli için tasarım sistemi. Harita renklendirmesi ödeal'in "SLA Dışı Kuralanlar" raporundaki 5 kategorili skalayı temel alıyor.
colors:
  primary: "#4C8EF0"
  primary-hover: "#6BA3F5"
  primary-disabled: "#3A3D45"
  navy: "#0A0C10"
  ink: "#F2F2F0"
  body: "#C9C9C7"
  muted: "#8B8D93"
  muted-soft: "#5B5E66"
  hairline: "#262A31"
  hairline-strong: "#383D46"
  surface: "#121417"
  surface-card: "#1A1D22"
  sla-critical: "#E5342A"
  sla-critical-soft: "#3A1E1C"
  sla-high: "#F5A623"
  sla-high-soft: "#3A2E18"
  sla-moderate: "#2CA0DB"
  sla-moderate-soft: "#162A33"
  sla-clean: "#8BC34A"
  sla-clean-soft: "#1E2A16"
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
  nav-button:
    backgroundColor: "{colors.surface-card}"
    borderColor: "{colors.hairline-strong}"
    textColor: "{colors.ink}"
    rounded: "{rounded.DEFAULT}"
    height: 32px
  nav-button-disabled:
    textColor: "{colors.muted-soft}"
    borderColor: "{colors.hairline}"
---

## Overview

Referans: BMW'nin kurumsal sitesi — BMW M'in motorsport-gösterişli varyantından ayrı olarak, ölçülü ve oturaklı bir kurumsal-endüstriyel arayüz. Bu proje bir lojistik operasyon konsolu; "premium otomotiv konfigüratörü" sakinliğini, SLA verisiyle çalışan bir kontrol odasına taşıyor.

Ekranın işi ikna etmek değil, okunmak. Kullanıcı (iç ekip) zaten neden burada olduğunu biliyor; arayüzün görevi 81 ilin performansını tek bakışta okunur kılmak, sonra bir ile tıklandığında o ilin ilçelerine sakin bir şekilde inmek. Kompozisyon koyu bir zemin üzerinde oturuyor (near-black, dokusuz) — bir kontrol odasının karanlık monitör duvarı gibi, harita üzerindeki 5 rengin ve stat kartlarının parlaklığı öne çıksın diye. Haritanın kendi renk dili mevcut bir kurumsal rapordan (ödeal'in "SLA Dışı Kuralanlar" il bazlı haritası) doğrudan devralınıyor — bu proje o statik PowerPoint haritasının etkileşimli/canlı karşılığı, aynı 5 renkli okuma dilini konuşuyor. Bu SLA renkleri tema koyu olsa da değişmiyor — referans rapordaki tanımları koruyor, sadece arayüz kromu (zemin, kart, yazı, kenarlık) koyu temaya uyarlanıyor.

## Colors

İki ayrı renk katmanı var: arayüz kromu (BMW'den ilham alan nötr + tek mavi vurgu) ve harita verisi (ödeal raporundan devralınan 5 kategorili SLA skalası). Bu ikisi asla karışmıyor — mavi (primary) hiçbir zaman haritanın SLA verisini boyamak için kullanılmıyor, harita renkleri de hiçbir zaman arayüz kromunda (buton, header) kullanılmıyor.

**Arayüz kromu (koyu tema):**
- **Primary — {colors.primary} (açık BMW mavisi):** Tek etkileşim rengi. Sadece birincil buton, seçili filtre ve link için. Haritada sadece "senkron seçili şehir" konturunda kullanılıyor (bkz. Map & Veri Görselleştirme) — SLA verisini değil, kullanıcı etkileşimini temsil ediyor. Koyu zeminde yeterli kontrast için ışık teması BMW mavisinden bir tık daha açık.
- **Navy — {colors.navy}:** Sayfa zemininden bile daha koyu, near-black bir ton — sadece üst başlık (app-header) bandında, ince bir "kontrol şeridi" hissi vermek için.
- **Ink / Body / Muted / Muted-soft:** Metin hiyerarşisi, açık tonlardan oluşuyor. Ink başlıklarda ve büyük metrik rakamlarında (kırık beyaza yakın, saf beyaz değil), body varsayılan gövde metninde, muted ikincil etiketlerde, muted-soft yer tutucu metinde.
- **Hairline / Hairline-strong:** Kart kenarlıkları ve tablo ayırıcıları — koyu zeminde ince, düşük kontrastlı çizgiler. Haritanın kendi sınır çizgileriyle (map-boundary) karıştırılmıyor, ayrı bir token.
- **Surface / Surface-card:** Sayfa zemini near-black, kartlar/paneller ondan bir tık açık koyu gri — derinlik farkı parlaklıkla kuruluyor (bkz. Elevation).

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
- **Kontrol şeridi:** Üstte sabit, {colors.navy} zeminli app-header — proje adı solda. Harita/karşılaştırma sayfalarında Geri/İleri/Ana Sayfa nav-button'ları bu şeridin **sağında, aynı satırda** görünüyor (`position: fixed`, şeridin yüksekliğiyle hizalı) — sayfanın kendi akışında ayrı bir satır kaplamıyor, bkz. Components > Navigasyon.
- **Harita bölmesi:** Ekranın ana gövdesi. Tek harita tam genişlik; iki harita eşit genişlikte, dikey hairline ile ayrılmış tek sıra sütun. **3 harita 2 üstte + 1 altta, 4 harita 2x2** — ikisi de 2 sütunlu bir ızgara (hem dikey hem yatay hairline), sadece satır sayısı farklı. Üç veya dört haritayı tek sırada yan yana koymak her birini gereğinden dar bırakıyordu; 2 sütuna bölününce harita en-boy oranı (yatay) genişlikten daha çok kazanıyor. Her haritanın adı (kullanıcının verdiği isim, yoksa dosya adı) kendi haritasının hemen üzerinde headline-sm ile gösteriliyor — tek harita görünümünde sayfanın üstünde, karşılaştırmada her sütunun kendi başlığı olarak.
- **Harita lejantı:** Her haritanın altında, yatay bir şerit (map-legend) — renk kutusu + aralık etiketi, 5 öğe. Haritanın üzerine bindirilmiyor (bkz. Components > Map legend).
- **Detay paneli:** Bir şehre tıklandığında haritanın **yanında**, kendi sütununda açılan sabit genişlikli bir panel — harita alanının üzerine **bindirilmiyor**. Panel açıkken harita bölmesi genişliğini panel kadar kaybediyor (flex/grid ile), böylece panel hiçbir ilçeyi/ili görsel olarak kapatmıyor ve tıklanabilirliğini engellemiyor. Bu kural kesin: bir overlay/drawer'ın harita üzerine bindiği herhangi bir uygulama hatalıdır. Tek harita görünümünde panel 320px, karşılaştırma görünümünde (2-4 harita, her birinin kendi paneli açılabildiği için yer daha kıymetli) 256px genişliğinde.
- **Yoğunluk:** Container-padding (24px) ve card-gap (16px) dışında gereksiz negatif alan yok.

## Elevation & Depth

Derinlik gölgeyle değil, hairline kenarlıkla ve parlaklık farkıyla kuruluyor (koyu temada siyah gölge zaten görünmüyor).

- **Seviye 1 (Zemin):** {colors.surface} (near-black), düz, dokusuz.
- **Seviye 2 (Kart/panel):** {colors.surface-card} (zeminden bir tık açık) + 1px {colors.hairline} kenarlık. Gölge kullanılmıyor — koyu zeminde gölge yerine parlaklık farkı derinlik veriyor.
- **Seviye 3 (Detay paneli):** Seviye 2 ile aynı yüzey, ayrışmak için biraz daha belirgin bir sol kenarlık ({colors.hairline-strong}).
- Cam efekti, glow, gradient yok.

## Shapes

- **Kartlar/paneller:** {rounded.md} (8px).
- **Butonlar/input/rozet:** {rounded.DEFAULT} (6px), rozetler {rounded.sm} (4px). Pill-shape yok.
- **Harita:** {rounded.none}. İl/ilçe şekillerinin kendisi de gerçek coğrafi sınırları takip ediyor — sadeleştirilmiş/yuvarlatılmış poligon yok.

## Components

### Stat tile
İl/ilçe detay panelinde iki kademe var, tek düz liste değil:
- **Hero:** Başarı Oranı, tam panel genişliğinde tek stat-tile, display-lg (40px). Bu panelin "bakılacak" tek asıl sayısı.
- **Compact:** Kargo / SLA İçi / SLA Dışı, `grid-cols-3` ile yan yana, küçük tipografi (headline-sm, 18px) ve dar yatay padding (`compact` prop'u, `px-1.5 py-2`). Etiketler kısaltılmıyor — sunum sırasında haritayı izleyen bir dinleyici için "SLA" öneki olmadan "İçi"/"Dışı" tek başına anlamsız kalıyor, tam terim ("SLA İçi", "SLA Dışı") korunuyor. Bunun yerine dar sütunda ("SLA Dışı" gibi daha uzun etiketin) 2 satıra kırılıp o satırı diğer ikisinden görünmez şekilde uzatmaması için compact kutuların yatay padding'i daraltıldı (8px → 6px, her tarafta 2px kazanç × 3 kutu).

Bu ikili kademe, dört büyük stat-tile'ı alt alta dizmenin (4× display-lg) paneli gereksiz uzatıp altındaki karşılaştırma özetini ekran dışına itmesi üzerine kuruldu — sadece tek bir sayı (başarı oranı) büyük vurguyu hak ediyor, geri kalan üçü destekleyici. 2 sütunlu düz bir ızgara da denenmişti; "%45.45" gibi kesirli yüzdeler (kırılamayan tek parça metin) o zaman kutudan taşıyordu — hero kutusu tam genişlik aldığı için bu risk kalmadı, compact kutular da kısa tam sayılar taşıdığı için dar sığıyor. Ek güvenlik: tüm `text-*` rol class'ları `overflow-wrap: anywhere` taşıyor — beklenmedik uzunlukta bir değer gelirse metin kutunun dışına taşmak yerine satır kırıyor.

### Badge (SLA dışı oranı)
badge-sla, o bölgenin SLA dışı oranı bucket'ına göre 5 renkten birini alıyor (sla-critical/high/moderate/clean/no-data — bkz. Colors tablosu), arka planı `-soft` varyantı. Rozet metni her zaman bir sayı içeriyor (ör. "%32 SLA Dışı"), sadece renk asla tek başına anlam taşımıyor.

### Button
Birincil aksiyon button-primary; ikincil aksiyonlar button-ghost. Sayfada aynı anda tek bir button-primary olmalı.

### Upload dropzone
Xlsx yükleme alanı sade bir kesikli-kenarlıklı (hairline-strong) dikdörtgen. Yükleme her zaman açık — yüklemeler kalıcı ve sınırsız (bkz. INTENT.md). 4 harita sınırı yükleme anında değil, geçmiş listesinden karşılaştırma için seçim yaparken uygulanıyor: 5. dosya seçilmeye çalışılırsa "en fazla 4 harita" uyarısı gösteriliyor, seçim engelleniyor. Dosya seçmeden önce opsiyonel bir "Harita adı" metin alanı var — boş bırakılırsa geçmiş listesinde ve harita başlığında dosya adı (`original_filename`) gösteriliyor, doldurulursa o isim (`display_name`) her yerde dosya adının yerini alıyor. Geçmiş listesindeki her satırda "Adlandır" aksiyonuyla isim sonradan da değiştirilebiliyor (yüklemeden sonra fikir değiştirmek için).

### Map legend
Referans rapordaki lejant kutusunun renk/etiket eşleşmesiyle aynı: 5 öğe (renk karesi + aralık metni: "%25+", "%24 - %10", "%9 - %0.01", "%0", "Gönderim Yok"). Konum referanstan farklı — **haritanın altında, kendi satırında, yatay bir şerit** olarak duruyor, haritanın üzerine bindirilmiyor. (İlk denemede haritanın sağ alt köşesine `absolute` bindirilmişti; Türkiye'nin şeklinde sağ alt köşe gerçek illere denk geldiği için lejant o illeri kapatıyor ve tıklanamaz kılıyordu — detay panelindeki aynı hatanın tekrarıydı, düzeltildi.) Her haritanın kendi lejantı var (4 harita yan yanaysa 4 lejant, her biri kendi haritasının altında).

### Navigasyon (Geri/İleri/Ana Sayfa)
Üç nav-button, app-header'ın sağında (üstteki navy şeritle aynı satır, `position: fixed` ile hizalanmış — sayfa akışında ayrı bir şerit değil): "◀ Geri", "İleri ▶", "Ana Sayfa". İlk ikisi haritadaki seçim geçmişinde (bir ile/ilçeye tıklama, Türkiye'ye dönme) ileri/geri gidiyor — tarayıcının kendi geçmişinden bağımsız, sayfaya özel bir yığın; gidilecek geçmiş/gelecek yoksa nav-button-disabled durumunda (tıklanamaz, muted-soft metin). "Ana Sayfa" bunlardan farklı: geçmişte gezinmiyor, doğrudan `/`'e (yükleme listesine) dönüyor — her zaman tıklanabilir, disabled durumu yok. Bu butonlar PowerPoint'e gömülü iframe'de tarayıcı çerçevesi görünmediği için gerekli — kullanıcının gezinti için tek yolu bunlar.

### İl/Bölge etiket toggle'ı
Türkiye genel görünümünde (bir ile girilmediğinde), haritanın üstünde iki buton: "İl bazlı" (varsayılan) ve "Bölge bazlı". Bu sadece bir **etiketleme** tercihi — dolgu rengi her zaman il bazlı SLA verisine göre hesaplanıyor, il sınırları hep çiziliyor, tıklama/drill-down davranışı değişmiyor. "Bölge bazlı" seçilince sadece 81 il adı yerine Türkiye'nin 7 coğrafi bölgesinin adı (Marmara, Ege, Akdeniz, İç Anadolu, Karadeniz, Doğu Anadolu, Güneydoğu Anadolu) gösteriliyor — üst düzey bir sunumda "hangi bölgedeyiz" hissi vermek için, verinin kendisini bozmadan. Bir ile tıklayıp ilçelere girildiğinde bu toggle kayboluyor (bölge kavramı ilçe seviyesinde anlamsız).

"Bölge bazlı"da ayrıca, farklı bölgelerdeki komşu iller arasındaki sınır çizgisi daha kalın çizilir ({colors.map-boundary}, 3.5px — normal il sınırı 1.5px, ilçe sınırı 1px'in üstünde, "bir üst kademe" hissi için). Bu, topojson'un paylaşılan ark (arc) yapısından `topojson-client`'ın `mesh()` fonksiyonuyla türetiliyor — poligonlar gerçekten birleştirilmiyor (bkz. Do's/Don'ts), sadece "iki tarafındaki il farklı bölgedeyse" filtresiyle o kesişim çizgileri ayrı ve kalın bir path olarak üstüne çiziliyor. Aynı bölgedeki komşu iller arasında hâlâ sadece normal (ince) il sınırı var.

### Karşılaştırma özeti
Tam olarak iki harita karşılaştırılırken (elle seçim veya ana sayfadaki "İlk ve son yüklemeyi karşılaştır" kısayolu), ızgaranın altında stat-tile'a benzer tek bir kart. Başlık, o an haritalarda seçili olan kapsamı gösteriyor: hiçbir şey seçili değilse "Türkiye (toplam)", bir il seçiliyse il adı, bir ilçe seçiliyse "İl / İlçe". İçerik her zaman somut sayı: başarı oranı eski→yeni ok işaretiyle, puan farkı ve yön ("arttı"/"azaldı"/"değişmedi"), kargo sayısı eski→yeni. Bir haritada veri yoksa (kargo 0), yüzde/puan hesaplanmıyor — "veri yok, karşılaştırma yapılamıyor" gösteriliyor, sessizce %0 gibi yanıltıcı bir sayı üretilmiyor. Bu kart üç veya dört haritalı karşılaştırmada gösterilmiyor (karşılaştırma çifte anlamlı, ikiden fazla haritada "eski/yeni" belirsizleşir).

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
- **Don't** detay panelini veya lejantı haritanın üzerine bindirme (absolute overlay) — ikisi de kendi alanında (sütun/satır) olmalı, hiçbir il/ilçeyi görsel olarak kapatıp tıklanmaz hale getirmemeli. Türkiye'nin şeklinde her köşede gerçek iller var — "sağ alt köşeye sabitle" gibi bir konum kararı neredeyse her zaman bir ili kapatır.
- **Don't** ilçe etiketlerinin harita/SVG sınırlarının dışına taşmasına izin verme — SVG konteyneri kırpma (overflow: hidden) uygulamalı, uzun isimler görünürlüğü bozmamalı.
- **Don't** herhangi bir metnin (özellikle stat-tile değerleri gibi kırılamayan sayı/yüzde metinleri) kendi kutusundan taşmasına izin verme — kutu içeriğe göre genişlemiyor veya metin görünürlüğü bozacak şekilde kutuyu aşıyorsa, kutuyu büyüt (tek sütuna düşür, vb.), küçük bir kutuya sıkıştırmaya çalışma.
- **Do** bir şehir/ilçe seçildiğinde ortaya çıkan her şeyi (harita, detay paneli, karşılaştırma özeti) tipik bir ekran yüksekliğinde (ör. 720px) kaydırma gerektirmeden göster. Bir bileşeni (ör. stat-tile'ları) taşmayı önlemek için büyütürken, bunun toplam sayfa yüksekliğini şişirip altındaki içeriği (karşılaştırma özeti gibi) ekran dışına itmediğini kontrol et — bir taşma sorununu çözerken başka bir kaydırma sorunu yaratmak kabul edilmez.
- **Don't** yan yana dizilmiş eşit genişlikli kutularda (ör. compact stat-tile satırı) bir etiketin diğerlerinden farklı satır sayısına kırılmasına izin verme — tek bir kutunun 2 satıra kırılması o satırı diğerlerinden görünmez şekilde uzatıp hizasız bir satır yaratır. Terim/kavram (ör. "SLA İçi"/"SLA Dışı") sunum izleyicisi için anlam taşıyorsa kısaltma; önce kutunun iç padding'ini daraltarak yer aç, gerekirse kutuyu büyüt — anlamı netlik pahasına kısaltma.
- **Don't** "Bölge bazlı" görünüm için il poligonlarını gerçekten birleştirme (7 büyük bölge şekli üretme) — kullanıcı bunu özellikle istemedi ("illerin renklerini bozmadan... il sınırları kalsın"). İl bazında renklendirme/sınır/tıklama davranışı hep aynı kalmalı; bölge ayrımı sadece etiket ve kalın sınır çizgisiyle (mesh) gösteriliyor.
