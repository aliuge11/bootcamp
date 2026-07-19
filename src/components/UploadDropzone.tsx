"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { UnmatchedRowDetail } from "@/types";

interface UploadResult {
  id: string;
  totalRows: number;
  matchedRows: number;
  unmatchedRows: number;
  unmatchedDetails: UnmatchedRowDetail[];
}

export default function UploadDropzone({ onUploaded }: { onUploaded?: () => void }) {
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setStatus("uploading");
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/uploads", { method: "POST", body: formData });
    if (!response.ok) {
      setStatus("error");
      setError("Dosya işlenemedi. Xlsx formatını kontrol et.");
      return;
    }
    const data = (await response.json()) as UploadResult;
    setResult(data);
    setStatus("done");
    onUploaded?.();
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) upload(file);
  }

  return (
    <div
      className="rounded-md border border-dashed border-hairline-strong bg-surface p-panel-padding text-center"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
      }}
    >
      {status === "idle" && (
        <>
          <p className="text-body-md text-muted">xlsx dosyasını sürükle veya seç</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-3 h-10 rounded bg-primary px-4 text-body-md text-white"
          >
            Yükle
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </>
      )}

      {status === "uploading" && <p className="text-body-md text-muted">İşleniyor…</p>}

      {status === "error" && (
        <>
          <p className="text-body-md text-sla-critical">{error}</p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-2 text-body-sm text-primary"
          >
            Tekrar dene
          </button>
        </>
      )}

      {status === "done" && result && (
        <div className="text-left">
          <p className="text-body-md text-ink">
            {result.matchedRows} satır işlendi. Harita hazır.
          </p>
          {result.unmatchedRows > 0 && (
            <div className="mt-2 text-body-sm text-sla-critical">
              <p>
                {result.unmatchedRows} satır eşleşmedi:
              </p>
              <ul className="ml-4 list-disc">
                {result.unmatchedDetails.map((d) => (
                  <li key={d.row}>
                    Satır {d.row}: {d.il || "(boş)"} / {d.ilce || "(boş)"} — {d.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-3 flex gap-3">
            <Link href={`/map/${result.id}`} className="text-body-sm text-primary">
              Haritayı gör
            </Link>
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setResult(null);
              }}
              className="text-body-sm text-muted"
            >
              Yeni yükleme
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
