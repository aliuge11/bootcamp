# MEMORY.md

Bu dosya [agentmemory](https://github.com/rohitg00/agentmemory)'nin yaklaşımından ilham alıyor, kendisini değil. agentmemory'nin sunucusu, hook'ları, veritabanı, vektör/BM25/graph arama motoru burada yok — kurulmuyor. Alınan şey, onun hafızayı katmanlara ayırma disiplini: ham gözlem → oturum özeti → kalıcı gerçek → tekrar eden iş akışı. Burada bu katmanlar otomatik bir motorla değil, Claude Code'un (ve sizin) bu dosyayı oturum sonlarında elle güncellemesiyle işliyor.

## Nasıl çalışıyor

| Katman | agentmemory'de | Burada |
|---|---|---|
| Working | Ham tool-call gözlemi, hook'larla otomatik | O anki konuşmanın kendisi — buraya yazılmıyor, kalıcı değil |
| Episodic | LLM ile sıkıştırılmış oturum özeti | Aşağıdaki "Oturum Özetleri" — önemli bir karar/değişiklik olduğunda elle eklenen kısa, tarihli satır |
| Semantic | Çıkarılmış gerçekler + kavramlar | Aşağıdaki "Bilinen Gerçekler" — INTENT/CLAUDE/DESIGN/STYLE'ta zaten yazılı olmayan, ama unutulursa yeniden keşfedilmesi gerekecek küçük gerçekler |
| Procedural | Öğrenilmiş iş akışı kalıpları | Aşağıdaki "Bu Projede Nasıl Çalışıyoruz" — bu projede tekrar eden, CLAUDE.md'nin genel ilkelerinden daha spesifik alışkanlıklar |

Kaynak izlenebilirliği (provenance) agentmemory'de otomatik; burada elle — her Semantic/Procedural madde, geldiği karara veya belgeye referans veriyor.

## Oturum Özetleri

- **2026-07-19 — INTENT.md:** [docs/intent/etkilesimli-sehir-haritasi.md](docs/intent/etkilesimli-sehir-haritasi.md) onaylandı. PowerPoint gömme yöntemi Web Viewer eklentisi olarak netleşti, en fazla 4 harita + senkron şehir seçimi, xlsx yükleme periyodik ve kalıcı, xlsx şeması (Mali no / İl / İlçe / SLA durum) ve kargo sayısı/başarı oranı formülleri belirlendi.
- **2026-07-19 — CLAUDE.md:** Karpathy'den türetilmiş davranış ilkeleri (düşün, sadeleştir, cerrahi değişiklik, hedef odaklı yürüt) proje-özel mimari kısıtlarla tek dosyada birleştirildi.
- **2026-07-19 — DESIGN.md:** BMW'nin kurumsal sitesinden (designmd.co) renk ilhamı, [google-labs-code/design.md](https://github.com/google-labs-code/design.md) formatında yazıldı. Sonra harita renklendirmesi ödeal'in "SLA Dışı Kuralanlar" referans görseline göre 5 kategorili, kesin eşikli bir skalaya (kırmızı/turuncu/mavi/yeşil/gri) revize edildi; il sınırları genel görünümde, ilçe sınırları sadece drill-down'da çizgili olacak şekilde netleşti; dış ok/bağlantı-çizgili etiketleme yerine il/ilçe adları doğrudan haritanın üzerine yazılacak.
- **2026-07-19 — STYLE.md:** [stop-slop](https://github.com/hardikpandya/stop-slop) kuralları Türkçeye ve "sade, kurumsal" iç araç tonuna uyarlandı.
- **2026-07-19 — PLAN.md:** [agentmemory](https://github.com/rohitg00/agentmemory)'nin katmanlı hafıza yaklaşımı MEMORY.md'ye (kurmadan, sadece disiplin olarak) uyarlandıktan sonra, sıfırdan koda geçiş için 10 adımlık uçtan uca bir yapım planı yazıldı. Bu adımda kritik bir teknik karar da netleşti: Türkiye il/ilçe GeoJSON verisi için [coskunomer/Turkish-Cities-Geojson-Dataset](https://github.com/coskunomer/Turkish-Cities-Geojson-Dataset) (MIT) seçildi ve doğrulandı; DB erişimi için ORM yerine ham `pg`, stil için Tailwind (DESIGN.md token'larından) kararlaştırıldı. PLAN.md, kullanıcının "hiçbir şey sorma" talimatına uyacak şekilde her teknik boşluğu (routing şeması, xlsx okuma kuralı, senkron seçim + drill-down davranışı) baştan sabitliyor.

## Bilinen Gerçekler

- DESIGN.md'deki `sla-critical`/`sla-high`/`sla-moderate`/`sla-clean`/`sla-no-data` hex kodları göz kararı tahmin — kaynak görselden pixel-perfect alınmadı. Kullanıcı gerçek hex kodlarını (ödeal'in tema dosyası vb.) paylaşınca güncellenecek. *(bkz. DESIGN.md Colors)*
- `coskunomer/Turkish-Cities-Geojson-Dataset`'teki ilçe seviyesi dosyalar (`cities/{il}.geojson`) kendi yerel/bağımsız bir koordinat uzayında, ülke haritasıyla (`turkey.topojson`, gerçek WGS84) aynı projeksiyonla birleştirilemez — ilçe haritaları `d3.geoIdentity().fitSize()` ile ayrı render edilmeli. *(bkz. PLAN.md Adım 3)*
- İlçe dosyalarındaki `properties.name` küçük harf geliyor (ör. "bahçelievler"), il dosyasındaki (`turkey.topojson`) düzgün büyük harfle (ör. "Kayseri") — xlsx eşleştirmesinde normalize edilmiş (küçük harf, trim) karşılaştırma şart. *(bkz. PLAN.md Adım 3-4)*
- Bu repo git deposu değil (`Is a git repository: false`) — commit/PR akışı henüz yok, sadece dosya sistemi.
- Proje henüz scaffold edilmedi; INTENT/CLAUDE/DESIGN/STYLE/MEMORY tamamlanan planlama dokümanları, kod yok.

## Bu Projede Nasıl Çalışıyoruz

- Bir mimari/ürün kararı netleştiğinde önce ilgili kaynak dosyaya işleniyor (ürün kararı → INTENT.md, görsel/renk/bileşen → DESIGN.md, metin/kopya → STYLE.md), sonra CLAUDE.md'nin "mimari kısıtlar" özetine kısaca yansıtılıyor — CLAUDE.md tek başına yeterli olmuyor, detay her zaman kaynağında.
- "Asla", "her zaman", "kesinlikle" gibi kesin ifadeler geçen bir talimat birden fazla yoruma açıksa, varsaymadan önce soruluyor (bkz. harita sınır çizgileri netleştirmesi, DESIGN.md).
- Bir dış kaynağa ("şuna benzer yap", "şu repoyu baz al") referans verildiğinde, önce o kaynağın gerçek içeriği (repo/sayfa) okunuyor, ondan sonra projeye uyarlanıyor — hafızadan/tahminden yazılmıyor.

## Bakım

Otomatik çürüme/unutma motoru yok. Bu dosya periyodik olarak elle gözden geçiriliyor:
- Geçerliliğini yitiren "Bilinen Gerçekler" maddesi silinir veya güncellenir (ör. BMW hex kodları gerçek değerlerle değiştirildiğinde o madde kaldırılır).
- "Oturum Özetleri" çok uzadığında, eski girdiler tek bir "Bilinen Gerçekler" maddesine sıkıştırılıp ham liste kısaltılır — agentmemory'nin "working → semantic" sıkıştırmasının elle karşılığı.
