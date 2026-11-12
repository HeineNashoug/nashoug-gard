import type { Metadata } from "next";
import localFont from "next/font/local";
import { ViewTransition } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Monogram } from "@/components/Monogram";
import { Providers } from "@/components/Providers";
import { site } from "@/lib/site";
import "./globals.css";

const cormorant = localFont({
  variable: "--font-cormorant",
  src: [
    { path: "./fonts/cormorant-garamond-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/cormorant-garamond-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
});

const hanken = localFont({
  variable: "--font-hanken",
  src: "./fonts/hanken-grotesk-latin-wght-normal.woff2",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Festlokale Hamar – Potetbua på Nashoug Gård",
    template: `%s · ${site.name}`,
  },
  description:
    "Potetbua på Nashoug Gård i Ridabu, like utenfor Hamar. Festlokale med langbord til 40, egen bar og god parkering. Se ledige datoer og send en forespørsel.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: site.name, locale: "nb_NO" },
};

// Strukturert informasjon til Google: stedet, adressen og hva det brukes til.
const schema = {
  "@context": "https://schema.org",
  "@type": ["EventVenue", "LocalBusiness"],
  name: "Potetbua på Nashoug Gård",
  description: "Festlokale på gård i Ridabu, like utenfor Hamar. Langbord til 40, plass til 60 stående.",
  url: site.url,
  image: site.url + "/opengraph-image.jpg",
  telephone: "+4799649700",
  email: site.email,
  maximumAttendeeCapacity: 60,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.street,
    postalCode: site.postal.split(" ")[0],
    addressLocality: site.postal.split(" ")[1],
    addressCountry: "NO",
  },
};

// Introen vises én gang per økt. Kjøres før første tegning, så den ikke blinker.
const introScript = `try{var d=document.documentElement;if(sessionStorage.getItem("intro"))d.dataset.intro="done";else{sessionStorage.setItem("intro","1");setTimeout(function(){d.dataset.intro="done"},1600)}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nb" className={`${cormorant.variable} ${hanken.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}.intro{display:none}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-svh flex-col">
        <div className="intro" aria-hidden="true">
          <Monogram className="h-28" />
        </div>
        <a href="#innhold" className="btn btn-primary sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50">
          Hopp til innholdet
        </a>
        <Providers>
          <Header />
          <main id="innhold" className="flex-1">
            <ViewTransition>{children}</ViewTransition>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
