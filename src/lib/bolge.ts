export type Bolge =
  | "Marmara"
  | "Ege"
  | "Akdeniz"
  | "İç Anadolu"
  | "Karadeniz"
  | "Doğu Anadolu"
  | "Güneydoğu Anadolu";

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
