export type SlaBucket = "critical" | "high" | "moderate" | "clean" | "no-data";

export interface UnmatchedRowDetail {
  row: number;
  il: string;
  ilce: string;
  reason: string;
}

export interface UploadRecord {
  id: string;
  original_filename: string;
  uploaded_at: string;
  total_rows: number;
  matched_rows: number;
  unmatched_rows: number;
  unmatched_details: UnmatchedRowDetail[] | null;
}

export interface RegionStat {
  upload_id: string;
  il: string;
  ilce: string;
  kargo_sayisi: number;
  sla_ici: number;
  sla_disi: number;
}
