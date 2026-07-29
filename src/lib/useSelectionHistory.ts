import { useState } from "react";

/**
 * Sayfaya özel bir geri/ileri geçmişi (tarayıcı geçmişinden bağımsız).
 * PowerPoint'e gömülü iframe'de tarayıcı çerçevesi görünmediği için
 * Geri/İleri butonları bu yığını kullanıyor (bkz. DESIGN.md > Navigasyon).
 *
 * stack ve index tek bir state'te tutuluyor: aksi halde aynı olayda birden
 * çok push (ör. karşılaştırmada Esc'e basınca her haritanın "il görünümüne dön"
 * tetiklemesi) index'i history uzunluğunun ötesine taşırıp `current`'ı undefined
 * bırakabiliyordu. Ayrıca aynı değer arka arkaya itilmiyor (Object.is) — bu hem
 * o çoklu tetiklemeyi tek girdiye indirgiyor hem de anlamsız tekrar girdileri
 * önlüyor. Şehir seçimleri her seferinde yeni bir nesne olduğu için asla eşit
 * sayılmıyor, o davranış değişmiyor.
 */
export function useSelectionHistory<T>(initial: T) {
  const [state, setState] = useState<{ stack: T[]; index: number }>({ stack: [initial], index: 0 });
  const { stack, index } = state;
  const current = stack[index];

  function push(value: T) {
    setState((prev) => {
      if (Object.is(prev.stack[prev.index], value)) return prev;
      return { stack: [...prev.stack.slice(0, prev.index + 1), value], index: prev.index + 1 };
    });
  }

  function goBack() {
    setState((prev) => ({ ...prev, index: Math.max(0, prev.index - 1) }));
  }

  function goForward() {
    setState((prev) => ({ ...prev, index: Math.min(prev.stack.length - 1, prev.index + 1) }));
  }

  return {
    current,
    push,
    goBack,
    goForward,
    canGoBack: index > 0,
    canGoForward: index < stack.length - 1,
  };
}
