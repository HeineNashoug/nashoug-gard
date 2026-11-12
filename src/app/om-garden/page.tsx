import type { Metadata } from "next";
import { Bildeplass } from "@/components/Bildeplass";
import { BookCta } from "@/components/BookCta";
import { Mangler } from "@/components/Mangler";
import { Ornament } from "@/components/Ornament";
import { PageHeader } from "@/components/PageHeader";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import hovedhuset from "../../../public/images/hovedhuset-host.jpg";
import flagg from "../../../public/images/potetbua-inngang-flagg.jpg";
import utenfra from "../../../public/images/potetbua-utenfra.jpg";

export const metadata: Metadata = {
  alternates: { canonical: "/om-garden" },
  title: "Om gården – Nashoug i Ridabu",
  description:
    "Nashoug Gård ligger i Ridabu, like utenfor Hamar. Gården drives av Håkon Nashoug og familien, som leier ut festlokalet Potetbua.",
};

const aaret = [
  { fil: "garden-var", navn: "Vår", motiv: "Gården om våren", reserve: { src: utenfra, alt: "Potetbua sett mellom trær i blomst." } },
  { fil: "garden-sommer", navn: "Sommer", motiv: "Gården om sommeren", reserve: { src: flagg, alt: "Inngangen til Potetbua, pyntet med bjørk og flagg." } },
  { fil: "garden-host", navn: "Høst", motiv: "Innhøsting eller høstfarger på jordene" },
  { fil: "garden-vinter", navn: "Vinter", motiv: "Gården i snø, gjerne med lys i vinduene" },
];

export default function OmGarden() {
  return (
    <>
      <PageHeader
        eyebrow="Om gården"
        title="Nashoug i Ridabu"
        lede="En gård like utenfor Hamar, drevet av familien Nashoug."
      />

      <div className="wrap">
        <Photo
          src={hovedhuset}
          alt="Det hvite hovedhuset på Nashoug Gård en høstdag, med gult løv på trærne og på plenen."
          sizes="(min-width: 1320px) 1024px, 100vw"
          ratio="16/9"
          caption="Hovedhuset på Nashoug."
          forst
          className="lg:w-5/6"
        />
      </div>

      <section className="wrap grid gap-12 py-section lg:grid-cols-12 lg:gap-6">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow">Familien</p>
          <h2 className="mt-5 text-h2">De som driver gården</h2>
          <p className="mt-6 max-w-[34ch] font-serif text-lede">
            Håkon Nashoug driver gården i dag, sammen med Silja Strømme og barna Heine, Sølve og Sondre.
          </p>
          <p className="mt-5 max-w-[52ch]">Før dem var det Vigdis og Even Nashoug som drev Nashoug.</p>
          <div className="mt-6 max-w-[52ch]">
            <Mangler>
              Gårdens historie: når den ble bygget, hvor lenge familien har vært her, og hva som dyrkes i dag.
            </Mangler>
          </div>
        </Reveal>
        <Bildeplass
          fil="familien"
          motiv="Familien på gården"
          sizes="(min-width: 1024px) 46vw, 100vw"
          ratio="4/3"
          parallax
          className="lg:col-span-6 lg:col-start-7"
        />
      </section>

      <Ornament />

      <section className="wrap py-section">
        <Reveal>
          <p className="eyebrow">Året rundt</p>
          <h2 className="mt-5 text-h2">Gården gjennom året</h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-6">
          {aaret.map((a, n) => (
            <div key={a.fil} className={n % 2 ? "lg:mt-16" : ""}>
              <Bildeplass
                fil={a.fil}
                motiv={a.motiv}
                reserve={a.reserve}
                sizes="(min-width: 1024px) 23vw, 50vw"
                ratio="4/5"
              />
              <p className="label mt-4 text-stone">{a.navn}</p>
            </div>
          ))}
        </div>
      </section>

      <BookCta />
    </>
  );
}
