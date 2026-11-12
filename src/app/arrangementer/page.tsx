import type { Metadata } from "next";
import Link from "next/link";
import { Bildeplass } from "@/components/Bildeplass";
import { BookCta } from "@/components/BookCta";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { arrangementer } from "@/lib/arrangementer";
import cognac from "../../../public/images/cognac.jpg";
import koldtbord from "../../../public/images/koldtbord.jpg";
import langbord from "../../../public/images/langbord.jpg";
import middag from "../../../public/images/middag-gjester.jpg";
import flagg from "../../../public/images/potetbua-inngang-flagg.jpg";
import utenfra from "../../../public/images/potetbua-utenfra.jpg";

export const metadata: Metadata = {
  alternates: { canonical: "/arrangementer" },
  title: "Arrangementer – konfirmasjon, julebord, bryllup og fest",
  description:
    "Lei Potetbua på Nashoug Gård ved Hamar til konfirmasjon, julebord, sommerfest, bursdag, bryllup, jubileum eller firmaarrangement.",
};

// Reservebilder til egne bilder av hver arrangementstype er lagt inn. Samme rekkefølge som i lib/arrangementer.ts.
const reserver = [
  { src: flagg, alt: "Inngangen til Potetbua, pyntet med bjørk og norske flagg." },
  { src: middag, alt: "Gjester til bords ved langbordene i Potetbua, under lyslenker og lykter." },
  { src: utenfra, alt: "Potetbua sett mellom trærne en forsommerdag." },
  { src: cognac, alt: "To flasker cognac på en gammel arbeidsbenk." },
  { src: langbord, alt: "Langbord dekket til selskap i Potetbua." },
  { src: koldtbord, alt: "Koldtbord dekket på en gammel høvelbenk." },
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
