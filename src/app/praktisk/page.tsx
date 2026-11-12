import type { Metadata } from "next";
import Link from "next/link";
import { BookCta } from "@/components/BookCta";
import { Mangler } from "@/components/Mangler";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  alternates: { canonical: "/praktisk" },
  title: "Praktisk – hva som står klart og hva dere tar med",
  description:
    "Praktisk informasjon om leie av Potetbua på Nashoug Gård: hva som står klart, hva dere tar med selv, og hvordan leien foregår.",
};

const bolker = [
  {
    tittel: "Dette står klart",
    punkter: [
      "Langbord og stoler til 40",
      "Dekketøy til alle gjestene",
      "Kjøkken",
      "Høna Bar",
      "To toaletter",
      "Uteområde",
      "God parkering på gården",
    ],
  },
  {
    tittel: "Dette tar dere med",
    punkter: ["Mat og drikke", "Lydanlegg og lys, hvis dere vil ha det", "Pynt. Pyntingen gjør dere selv"],
  },
  {
    tittel: "Slik foregår leien",
    punkter: [
      "Dere finner en ledig dato og sender en forespørsel",
      "Datoen holdes av i 48 timer",
      "Vi tar kontakt med bekreftelse og et prisforslag",
      "Leien betales per arrangement",
    ],
  },
  {
    tittel: "Husregler",
    punkter: ["Det er ikke mulig å overnatte på gården"],
  },
];

export default function Praktisk() {
  return (
    <>
      <PageHeader
        eyebrow="Praktisk"
        title="Greit å vite før dere booker"
        lede="Hva som står klart i bua, hva dere tar med selv, og hvordan leien foregår."
      />

      <div className="wrap pb-section">
        {bolker.map((b) => (
          <Reveal key={b.tittel} className="grid gap-6 border-t border-ink/15 py-10 lg:grid-cols-12 lg:py-14">
            <h2 className="text-h2 lg:col-span-5">{b.tittel}</h2>
            <ul className="lg:col-span-6 lg:col-start-7">
              {b.punkter.map((p) => (
                <li key={p} className="flex gap-4 border-b border-ink/10 py-4 first:pt-0">
                  <span className="mt-[0.8em] h-px w-5 flex-none bg-brass" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
        <div className="max-w-[60ch]">
          <Mangler>
            Når kan leietaker komme inn for å pynte, når må lokalet være ryddet, og hvem står for vasken etterpå?
          </Mangler>
        </div>
        <p className="mt-10">
          Lurer du på noe annet? Se{" "}
          <Link href="/kontakt#sporsmal" className="prose-link">
            spørsmål og svar
          </Link>{" "}
          eller ta kontakt.
        </p>
      </div>

      <BookCta />
    </>
  );
}
