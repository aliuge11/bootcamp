# STYLE.md

Bu dosya, bu projede yazılan her metnin (arayüz metni, hata mesajları, buton etiketleri, boş durum mesajları, dokümantasyon) nasıl yazılacağını tanımlar. Referans: [stop-slop](https://github.com/hardikpandya/stop-slop) — AI yazı izlerini temizleyen bir kural seti; burada Türkçeye ve iç kurumsal araç tonuna uyarlandı.

## Ton

Sade, kurumsal, doğrudan. Bu bir iç operasyon aracı — ikna etmiyor, satmıyor, heyecanlandırmıyor. Bilgiyi en kısa yoldan veriyor. Kullanıcı zaten neden burada olduğunu biliyor.

## Kurallar

1. **Dolgu cümleleri kes.** Giriş temizleme yok. Doğrudan içerikle başla.
2. **Aktif çatı kullan.** Her cümlenin bir öznesi olsun. "Karar alındı" değil, "ekip karara vardı".
3. **Somut ol.** "Önemli ölçüde arttı" değil, "%12 arttı". Belirsiz genellemeler ("her zaman", "asla", "herkes") somut sayı/istisna olmadan kullanılmaz.
4. **Kullanıcıya güven.** Gereksiz yumuşatma, özür, gerekçelendirme yok. Olguyu doğrudan söyle.
5. **Em dash kullanma.** Virgül veya nokta kullan.
6. **Zarfları kes.** "Kesinlikle", "gerçekten", "aslında", "adeta", "bir nevi", "tabii ki" — sil, cümle zarf olmadan da anlamlıysa zarfa gerek yok.

## Yasaklı ifadeler

**Giriş temizleme (throat-clearing)** — doğrudan söyle:
- "Şunu belirtmek isterim ki..."
- "Burada önemli olan şu ki..."
- "İşte tam da bu noktada..."
- "Aslında mesele şu ki..."

**İş jargonu** — sade karşılığını kullan:

| Kullanma | Kullan |
|---|---|
| Bu bağlamda | Burada / bu durumda |
| Yol haritası | Plan |
| Değer katmak | (somut ne kattığını söyle) |
| Uçtan uca | Baştan sona |
| Aksiyon almak | Yapmak, harekete geçmek |
| Süreci optimize etmek | (somut ne değiştiğini söyle) |

**Meta-yorum** — kes, direkt içeriğe geç:
- "Bu bölümde şunu göreceğiz..."
- "Şimdi X'e bakalım..."
- "Aşağıda göreceğiniz gibi..."

**Belirsiz genellemeler** — somut olanla değiştir:
- "Sistem hata verdi" → "B sütununda 4 satır boş"
- "Performans düştü" → "başarı oranı %92'den %78'e düştü"

## Yapısal kaçınmalar

- **İkili karşıtlık** ("X değil, Y'dir" kalıbı): direkt Y'yi söyle. "Sorun dosya boyutu değil, harita sayısı" yerine "en fazla 4 harita gösterilebilir".
- **Olumsuzlama listesi** ("Ne X ne Y, sadece Z"): direkt Z'yi söyle.
- **Dramatik parçalama** ("Kısacası. Bu kadar."): tam cümle kur.
- **Edilgen çatı**: özneyi belirt. "Dosya işlenemedi" yerine "içe aktarma aracı dosyayı işleyemedi, çünkü [somut sebep]".
- **Cansız özneye insan eylemi yükleme**: "veri gösteriyor ki" değil, "raporu inceleyince X'i gördük" / "İstanbul'un başarı oranı %92".

## Kurumsal/iç araç tonuna özel kurallar

- **Hata mesajları** sorunu ve çözümü söyler, özür dilemez. "Üzgünüz, bir şeyler ters gitti" yok.
- **Ünlem işareti yok.** "Harika!", "Tebrikler!" gibi pazarlama coşkusu bu araçta yer almaz.
- **Sayılar her zaman somut.** "Yükleme başarılı" değil, "248 satır işlendi, 3 satır atlandı".
- **Buton/etiket metinleri emir kipinde ve kısa.** "Yükle", "Karşılaştır", "İptal" — "Lütfen dosyanızı seçiniz" gibi resmi/dolgulu ifade yok.

## Önce / Sonra

**Hata mesajı**
- Önce: "Üzgünüz, bir şeyler ters gitti. Lütfen tekrar deneyin ya da sistem yöneticinizle iletişime geçin."
- Sonra: "B sütununda (İl) 4 satır boş. Doldurup tekrar yükle."

**Boş durum**
- Önce: "Bu bölgede henüz herhangi bir veri bulunmamaktadır. Veri eklendiğinde burada görüntülenecektir."
- Sonra: "Bu ilçede kargo verisi yok."

**Başarı mesajı**
- Önce: "Harika! Dosyanız başarıyla yüklendi ve haritanız hazır."
- Sonra: "248 satır işlendi. Harita hazır."

**Sınır uyarısı**
- Önce: "Burada dikkat edilmesi gereken önemli bir nokta var: aslında sorun dosya boyutu değil, aynı anda kaç haritanın gösterilebileceği."
- Sonra: "En fazla 4 harita aynı anda gösterilebilir. 5. dosyayı yüklemeden önce birini kapat."
