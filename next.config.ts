import type { NextConfig } from "next";

// PowerPoint Web Viewer eklentisi bu siteyi bir iframe içine gömüyor.
// X-Frame-Options ve Content-Security-Policy: frame-ancestors bilinçli olarak
// HİÇ eklenmiyor — ikisi de yokken tarayıcılar zaten sınırsız gömmeye izin
// veriyor (kısıtlama sadece bu başlıklar açıkça kısıtlayıcı bir değerle set
// edildiğinde devreye giriyor). Daha önce `frame-ancestors *` açıkça set
// edilmişti; "Web Viewer 2.0" eklentisi bu joker karakteri tanımayıp
// "kısıtlama var" sanıp gömmeyi reddetti — başlığı tamamen kaldırmak aynı
// (kısıtlamasız) davranışı veriyor ama bu eklentinin ön-kontrolüne takılmıyor.
const nextConfig: NextConfig = {};

export default nextConfig;
