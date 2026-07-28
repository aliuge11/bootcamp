export type Bolge =
  | "Marmara"
  | "Ege"
  | "Akdeniz"
  | "İç Anadolu"
  | "Karadeniz"
  | "Doğu Anadolu"
  | "Güneydoğu Anadolu";

export const ALL_BOLGELER: Bolge[] = [
  "Marmara",
  "Ege",
  "Akdeniz",
  "İç Anadolu",
  "Karadeniz",
  "Doğu Anadolu",
  "Güneydoğu Anadolu",
];

// Türkiye'nin 7 coğrafi bölgesi — resmi il/bölge ayrımı. Sadece "Bölge bazlı"
// etiketleme için kullanılıyor; il'in kendi SLA rengini/sınırını değiştirmiyor
// (bkz. MapPanel/TurkeyMap "bolge" labelMode).
const IL_TO_BOLGE: Record<string, Bolge> = {
  İstanbul: "Marmara",
  Kocaeli: "Marmara",
  Sakarya: "Marmara",
  Yalova: "Marmara",
  Bursa: "Marmara",
  Balıkesir: "Marmara",
  Çanakkale: "Marmara",
  Tekirdağ: "Marmara",
  Edirne: "Marmara",
  Kırklareli: "Marmara",
  Bilecik: "Marmara",

  İzmir: "Ege",
  Manisa: "Ege",
  Aydın: "Ege",
  Denizli: "Ege",
  Muğla: "Ege",
  Uşak: "Ege",
  Kütahya: "Ege",
  Afyonkarahisar: "Ege",

  Antalya: "Akdeniz",
  Isparta: "Akdeniz",
  Burdur: "Akdeniz",
  Mersin: "Akdeniz",
  Adana: "Akdeniz",
  Hatay: "Akdeniz",
  Kahramanmaraş: "Akdeniz",
  Osmaniye: "Akdeniz",

  Ankara: "İç Anadolu",
  Konya: "İç Anadolu",
  Kayseri: "İç Anadolu",
  Sivas: "İç Anadolu",
  Yozgat: "İç Anadolu",
  Nevşehir: "İç Anadolu",
  Niğde: "İç Anadolu",
  Aksaray: "İç Anadolu",
  Kırıkkale: "İç Anadolu",
  Kırşehir: "İç Anadolu",
  Çankırı: "İç Anadolu",
  Eskişehir: "İç Anadolu",
  Karaman: "İç Anadolu",

  Samsun: "Karadeniz",
  Trabzon: "Karadeniz",
  Ordu: "Karadeniz",
  Giresun: "Karadeniz",
  Rize: "Karadeniz",
  Artvin: "Karadeniz",
  Zonguldak: "Karadeniz",
  Bartın: "Karadeniz",
  Karabük: "Karadeniz",
  Kastamonu: "Karadeniz",
  Sinop: "Karadeniz",
  Çorum: "Karadeniz",
  Amasya: "Karadeniz",
  Tokat: "Karadeniz",
  Bolu: "Karadeniz",
  Düzce: "Karadeniz",
  Gümüşhane: "Karadeniz",
  Bayburt: "Karadeniz",

  Erzurum: "Doğu Anadolu",
  Erzincan: "Doğu Anadolu",
  Kars: "Doğu Anadolu",
  Ağrı: "Doğu Anadolu",
  Iğdır: "Doğu Anadolu",
  Ardahan: "Doğu Anadolu",
  Van: "Doğu Anadolu",
  Muş: "Doğu Anadolu",
  Bitlis: "Doğu Anadolu",
  Bingöl: "Doğu Anadolu",
  Tunceli: "Doğu Anadolu",
  Elazığ: "Doğu Anadolu",
  Malatya: "Doğu Anadolu",
  Hakkari: "Doğu Anadolu",

  Gaziantep: "Güneydoğu Anadolu",
  Şanlıurfa: "Güneydoğu Anadolu",
  Diyarbakır: "Güneydoğu Anadolu",
  Mardin: "Güneydoğu Anadolu",
  Siirt: "Güneydoğu Anadolu",
  Şırnak: "Güneydoğu Anadolu",
  Batman: "Güneydoğu Anadolu",
  Kilis: "Güneydoğu Anadolu",
  Adıyaman: "Güneydoğu Anadolu",
};

export function getBolge(il: string): Bolge | null {
  return IL_TO_BOLGE[il] ?? null;
}

export interface BolgeAggregate {
  bolge: Bolge;
  kargoSayisi: number;
  slaIci: number;
  slaDisi: number;
}

/**
 * Bölgeleri birbiriyle kıyaslamak için: il/ilçe bazlı satırları bölge bazında
 * toplar. 7 bölgenin hepsi her zaman döndürülür (veri yoksa 0 kargo ile) —
 * haritanın kendi "veri yok = gri" kuralıyla tutarlı olsun diye, o bölge
 * listeden sessizce kaybolmuyor.
 */
export function aggregateByBolge(
  rows: { il: string; kargo_sayisi: number; sla_ici: number; sla_disi: number }[],
): BolgeAggregate[] {
  const totals = new Map<Bolge, BolgeAggregate>(
    ALL_BOLGELER.map((bolge) => [bolge, { bolge, kargoSayisi: 0, slaIci: 0, slaDisi: 0 }]),
  );
  for (const row of rows) {
    const bolge = getBolge(row.il);
    if (!bolge) continue;
    const existing = totals.get(bolge)!;
    existing.kargoSayisi += row.kargo_sayisi;
    existing.slaIci += row.sla_ici;
    existing.slaDisi += row.sla_disi;
  }
  return Array.from(totals.values());
}
