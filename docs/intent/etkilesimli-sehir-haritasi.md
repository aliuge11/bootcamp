# INTENT.md — PowerPoint için Etkileşimli Şehir Haritası

> Durum: **Onaylandı (el sıkışıldı)** · Son güncelleme: 2026-07-19

## Bağlam
PowerPoint içinde etkileşimli harita hazırlamak zor ve uzun sürüyor. Bunun yerine bir web uygulaması Türkiye il haritasını etkileşimli olarak oluşturacak, bu harita PowerPoint sunumlarına gömülecek. Haritadaki bir şehre (ve o şehrin ilçelerine) tıklandığında ilgili bölgeye ait ölçülmüş veriler (gönderilen kargo sayısı, SLA içi/dışı kargo sayısı, başarı oranı) detaylı şekilde gösterilecek ve başka bir yüklemedeki aynı bölgeyle karşılaştırılacak.

Kaynak veri, satır bazlı (her satır tekil bir kargo/gönderi kaydı, Mali no ile ayırt ediliyor) bir .xlsx dosyasında tutuluyor; kolonlar: A) Mali no, B) İl, C) İlçe, D) SLA durum ("SLA içi" / "SLA dışı"). Haritada gösterilecek metrikler bu ham satırlardan il/ilçe bazında hesaplanacak:
- **Kargo sayısı** = o il/ilçeye ait satır sayısı.
- **Başarı oranı** = (SLA içi satır sayısı / toplam satır sayısı) × 100. Örnek: 10 kargodan 8'i SLA içi ise başarı oranı %80.

## Hedef
Kullanıcının yüklediği .xlsx dosyalarından, il bazlı verileri gösteren etkileşimli bir Türkiye haritası üreten bir web uygulaması geliştirmek. Her yüklenen .xlsx bir haritayı temsil ediyor; birden fazla dosya yüklendiğinde ekran o kadar haritaya bölünüyor ve haritalardan birinde bir şehre tıklandığında aynı şehir diğer haritalarda da otomatik açılarak karşılaştırma yapılabiliyor. Üretilen harita, PowerPoint sunumu içinde slayttan çıkmadan tıklanabilir şekilde gösterilebiliyor.

## Kullanıcı
İç ekip. Dış (üçüncü taraf) kullanıcı yok.

