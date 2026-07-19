"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { UploadRecord } from "@/types";

const MAX_COMPARE = 4;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function UploadHistoryList({
  uploads,
  onDeleted,
}: {
  uploads: UploadRecord[];
  onDeleted?: () => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [limitWarning, setLimitWarning] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) {
        setLimitWarning(false);
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= MAX_COMPARE) {
        setLimitWarning(true);
        return prev;
      }
      setLimitWarning(false);
      return [...prev, id];
    });
  }

  function handleCompare() {
    if (selected.length === 0) return;
    router.push(`/map/compare?ids=${selected.join(",")}`);
  }

  async function handleDelete(id: string, filename: string) {
    if (!confirm(`"${filename}" geçmiş listesinden kaldırılsın mı?`)) return;
    setDeletingId(id);
    await fetch(`/api/uploads/${id}`, { method: "DELETE" });
    setSelected((prev) => prev.filter((x) => x !== id));
    setDeletingId(null);
    onDeleted?.();
  }

  if (uploads.length === 0) {
    return <p className="text-body-md text-muted">Henüz yükleme yok.</p>;
  }

  return (
    <div>
      {limitWarning && (
        <p className="text-body-sm mb-2 text-sla-critical">
          En fazla 4 harita aynı anda gösterilebilir. 5. dosyayı yüklemeden önce birini kapat.
        </p>
      )}
      <ul className="divide-y divide-hairline">
        {uploads.map((upload) => (
          <li key={upload.id} className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              checked={selected.includes(upload.id)}
              onChange={() => toggle(upload.id)}
              aria-label={`${upload.original_filename} karşılaştırmaya ekle`}
            />
            <Link href={`/map/${upload.id}`} className="text-body-md flex-1 text-ink">
              {upload.original_filename}
            </Link>
            <span className="text-body-sm text-muted">{formatDate(upload.uploaded_at)}</span>
            <span className="text-body-sm text-muted">{upload.matched_rows} satır</span>
            <button
              type="button"
              onClick={() => handleDelete(upload.id, upload.original_filename)}
              disabled={deletingId === upload.id}
              className="text-body-sm text-muted disabled:text-muted-soft"
              aria-label={`${upload.original_filename} sil`}
            >
              Sil
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={handleCompare}
        disabled={selected.length === 0}
        className="mt-3 h-10 rounded bg-primary px-4 text-body-md text-white disabled:bg-primary-disabled"
      >
        Karşılaştır ({selected.length})
      </button>
    </div>
  );
}
