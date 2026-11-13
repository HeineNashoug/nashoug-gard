import type { Metadata } from "next";
import { BookCta } from "@/components/BookCta";
import { Kart } from "@/components/Kart";
import { Mangler } from "@/components/Mangler";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/kontakt" },
  title: "Kontakt, veibeskrivelse og spørsmål",
  description: `Kontakt Nashoug Gård på telefon ${site.phone}. Adresse: ${site.street}, ${site.postal}. Se kart, veibeskrivelse og svar på vanlige spørsmål.`,
};

const sporsmal = [
  ["Hva koster det å leie Potetbua?", "Det kommer an på arrangementet. Send en forespørsel, så får dere et prisforslag fra oss."],
  ["Hvor mange er det plass til?", "40 til bords, eller 60 stående."],
  ["Kan vi ta med egen mat og drikke?", "Ja. Mat og drikke ordner dere selv. Det er kjøkken, dekketøy og bar i bua."],
  ["Finnes det lydanlegg?", "Ja, det er lydanlegg og lys i bua."],
  ["Kan vi pynte selv?", "Ja. Pyntingen står dere for."],
  ["Kan vi overnatte?", "Nei, det er ikke mulig å overnatte på gården."],
  ["Hvor lenge holdes datoen?", "Når dere sender en forespørsel, holdes datoen av i 48 timer mens vi svarer."],
  ["Er det parkering?", "Ja, det er god plass til å parkere på gården."],
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: sporsmal.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
};

export default function Kontakt() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <PageHeader
        eyebrow="Kontakt"
        title="Ta kontakt med Håkon"
        lede="Ring, send en e-post, eller send en forespørsel rett fra kalenderen."
      />

      <section className="wrap grid gap-12 pb-section lg:grid-cols-12 lg:gap-6">
        <Reveal className="lg:col-span-5">
          <dl className="border-t border-ink/15">
            <div className="border-b border-ink/15 py-6">
              <dt className="label text-stone">Telefon</dt>
              <dd className="mt-3 font-serif text-h2">
                <a href={site.phoneHref} className="link-draw">
                  {site.phone}
                </a>
              </dd>
            </div>
            <div className="border-b border-ink/15 py-6">
              <dt className="label text-stone">E-post</dt>
              <dd className="mt-3 font-serif text-h3">
                <a href={`mailto:${site.email}`} className="link-draw break-all">
                  {site.email}
                </a>
              </dd>
            </div>
            <div className="border-b border-ink/15 py-6">
              <dt className="label text-stone">Adresse</dt>
              <dd className="mt-3 font-serif text-h3">
                <address className="not-italic">
                  {site.street}
                  <br />
                  {site.postal}
                </address>
              </dd>
            </div>
          </dl>

          <h2 className="eyebrow mt-12">Veibeskrivelse</h2>
          <p className="mt-5 max-w-[48ch]">
            Nashoug ligger i Ridabu, øst for Hamar sentrum. Det er god plass til å parkere på gården.
          </p>
          <div className="mt-5 max-w-[48ch]">
            <Mangler>Hvor svinger man av, og hvor skal gjestene parkere?</Mangler>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.street}, ${site.postal}`)}`}
            className="label link-draw link-draw-on mt-6"
            target="_blank"
            rel="noopener"
          >
            Åpne i Google Maps
          </a>
        </Reveal>

        <div className="lg:col-span-6 lg:col-start-7">
          <Kart />
        </div>
      </section>

      <section id="sporsmal" className="scroll-mt-28 bg-parchment">
        <div className="wrap grid gap-10 py-section lg:grid-cols-12 lg:gap-6">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow">Spørsmål og svar</p>
            <h2 className="mt-5 text-h2">Det folk pleier å lure på</h2>
          </Reveal>
          <div className="faq border-t border-ink/15 lg:col-span-7 lg:col-start-6">
            {sporsmal.map(([q, a]) => (
              <details key={q} className="border-b border-ink/15">
                <summary>{q}</summary>
                <p className="max-w-[56ch] pb-6">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <BookCta />
    </>
  );
}
