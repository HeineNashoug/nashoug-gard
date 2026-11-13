import Image from "next/image";
import Link from "next/link";
import { ArrangementListe } from "@/components/ArrangementListe";
import { CountUp } from "@/components/CountUp";
import { BookCta } from "@/components/BookCta";
import { Ornament } from "@/components/Ornament";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import rognebaer from "../../public/images/bord--rognebaer-i-levende-lys.jpg";
import honaBar from "../../public/images/hona-bar.jpg";
import hovedhuset from "../../public/images/hovedhuset-host.jpg";
import langbordKveld from "../../public/images/langbord-kveld.jpg";
import vedovnkroken from "../../public/images/lokalet--vedovnkroken.jpg";
import redskapsveggen from "../../public/images/potetbua-historie.jpg";
import potetbua from "../../public/images/uteomradet.jpg";

const steg = [
  {
    tittel: "Finn en ledig dato",
    tekst: "Kalenderen viser hvilke dager som er ledige, reserverte og opptatte.",
  },
  {
    tittel: "Send en forespørsel",
    tekst: "Fortell hva dere skal feire og hvor mange dere blir. Det tar et par minutter.",
  },
  {
    tittel: "Vi tar kontakt",
    tekst: "Datoen holdes av i 48 timer. I mellomtiden får dere bekreftelse og et prisforslag fra oss.",
  },
];

// PLASSHOLDERE: byttes med ekte sitater fra gjester før lansering.
const sitater = [
  { tekst: "Her kommer et sitat fra en gjest som har hatt selskap i Potetbua.", hvem: "Navn, anledning og år" },
  { tekst: "Her kommer et kort sitat til, gjerne fra en annen type arrangement.", hvem: "Navn, anledning og år" },
];

const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

