import type { Metadata, Viewport } from "next";
import { Barlow } from "next/font/google";
import { SiteNav } from "../components/shell/site-nav";
import "./globals.css";
import { challengeUrl, pageOpenGraph, siteDescription, siteName, siteUrl } from "./site";

// Text paints at once in next/font's size-matched fallback (display: swap); the font files don't block it.
const barlow = Barlow({ preload: false, subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-barlow", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteName, template: `%s | ${siteName}` },
  description: siteDescription,
  openGraph: pageOpenGraph("/", siteName, siteDescription),
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f3ee" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1116" },
  ],
};

const websiteJsonLd = { "@context": "https://schema.org", "@type": "WebSite", name: siteName, url: siteUrl };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={barlow.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <a className="skip-link" href="#main">Skip to content</a>
        <div className="app-shell">
          <SiteNav />
          <div className="app-main">
            <main id="main" tabIndex={-1}>{children}</main>
            <footer className="site-footer">
              <p>Practice demo. Every title and picture here is made up. Bookmarks stay in this browser; nothing is sent.</p>
              <p>Challenge by <a href={challengeUrl}>Frontend Mentor</a>. Built by <a href="https://royeradames.com">Royer Adames</a>.</p>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
