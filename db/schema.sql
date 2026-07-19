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
