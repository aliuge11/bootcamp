"use client";

import { useRouter } from "next/navigation";
import UploadDropzone from "./UploadDropzone";
import UploadHistoryList from "./UploadHistoryList";
import type { UploadRecord } from "@/types";

export default function HomeContent({ uploads }: { uploads: UploadRecord[] }) {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-3xl p-container-padding">
      <div className="mb-section-margin">
        <UploadDropzone onUploaded={() => router.refresh()} />
      </div>
      <UploadHistoryList uploads={uploads} />
    </div>
  );
}
