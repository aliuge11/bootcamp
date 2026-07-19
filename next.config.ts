import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // PowerPoint Web Viewer eklentisi bu siteyi bir iframe içine gömüyor.
        // X-Frame-Options bilinçli olarak eklenmiyor (eklenirse gömme kırılır).
        // frame-ancestors * bilinçli bir karar: eklentinin hangi origin'den
        // yükleyeceği bilinmiyor, iç araç + auth yok (bkz. CLAUDE.md).
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
        ],
      },
    ];
  },
};

export default nextConfig;
