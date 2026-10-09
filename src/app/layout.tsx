import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PORTFOLIO } from "@/data/portfolio";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: `${PORTFOLIO.name} — ${PORTFOLIO.title}`,
  description: `${PORTFOLIO.tagline} Portfolio presented as a Windows 11 desktop.`,
  authors: [{ name: PORTFOLIO.name }],
  keywords: ["Java", "Python", "Spring Boot", "FastAPI", "backend developer", "portfolio"],
  openGraph: {
    title: `${PORTFOLIO.name} — ${PORTFOLIO.title}`,
    description: PORTFOLIO.tagline,
    type: "website",
    siteName: `${PORTFOLIO.name} · Portfolio OS`,
  },
};

export const viewport: Viewport = { themeColor: "#0f1720", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="dark" className={`${inter.variable} ${jetbrains.variable} h-full antialiased`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
