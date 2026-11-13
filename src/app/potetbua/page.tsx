import type { Metadata } from "next";
import Link from "next/link";
import { Bildeplass } from "@/components/Bildeplass";
import { BookCta } from "@/components/BookCta";
import { CountUp } from "@/components/CountUp";
import { Mangler } from "@/components/Mangler";
import { Ornament } from "@/components/Ornament";
import { PageHeader } from "@/components/PageHeader";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import honaBar from "../../../public/images/hona-bar.jpg";
import langbord from "../../../public/images/langbord.jpg";

export const metadata: Metadata = {
  alternates: { canonical: "/potetbua" },
  title: "Potetbua – festlokale med plass til 40",
  description:
    "Potetbua på Nashoug Gård i Ridabu: langbord til 40, plass til 60 stående, kjøkken, dekketøy, egen bar, to toaletter og god parkering.",
};

const fasiliteter = [
  ["Bord og stoler", "Langbord og stoler til 40."],
  ["Dekketøy", "Til alle gjestene."],
  ["Kjøkken", "Komfyr med stekeovn, kjøleskap, fryser, oppvaskmaskin og kaffetrakter."],
  ["Bar", "Høna Bar. Drikke tar dere med selv."],
  ["Toaletter", "To."],
  ["Uteområde", "Til bruk når været holder."],
  ["Parkering", "Mange parkeringsmuligheter på gården."],
  ["Adkomst", "Ingen trapper inn, men en dørstokk ved inngangen."],
  ["Lyd og lys", "Lydanlegg og festlys."],
];

export default function Potetbua() {
  return (
    <>
      <PageHeader
        eyebrow="Potetbua"
        title="Festlokale med tømmer i taket"
        lede="Ett rom, ett langt bord og egen bar. Plass til førti til bords eller seksti stående."
      />

      <div className="wrap">
        <Photo
          src={langbord}
          alt="Potetbua med langbordet dekket under tømmerbjelkene, lyslenker i taket og Høna Bar til venstre."
          sizes="(min-width: 1320px) 1224px, 100vw"
          ratio="3/2"
          caption="Langbordet dekket til førti."
          forst
        />
      </div>

      <section className="wrap grid gap-12 py-section lg:grid-cols-12 lg:gap-6">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow">Historien</p>
          <h2 className="mt-5 text-h2">Historien bak bua</h2>
          <p className="mt-6 max-w-[52ch]">
            I dag er bua innredet med gamle redskaper fra gården langs veggene, lykter under bjelkene og langbord på
            tregulvet.
          </p>
          <div className="mt-6 max-w-[52ch]">
            <Mangler>Når ble Potetbua bygget, hva ble den brukt til, og når ble den tatt i bruk til selskap?</Mangler>
          </div>
        </Reveal>
        <Bildeplass
          fil="potetbua-historie"
          motiv="Potetbua i gamle dager, eller redskapene på veggen i dag"
          sizes="(min-width: 1024px) 46vw, 100vw"
          ratio="4/3"
          className="lg:col-span-6 lg:col-start-7"
        />
      </section>

      <section className="bg-parchment">
        <div className="wrap grid gap-12 py-section lg:grid-cols-12 lg:gap-6">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow">Kapasitet</p>
            <dl className="mt-8 flex gap-12">
              <div>
                <dd className="font-serif text-[5.5rem] leading-none text-forest">
                  <CountUp to={40} />
                </dd>
                <dt className="label mt-3 text-stone">Til bords</dt>
              </div>
              <div>
                <dd className="font-serif text-[5.5rem] leading-none text-forest">
                  <CountUp to={60} />
                </dd>
                <dt className="label mt-3 text-stone">Stående</dt>
              </div>
            </dl>
          </Reveal>
          <Reveal className="lg:col-span-7 lg:col-start-6">
            <h2 className="eyebrow">Dette står klart</h2>
            <dl className="mt-8 border-t border-ink/15">
              {fasiliteter.map(([navn, tekst]) => (
                <div key={navn} className="grid gap-x-6 gap-y-1 border-b border-ink/15 py-5 sm:grid-cols-[12rem_1fr]">
                  <dt className="font-serif text-h3">{navn}</dt>
                  <dd className="self-center text-stone">{tekst}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <Ornament />

      <section className="wrap py-section">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          <Photo
            src={honaBar}
            alt="Høna Bar med høne i keramikk, lysestake i messing og krukke med rognebær, og en gammel trillebår foran."
            sizes="(min-width: 1024px) 38vw, 100vw"
            ratio="4/5"
            caption="Høna Bar."
            className="lg:col-span-5"
          />
          <div className="space-y-10 lg:col-span-6 lg:col-start-7 lg:space-y-6 lg:pt-24">
            <Bildeplass
              fil="kjokken"
              motiv="Kjøkkenet, med benk og utstyr"
              sizes="(min-width: 1024px) 46vw, 100vw"
              ratio="3/2"
              caption="Kjøkkenet, med oppvaskmaskin og kaffetrakter."
            />
            <Bildeplass
              fil="uteomradet"
              motiv="Uteområdet ved bua en sommerkveld"
              sizes="(min-width: 1024px) 28vw, 66vw"
              ratio="4/3"
              caption="Uteområdet."
              className="w-2/3 lg:w-3/5"
            />
            <Link href="/galleri" className="label link-draw link-draw-on">
              Se alle bildene
            </Link>
          </div>
        </div>
      </section>

      <BookCta />
    </>
  );
}
