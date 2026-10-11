import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { disciplines } from "@/content/capabilities";
import { site } from "@/content/site";
import { has } from "@/content/fill";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/geist-sans-site.woff2",
  variable: "--font-geist-sans",
  weight: "400 600",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

const geistMono = localFont({
  src: "./fonts/geist-mono-site.woff2",
  variable: "--font-geist-mono",
  weight: "400",
  display: "swap",
  fallback: ["ui-monospace", "Menlo", "Consolas", "monospace"],
});

const bricolage = localFont({
  src: "./fonts/bricolage-site.woff2",
  variable: "--font-bricolage",
  weight: "300 800",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
  authors: [{ name: site.name, url: site.url }],
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: site.tagline }],
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description, images: ["/og.jpg"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#06070A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const sameAs = [site.links.github, site.links.linkedin, site.links.x].filter(has);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    knowsAbout: disciplines.map((d) => d.name),
    url: site.url,
    address: { "@type": "PostalAddress", addressLocality: "Kathmandu", addressCountry: "NP" },
    ...(sameAs.length ? { sameAs } : {}),
  };
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable}`}>
      <head>
        {/* Reveal elements start hidden in the HTML; without JavaScript they must simply be visible. */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
