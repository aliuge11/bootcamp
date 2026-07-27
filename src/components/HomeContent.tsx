"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import UploadDropzone from "./UploadDropzone";
import UploadHistoryList from "./UploadHistoryList";
import type { UploadRecord } from "@/types";

interface HomeContentProps {
  uploads: UploadRecord[];
  firstUploadId: string | null;
  lastUploadId: string | null;
}

export default function HomeContent({ uploads, firstUploadId, lastUploadId }: HomeContentProps) {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-3xl p-container-padding">
      <div className="mb-section-margin">
        <UploadDropzone onUploaded={() => router.refresh()} />
      </div>
      {firstUploadId && lastUploadId && (
        <Link
          href={`/map/compare?ids=${firstUploadId},${lastUploadId}`}
          className="text-body-sm mb-card-gap inline-block text-primary"
        >
          İlk ve son yüklemeyi karşılaştır →
        </Link>
      )}
      <UploadHistoryList uploads={uploads} onDeleted={() => router.refresh()} />
    </div>
  );
}