## Başarı kriteri
- Türkiye haritasındaki her şehir tıklanabilir; tıklandığında o şehrin verileri (kargo sayısı, SLA içi/dışı oran, başarı oranı ve xlsx'teki diğer alanlar) doğru şekilde gösteriliyor.
- Birden fazla .xlsx dosyası yüklendiğinde ekran yüklenen dosya sayısı kadar haritaya bölünüyor (en fazla 4); haritalardan birinde bir şehre tıklandığında aynı şehir diğer haritalarda da otomatik seçili/açık gösteriliyor, böylece iki dönem/veri seti yan yana karşılaştırılabiliyor.
- .xlsx dosyası yüklendiğinde veriler harita üzerine hatasız işleniyor; il adı eşleştirme hataları (yazım farkı, Ç/Ş/İ gibi Türkçe karakter sorunları) veri kaybına yol açmıyor.
- Üretilen harita, PowerPoint sunumu içinde Web Viewer eklentisi üzerinden slayttan çıkmadan tıklanabilir şekilde gösterilebiliyor (bkz. Teknik yaklaşım).
- Harita 81 ilin tamamını gösteriyor; xlsx'te verisi olmayan iller hatalı/boş görünüm yerine anlaşılır bir "veri yok" durumunda gösteriliyor.
- Haritanın varsayılan (genel) görünümünde sadece iller görünüyor, ilçeler gizli. Bir ile tıklandığında o ilin ilçeleri ve ilçe bazlı verileri açılıyor; ilçe verileri xlsx'teki İlçe kolonundan türetiliyor.
- 4'ten fazla xlsx yüklenmeye çalışıldığında sistem, aynı anda en fazla 4 harita karşılaştırılabileceğini belirten bir hata gösteriyor ve 5. dosyayı işlemiyor.
- Kullanıcı, geçmişte yüklediği bir xlsx'ten oluşturulmuş haritaya sonradan tekrar erişebiliyor (yüklemeler kalıcı olarak saklanıyor, tek seferlik/geçici değil).
- Bir haritanın URL'si oluşturulduktan sonra sabit kalıyor; bir PowerPoint dosyasına bir kez gömülen harita, sunum daha sonra tekrar açıldığında hâlâ çalışıyor.

## Kapsam dışı
- Birden fazla xlsx tek haritada birleştirilmiyor: her dosya kendi haritasını oluşturuyor, ekran haritalara bölünüyor (bkz. Hedef).
- Aynı anda yan yana gösterilebilecek harita sayısı en fazla 4 ile sınırlı; 4'ten fazla dosya yüklenmeye çalışılırsa sistem hata veriyor (bkz. Başarı kriteri).
- Kullanıcı hesap/yetkilendirme sistemi yok; erişim kısıtlaması gerekmiyor.
- Video/GIF export gibi statik çıktı üretimi kapsam dışı; hedef PowerPoint içinde canlı/etkileşimli gösterim.

## Riskler
- **En kritik risk:** Web Viewer eklentisinin çalışması için web sitesinin iframe içine gömülmeye izin vermesi gerekiyor (`X-Frame-Options` / CSP `frame-ancestors` ayarı). Site varsayılan olarak bunu engellerse harita PowerPoint içinde hiç görünmez. Ayrıca eklenti internet bağlantısı gerektiriyor (offline sunumda çalışmaz) ve kurumsal IT politikası eklenti kurulumunu engelliyorsa kullanılamaz — sunumun yapılacağı ortamda bu kısıtlar önceden doğrulanmalı.
- İki dosya arasında senkron şehir seçimi, il adlarının her iki dosyada birebir eşleşmesine dayanıyor. Yazım farkı (Afyonkarahisar/Afyon), Türkçe karakter sorunu (İ/I, Ş/Ç) veya bir dosyada eksik şehir varsa, o şehre tıklandığında diğer haritada seçim sessizce çalışmayabilir.
- Harita sayısı arttıkça (3-4 dosya) ekran genişliği paylaşıldığı için okunabilirlik ve performans zorlaşabilir.
- Yüklemeler kalıcı saklanacağı için veri hacmi zamanla büyüyecek; saklama süresine bir üst sınır konmazsa depolama maliyeti ve geçmiş liste karmaşıklaşabilir.
- Geçmiş haritalara erişim bir liste/arşiv ekranı gerektiriyor; yüklemeler tarih/etiket olmadan sadece dosya adıyla ayırt edilirse kullanıcı aylar sonra hangi haritanın hangi döneme ait olduğunu bulmakta zorlanabilir.

## Teknik yaklaşım (ön karar)
Web uygulaması, kullanıcının yüklediği her .xlsx dosyasını (Mali no, İl, İlçe, SLA durum kolonları) bir içe aktarma (import) aracıyla okuyacak, satırları İl ve İlçe bazında gruplayıp her bölge için kargo sayısı ve SLA içi/dışı oranını hesaplayacak (aggregate); bu hesaplanmış veri kümesi, tıklanabilir bir Türkiye il haritası (örn. SVG/GeoJSON tabanlı) olarak render edilecek. Varsayılan görünümde sadece il seviyesi gösterilecek; bir ile tıklanınca o ilin ilçeleri ve ilçe bazlı verileri açılacak (drill-down), ilçeler genel harita görünümünde görünmeyecek. Birden fazla dosya yüklendiğinde en fazla 4 harita ekranda yan yana gösterilecek ve şehir seçimi haritalar arasında senkronize olacak.

Xlsx yükleme periyodik: her yükleme kalıcı olarak saklanacak (veritabanı + dosya depolama), kullanıcı geçmiş yüklemelerin bir listesine dönüp eski bir haritayı tekrar açabilecek. Her haritanın kendine ait sabit bir URL'si olacak ve bu URL, oluşturulduktan sonra değişmeyecek/silinmeyecek — çünkü bu URL doğrudan bir PowerPoint dosyasına gömülüyor, dosya URL'yi değiştirirse sunum bozulur.

Kullanıcı geçmiş listesinden bir yüklemeyi "silebiliyor" ama bu gerçek bir silme değil — sadece geçmiş listesinden ve karşılaştırma seçiminden gizleniyor (soft-delete). Veri ve harita URL'si kalıcı kalıyor, daha önce paylaşılmış/PowerPoint'e gömülmüş bir link her zaman çalışmaya devam ediyor. Bu, yukarıdaki "URL asla silinmez" kısıtıyla çelişmemek için bilinçli bir tasarım.

PowerPoint'e gömme yöntemi olarak Web Viewer eklentisi (Microsoft AppSource, PowerPoint Desktop/Online/Mac) kullanılacak: eklenti, haritanın barındırıldığı URL'yi slayt içine canlı bir nesne olarak yerleştiriyor ve Slide Show modunda tıklama gibi etkileşimleri gerçek zamanlı destekliyor, ek geliştirme gerektirmiyor. Bunun çalışabilmesi için web uygulamasının iframe içine gömülmeye izin verecek şekilde yapılandırılması (`X-Frame-Options` / CSP `frame-ancestors`) gerekiyor — bu, geliştirme sırasında baştan karar verilmesi gereken bir mimari gereksinim.
