import type { Metadata } from "next";
import Link from "next/link";
import { Bildeplass } from "@/components/Bildeplass";
import { BookCta } from "@/components/BookCta";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { arrangementer } from "@/lib/arrangementer";
import konfirmasjon from "../../../public/images/langbord.jpg";
import julebord from "../../../public/images/fest--dekket-i-lyktelys.jpg";
import sommerfest from "../../../public/images/garden-sommer.jpg";
import bursdag from "../../../public/images/lokalet--baren-med-plakater.jpg";
import bryllup from "../../../public/images/bord--glass-pa-brett-i-levende-lys.jpg";
import firma from "../../../public/images/fest--dekkede-bord-foran-skinnet.jpg";

export const metadata: Metadata = {
  alternates: { canonical: "/arrangementer" },
  title: "Arrangementer – konfirmasjon, julebord, bryllup og fest",
  description:
    "Lei Potetbua på Nashoug Gård ved Hamar til konfirmasjon, julebord, sommerfest, bursdag, bryllup, jubileum eller firmaarrangement.",
};

// Bildene som vises for hver arrangementstype. En fil som heter arrangement-<type>.jpg i public/images går foran. Samme rekkefølge som i lib/arrangementer.ts.
const reserver = [
  { src: konfirmasjon, alt: "Potetbua med langbordet dekket under tømmerbjelkene, lyslenker i taket og Høna Bar til venstre." },
  { src: julebord, alt: "Dekkede bord i lyktelys, sett innover i Potetbua." },
  { src: sommerfest, alt: "Potetbua en sommerkveld i solnedgang, med flagg ved døra og lys i lyktene." },
  { src: bursdag, alt: "Bardisken i Høna Bar med gamle plakater, traktorseter som barkrakker og flasker på hylla." },
  { src: bryllup, alt: "Glass på brett med blondeserviett, foran levende lys." },
  { src: firma, alt: "Dekkede bord foran et stort skinn på veggen, med lykter i taket." },
];

export default function Arrangementer() {
  return (
    <>
      <PageHeader
        eyebrow="Arrangementer"
        title="Seks måter å bruke bua på"
        lede="Lokalet er det samme. Bordet dekker dere slik anledningen krever."
      />

      <div className="wrap pb-section">
        {arrangementer.map((a, n) => (
          <section
            key={a.slug}
            id={a.slug}
            className="grid scroll-mt-28 items-center gap-8 border-t border-ink/15 py-12 lg:grid-cols-12 lg:gap-6 lg:py-20"
          >
            <Bildeplass
              fil={`arrangement-${a.slug}`}
              motiv={`${a.navn} i Potetbua`}
              reserve={reserver[n]}
              sizes="(min-width: 1024px) 46vw, 100vw"
              ratio="4/3"
              className={n % 2 ? "lg:order-2 lg:col-span-6 lg:col-start-7" : "lg:col-span-6"}
            />
            <Reveal className={n % 2 ? "lg:col-span-5" : "lg:col-span-5 lg:col-start-8"}>
              <p className="font-serif text-h3 text-brass-dark">{String(n + 1).padStart(2, "0")}</p>
              <h2 className="mt-3 text-h2">{a.navn}</h2>
              <p className="mt-5 max-w-[48ch]">{a.tekst}</p>
              <Link href={`/book?type=${a.slug}`} className="btn btn-primary mt-8">
                Book for {a.navn.toLowerCase()}
              </Link>
            </Reveal>
          </section>
        ))}
      </div>

      <BookCta />
    </>
  );
}
