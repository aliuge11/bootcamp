import Link from "next/link";

interface NavToolbarProps {
  onBack: () => void;
  onForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

// Sabit (fixed) konumlandırılıyor ki sayfanın kendi akışında ayrı bir şerit
// kaplamak yerine, üstteki navy app-header'ın sağ tarafında onunla aynı
// hizada görünsün (bkz. DESIGN.md > Navigasyon).
export default function NavToolbar({ onBack, onForward, canGoBack, canGoForward }: NavToolbarProps) {
  return (
    <div className="fixed right-6 top-0 z-20 flex h-14 items-center gap-2">
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
