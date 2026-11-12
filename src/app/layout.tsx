import type { Metadata, Viewport } from "next";
import { Archivo, DM_Mono, Newsreader } from "next/font/google";
import { PROFILE } from "@/content/site";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-newsreader",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

const name = `${PROFILE.firstName} ${PROFILE.lastName}`;

export const metadata: Metadata = {
  title: `${name} — ${PROFILE.role}`,
  description: PROFILE.intro,
  openGraph: {
    title: `${name} — ${PROFILE.role}`,
    description: PROFILE.headline,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f2eee3",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${newsreader.variable} ${dmMono.variable}`}>
      <body>
        <a
          href="#main"
          className="label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
