# CLAUDE.md

## Davranış ilkeleri

Bu ilkeler hız yerine dikkati önceliklendirir. Basit/önemsiz işlerde katı uygulama yerine takdir kullan.

### 1. Kodlamadan önce düşün
Varsayma. Kafa karışıklığını gizleme. Trade-off'ları açıkça söyle.
- Varsayımlarını açıkça belirt. Emin değilsen sor.
- Birden fazla yorum mümkünse hepsini sun — sessizce birini seçme.
- Daha basit bir yaklaşım varsa bunu söyle. Gerekçeliyse itiraz et.
- Bir şey belirsizse dur. Neyin belirsiz olduğunu adlandır. Sor.

### 2. Önce basitlik
Sorunu çözen minimum kod. Spekülatif hiçbir şey ekleme.
- İstenenin ötesinde özellik yok.
- Tek kullanımlık kod için soyutlama yok.
- İstenmemiş "esneklik"/"yapılandırılabilirlik" yok.
- Gerçekleşmeyecek senaryolar için hata yönetimi yok.
- 200 satır yazdıysan ve 50 satıra sığabiliyorsa, yeniden yaz.

Kendine sor: "Kıdemli bir mühendis buna 'gereksiz karmaşık' der mi?" Cevap evetse basitleştir.

### 3. Cerrahi değişiklikler
Sadece dokunman gerekeni dokun. Sadece kendi pisliğini temizle.
- Mevcut kodu, yorumları veya biçimlendirmeyi "iyileştirme".
- Bozuk olmayan şeyi refactor etme.
- Kendi tarzın farklı olsa bile mevcut stile uy.
- İlgisiz ölü kod fark edersen belirt — silme.
- Kendi değişikliğinin kullanılmaz bıraktığı import/değişken/fonksiyonu temizle; önceden var olan ölü kodu istenmedikçe silme.

Test: değişen her satır, kullanıcının isteğine doğrudan izlenebilmeli.

### 4. Hedef odaklı yürütme
Başarı kriterini tanımla. Doğrulanana kadar döngüde kal.
- "Doğrulama ekle" → "Geçersiz girdiler için test yaz, sonra geçir."
- "Bug'ı düzelt" → "Bug'ı üreten bir test yaz, sonra geçir."
- "X'i refactor et" → "Testlerin öncesinde ve sonrasında geçtiğinden emin ol."

Çok adımlı işlerde kısa bir plan belirt:
```
1. [Adım] → doğrulama: [kontrol]
2. [Adım] → doğrulama: [kontrol]
```

---

## Proje: PowerPoint için Etkileşimli Şehir Haritası

Bu repo, PowerPoint sunumlarına gömülebilen etkileşimli bir Türkiye il/ilçe haritası uygulamasını içerecek. Ürün kararları ve gerekçeleri için önce [docs/intent/etkilesimli-sehir-haritasi.md](docs/intent/etkilesimli-sehir-haritasi.md) dosyasına bak — bu dosya onaylı, buradaki teknik kararlar o dosyadaki hedef ve kısıtlara göre alındı. Görsel tasarım (renkler, tipografi, harita renklendirme kuralları, bileşenler) için [DESIGN.md](DESIGN.md) normatif kaynak — UI ile ilgili herhangi bir şey yazmadan/değiştirmeden önce oraya bak. Arayüzde veya dokümantasyonda yazılan her metin (buton, hata mesajı, boş durum, vb.) için [STYLE.md](STYLE.md)'deki yazım kurallarına uy. Oturumlar arasında hatırlanması gereken kararlar/gerçekler için [MEMORY.md](MEMORY.md)'yi güncel tut — her önemli kararın ardından oraya kısa bir özet ekle. Projeyi sıfırdan kodlarken [PLAN.md](PLAN.md)'deki 10 adımı sırayla, soru sormadan uygula — her teknik karar (DB şeması, GeoJSON kaynağı, routing) orada sabit.

### Teknoloji yığını
- **Next.js** (TypeScript, App Router) — web uygulaması ve API route'ları aynı projede.
- **PostgreSQL** (native kurulum, Docker değil) — kalıcı xlsx yüklemeleri, hesaplanmış il/ilçe metrikleri ve harita geçmişi için.
- **SheetJS (`xlsx` paketi)** — .xlsx dosyalarını okumak için.
- **d3-geo + topojson-client** — Türkiye il ve ilçe sınırlarını GeoJSON/topojson üzerinden ham SVG olarak render etmek için (`react-simple-maps` React 19 ile peer-dependency çakıştığı için kullanılmıyor).
- **Tailwind CSS v4** (CSS-first `@theme`) — stil katmanı, tema DESIGN.md token'larından.

### INTENT.md'den gelen mimari kısıtlar
- Site, iframe içine gömülmeye izin verecek şekilde yapılandırılmalı (`X-Frame-Options` / CSP `frame-ancestors`) — PowerPoint Web Viewer eklentisi bu olmadan çalışmıyor.
- Her .xlsx yüklemesi kalıcı saklanıyor; oluşturulan harita URL'leri bir daha değişmiyor/silinmiyor (PowerPoint'e gömülü kalıyorlar).
- Kargo sayısı ve başarı oranı, xlsx'teki ham satırlardan (Mali no, İl, İlçe, SLA durum) il/ilçe bazında hesaplanıyor: kargo sayısı = satır sayısı, başarı oranı = (SLA içi satır sayısı / toplam satır sayısı) × 100.
- Harita varsayılan görünümde sadece il seviyesini gösteriyor; bir ile tıklanınca o ilin ilçeleri ve verileri açılıyor (drill-down).
- Aynı anda en fazla 4 harita yan yana gösterilebiliyor; bir haritada şehir seçimi diğerleriyle senkronize. 5. dosya yüklenmeye çalışılırsa hata veriliyor.
- Kullanıcı hesap/yetkilendirme sistemi yok, iç ekip kullanımı için tasarlanıyor.
- Harita dolgu rengi, SLA dışı oranına göre 5 kategorili (gradient değil, kesin eşikli) bir skala kullanıyor — ≥%25 kırmızı, %10-%24 turuncu, %0.01-%9 mavi, %0 yeşil, veri yok gri. Tam renk kodları ve mantık için [DESIGN.md](DESIGN.md#map--veri-görselleştirme).
- İl/ilçe adları haritanın üzerine doğrudan yazılıyor (referanstaki gibi dışarıya ok/çizgiyle değil). İl sınırları genel görünümde, ilçe sınırları sadece bir ile girildiğinde çizgiyle gösteriliyor.

### Proje durumu
Proje henüz scaffold edilmedi. İlk kurulum yapıldığında bu dosyaya klasör yapısı, çalıştırma/test komutları ve kod konvansiyonları eklenecek.
