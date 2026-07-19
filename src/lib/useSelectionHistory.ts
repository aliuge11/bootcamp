import { useState } from "react";

/**
 * Sayfaya özel bir geri/ileri geçmişi (tarayıcı geçmişinden bağımsız).
 * PowerPoint'e gömülü iframe'de tarayıcı çerçevesi görünmediği için
 * Geri/İleri butonları bu yığını kullanıyor (bkz. DESIGN.md > Navigasyon).
 */
export function useSelectionHistory<T>(initial: T) {
  const [history, setHistory] = useState<T[]>([initial]);
  const [index, setIndex] = useState(0);

  const current = history[index];

  function push(value: T) {
    setHistory((prev) => [...prev.slice(0, index + 1), value]);
    setIndex((i) => i + 1);
  }

  function goBack() {
    setIndex((i) => Math.max(0, i - 1));
  }

  function goForward() {
    setIndex((i) => Math.min(history.length - 1, i + 1));
  }

  return {
    current,
    push,
    goBack,
    goForward,
    canGoBack: index > 0,
    canGoForward: index < history.length - 1,
  };
}