export default function Home() {
  return (
    <>
      <section className="lg:grid lg:min-h-[calc(100svh-5rem)] lg:grid-cols-2">
        <div className="relative h-[48svh] overflow-hidden lg:order-2 lg:h-auto">
          <Image
            src={langbordKveld}
            alt="Langbordet i Potetbua om kvelden, med levende lys og blomster hele veien og lykter over bordet."
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1024px) 50vw, 100vw"
            quality={90}
            placeholder="blur"
            className="ken-burns object-cover"
          />
        </div>

        <div className="flex flex-col justify-end px-5 py-10 lg:py-20 lg:pr-12 lg:pl-[max(48px,calc((100vw-1320px)/2+48px))]">
          <p className="eyebrow fade-in">Festlokale · Ridabu ved Hamar</p>
          <h1 className="mt-5 text-display lg:text-[clamp(4rem,6.4vw,6rem)]">
            <span className="line">
              <span style={i(1)}>Potetbua på</span>
            </span>
            <span className="line">
              <span style={i(2)}>Nashoug Gård</span>
            </span>
          </h1>
          <p className="fade-in mt-6 max-w-[30ch] font-serif text-lede" style={i(4)}>
            Langbord under tømmerbjelker, egen bar og plass til førti rundt bordet.
          </p>
          <div className="fade-in mt-8 flex flex-wrap items-center gap-x-8 gap-y-4" style={i(5)}>
            <Link href="/book" className="btn btn-primary">
              Se ledige datoer
            </Link>
            <Link href="/potetbua" className="label link-draw link-draw-on">
              Se Potetbua
            </Link>
          </div>
        </div>
      </section>

      <section className="wrap grid gap-14 py-section lg:grid-cols-12 lg:gap-6">
        <Reveal className="lg:col-span-5 lg:pt-16">
          <p className="eyebrow">Gården</p>
          <h2 className="mt-5 text-h2">En gård i Ridabu, med festlokale i den røde bua</h2>
          <p className="mt-6 max-w-[34ch] font-serif text-lede">
            Nashoug ligger like utenfor Hamar. Håkon Nashoug og Silja Strømme driver gården, og leier ut Potetbua til
            selskap og fest.
          </p>
          <p className="mt-5 max-w-[52ch]">
            Bua har langbord, dekketøy og egen bar, og det er mange parkeringsmuligheter. Mat og drikke tar dere med selv.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href="/potetbua" className="btn btn-secondary">
              Se Potetbua
            </Link>
            <Link href="/om-garden" className="label link-draw link-draw-on">
              Om gården
            </Link>
          </div>
        </Reveal>

        <div className="lg:col-span-6 lg:col-start-7">
          <Photo
            src={hovedhuset}
            alt="Det hvite hovedhuset på Nashoug Gård i høstsol, med gult løv på trærne og plenen."
            sizes="(min-width: 1024px) 46vw, 100vw"
            ratio="4/3"
          />
          <Photo
            src={potetbua}
            alt="Potetbua sett fra tunet, med grusvei, melkespann ved døra og lykter langs veien."
            sizes="(min-width: 1024px) 20vw, 60vw"
            ratio="4/5"
            caption="Hovedhuset en høstdag, og Potetbua sett fra tunet."
            parallax
            className="relative z-10 -mt-6 ml-auto w-3/5 border-8 border-cream bg-cream lg:-mt-40 lg:mr-auto lg:-ml-24 lg:w-[44%]"
          />
        </div>
      </section>

      <section className="bg-parchment">
        <div className="mx-auto grid max-w-[1920px] lg:grid-cols-12 lg:items-center">
          <Photo
            src={honaBar}
            alt="Høna Bar med høne i keramikk, lysestake i messing og krukke med rognebær, og en gammel trillebår foran."
            sizes="(min-width: 1024px) 50vw, 100vw"
            ratio="4/5"
            className="lg:col-span-6"
          />
          <Reveal className="px-5 py-16 lg:col-span-5 lg:col-start-8 lg:py-24 lg:pr-12 lg:pl-0">
            <p className="eyebrow">Potetbua</p>
            <h2 className="mt-5 text-h2">Langbord, levende lys og Høna Bar</h2>
            <p className="mt-6 max-w-[34ch] font-serif text-lede">
              Bua er innredet med gamle redskaper fra gården, lykter under bjelkene og et langbord som går gjennom hele
              rommet.
            </p>
            <p className="mt-5 max-w-[52ch]">
              Kjøkken, dekketøy og to toaletter er på plass, og det er uteområde og god parkering. Lydanlegg og festlys
              finnes også. Pyntingen står dere for.
            </p>
            <dl className="mt-10 flex gap-12 border-t border-ink/15 pt-8">
              <div>
                <dd className="font-serif text-[4.5rem] leading-none text-forest">
                  <CountUp to={40} />
                </dd>
                <dt className="label mt-3 text-stone">Til bords</dt>
              </div>
              <div>
                <dd className="font-serif text-[4.5rem] leading-none text-forest">
                  <CountUp to={60} />
                </dd>
                <dt className="label mt-3 text-stone">Stående</dt>
              </div>
            </dl>
            <Link href="/potetbua" className="btn btn-secondary mt-10">
              Se hele Potetbua
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="wrap py-section">
        <Reveal className="mb-12 lg:mb-16">
          <p className="eyebrow">Arrangementer</p>
          <h2 className="mt-5 max-w-[18ch] text-h2">Fra konfirmasjon til julebord</h2>
        </Reveal>
        <ArrangementListe />
      </section>

      <Ornament />

      <section className="wrap py-section">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="space-y-10 lg:order-2 lg:col-span-6 lg:col-start-7 lg:space-y-16 lg:pt-24">
            <Reveal>
              <p className="eyebrow">Bilder</p>
              <h2 className="mt-5 text-h2">Fra selskap i bua</h2>
              <Link href="/galleri" className="label link-draw link-draw-on mt-6">
                Se galleriet
              </Link>
            </Reveal>
            <Photo
              src={redskapsveggen}
              alt="Glass på brett foran veggen med gamle redskaper, kornbunter og lysestaker."
              sizes="(min-width: 1024px) 46vw, 100vw"
              ratio="3/2"
              caption="Klart til velkomstdrink foran redskapsveggen."
              parallax
            />
          </div>
          <div className="space-y-10 lg:col-span-5 lg:space-y-6">
            <Photo
              src={rognebaer}
              alt="Skål med rognebær og eple foran tre tente lys."
              sizes="(min-width: 1024px) 38vw, 100vw"
              ratio="4/5"
              caption="Rognebær og levende lys på bordet."
            />
            <Photo
              src={vedovnkroken}
              alt="Kroken ved vedovnen med saueskinn på benken, gamle foto og lykter."
              sizes="(min-width: 1024px) 24vw, 66vw"
              ratio="4/3"
              caption="Kroken ved vedovnen."
              className="ml-auto w-2/3 lg:w-3/5"
            />
          </div>
        </div>
      </section>

      <section className="on-dark bg-forest text-cream">
        <div className="wrap grid gap-12 py-section lg:grid-cols-12 lg:gap-6">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow">Slik booker du</p>
            <h2 className="mt-5 max-w-[16ch] text-h2">Finn en ledig dato og send en forespørsel</h2>
            <Link href="/book" className="btn btn-light mt-8">
              Se ledige datoer
            </Link>
          </Reveal>
          <ol className="border-t border-cream/20 lg:col-span-6 lg:col-start-7">
            {steg.map((s, n) => (
              <li key={s.tittel} className="border-b border-cream/20">
                <Reveal delay={n * 0.08} className="grid grid-cols-[2.5rem_1fr] gap-x-4 py-7 lg:grid-cols-[4rem_1fr]">
                  <span className="font-serif text-h3 text-brass-light">{n + 1}</span>
                  <div>
                    <h3 className="text-h3">{s.tittel}</h3>
                    <p className="mt-2 max-w-[44ch] text-cream/85">{s.tekst}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap py-section">
        <Reveal>
          <p className="eyebrow">Gjestene forteller</p>
          <p className="label mt-4 inline-block border border-barn px-3 py-2 text-barn">
            Plassholdere · byttes med ekte sitater før lansering
          </p>
        </Reveal>
        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-6">
          {sitater.map((q, n) => (
            <Reveal key={n} delay={n * 0.08} className={n === 0 ? "lg:col-span-6" : "lg:col-span-5 lg:col-start-8 lg:mt-24"}>
              <figure>
                <blockquote className="font-serif text-[clamp(1.625rem,3vw,2.25rem)] leading-[1.25] italic">
                  «{q.tekst}»
                </blockquote>
                <figcaption className="label mt-6 text-stone">{q.hvem}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <BookCta />
    </>
  );
}
