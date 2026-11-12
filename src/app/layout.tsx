import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Mono, Fraunces } from "next/font/google";
import { PROFILE } from "@/content/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
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
  themeColor: "#f6efe7",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${bricolage.variable} ${dmMono.variable}`}>
      <body>
        {/* The torn-edge filter every paper scrap shares. */}
        <svg aria-hidden="true" width="0" height="0" className="absolute">
          <defs>
            <filter id="torn" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="7" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>
        <a
          href="#main"
          className="label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-ink focus:px-4 focus:py-3 focus:text-cream"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
