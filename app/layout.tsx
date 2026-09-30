import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { CURRENT_MATCH as match } from "@/data/matches";
import "./globals.css";

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.CF_PAGES_URL ?? // definido automaticamente nos builds do Cloudflare Pages
  "http://localhost:3000";

const title = `${match.teamA} vs ${match.teamB} · Joga o jogo`;
const description = "Cada um recebe um desafio e um evento raro. Quando acontecer, bebe o número indicado.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title: `${match.teamA} vs ${match.teamB}`,
    description,
    type: "website",
    locale: "pt_PT",
  },
  twitter: { card: "summary_large_image" },
  appleWebApp: { title: "Joga o jogo", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#0b0f0d",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-PT" className={`${barlow.variable} ${inter.variable} antialiased`}>
      <body className="min-h-dvh font-sans">
        <div className="stadium-glow min-h-dvh">
          <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 md:px-10">{children}</div>
        </div>
      </body>
    </html>
  );
}
