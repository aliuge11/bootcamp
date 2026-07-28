CREATE TABLE IF NOT EXISTS uploads (
  id text PRIMARY KEY,
  original_filename text NOT NULL,
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  total_rows integer NOT NULL,
  matched_rows integer NOT NULL,
  unmatched_rows integer NOT NULL,
  unmatched_details jsonb
);

-- Kullanıcı bir yüklemeyi "sildiğinde" satır kalıcı olarak silinmiyor, sadece
-- geçmiş listesinden gizleniyor (hidden = true). /map/[id] linki her zaman
-- çalışmaya devam ediyor — PowerPoint'e gömülü haritalar bozulmasın diye
-- (bkz. INTENT.md "kalıcı URL"). ADD COLUMN IF NOT EXISTS ile var olan
-- kurulumlarda da tekrar çalıştırılabilir (ayrı bir migration aracı yok).
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS hidden boolean NOT NULL DEFAULT false;

-- Kullanıcının yüklemeye verdiği kendi ismi (ör. "Ocak Sunumu"); boşsa
-- original_filename gösterime düşüyor. Yükleme sırasında veya sonradan
-- (geçmiş listesinden "Yeniden adlandır") set edilebiliyor.
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS display_name text;

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
