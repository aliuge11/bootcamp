import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Etkileşimli Şehir Haritası",
  description: "İl ve ilçe bazlı SLA performansını gösteren etkileşimli Türkiye haritası.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={inter.variable}>
      <body>
        <header className="flex h-14 items-center bg-navy px-6 text-white text-headline-sm">
          Etkileşimli Şehir Haritası
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
