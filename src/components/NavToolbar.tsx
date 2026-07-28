import Link from "next/link";

interface NavToolbarProps {
  onBack: () => void;
  onForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

export default function NavToolbar({ onBack, onForward, canGoBack, canGoForward }: NavToolbarProps) {
  return (
    <div className="mb-2 flex gap-2">
      <button
        type="button"
        onClick={onBack}
        disabled={!canGoBack}
        className="text-body-sm h-8 rounded border border-hairline-strong bg-surface-card px-3 text-ink disabled:border-hairline disabled:text-muted-soft"
      >
        ◀ Geri
      </button>
      <button
        type="button"
        onClick={onForward}
        disabled={!canGoForward}
        className="text-body-sm h-8 rounded border border-hairline-strong bg-surface-card px-3 text-ink disabled:border-hairline disabled:text-muted-soft"
      >
        İleri ▶
      </button>
      <Link
        href="/"
        className="text-body-sm flex h-8 items-center rounded border border-hairline-strong bg-surface-card px-3 text-ink"
      >
        Ana Sayfa
      </Link>
    </div>
  );
}
