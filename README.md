# Etkileşimli Şehir Haritası

PowerPoint sunumlarına gömülebilen, il/ilçe bazlı SLA performansını gösteren etkileşimli bir Türkiye haritası. Kullanıcı bir .xlsx dosyası yükler (Mali no / İl / İlçe / SLA durum), sistem kargo sayısı ve SLA dışı oranını hesaplayıp haritayı 5 kategorili bir renk skalasıyla boyar. En fazla 4 harita yan yana açılıp senkron olarak karşılaştırılabilir.

## Yerel geliştirme

Gereksinimler: Node.js, PostgreSQL (yerel, çalışır durumda).

```bash
npm install
npm run db:setup   # db/schema.sql'i DATABASE_URL'e uygular
npm run dev        # http://localhost:3000
npm test           # Vitest — xlsx aggregate, SLA renk bucket'ı, bölge eşleştirme
npm run build       # üretim derlemesi
```

`.env.example`'ı `.env`'e kopyalayıp `DATABASE_URL`'i kendi Postgres bağlantına göre ayarla. Bu ortamda PostgreSQL'in resmi installer'ı erişilemez olduğu için native kurulum farklı bir kaynaktan yapıldı — bkz. [MEMORY.md](MEMORY.md) > Bilinen Gerçekler.

## Dosyalar

- [docs/intent/etkilesimli-sehir-haritasi.md](docs/intent/etkilesimli-sehir-haritasi.md) — onaylı ürün kararları ve gerekçeleri.
- [CLAUDE.md](CLAUDE.md) — davranış ilkeleri + proje mimari kısıtları.
- [DESIGN.md](DESIGN.md) — renk/tipografi/bileşen tasarım sistemi.
- [STYLE.md](STYLE.md) — arayüz ve dokümantasyon yazım kuralları.
- [MEMORY.md](MEMORY.md) — oturumlar arası kararlar ve teknik gerçekler.
- [PLAN.md](PLAN.md) — sıfırdan MVP'ye 10 adımlık yapım planı (bu kod ondan üretildi).
