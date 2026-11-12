"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { sendForesporsel } from "@/app/book/actions";
import type { Ledighet, Tillegg } from "@/lib/booking";
import { formaterDato, idag, leggTil } from "@/lib/dato";
import { Kalender } from "./Kalender";

const STEG = ["Dato", "Arrangement", "Tillegg", "Kontakt", "Bekreft"];
const MAKS_DATOER = 3;
const MAKS_GJESTER = 60;

type Feil = Record<string, string>;

export function BookingFlyt({
  tillegg,
  typer,
  startType,
  startLedighet,
}: {
  startLedighet: Ledighet;
  tillegg: Tillegg[];
  typer: { id: string; navn: string }[];
  startType: string;
}) {
  const [steg, setSteg] = useState(0);
  const [d, setD] = useState({
    datoer: [] as string[],
    tid: "",
    type: startType,
    gjester: "",
    tillegg: [] as string[],
    navn: "",
    epost: "",
    telefon: "",
    melding: "",
    godtatt: false,
    nettsted: "",
  });
  const [feil, setFeil] = useState<Feil>({});
  const [ledighet, setLedighet] = useState(startLedighet);
  const [varsel, setVarsel] = useState("");
  const [sender, setSender] = useState(false);
  const [referanse, setReferanse] = useState("");
  const tittel = useRef<HTMLHeadingElement>(null);
  const topp = useRef<HTMLDivElement>(null);
  const forsteVisning = useRef(true);

  const forst = leggTil(idag(), 1);
  const sist = leggTil(idag(), 24 * 30);
  // Oppdaterer feltene, og fjerner feilmeldingen på det som nettopp ble endret.
  const sett = (felt: Partial<typeof d>) => {
    setD((f) => ({ ...f, ...felt }));
    setFeil((f) => Object.fromEntries(Object.entries(f).filter(([k]) => !(k in felt))));
  };

  // Ledigheten kommer fersk fra databasen når siden åpnes, og hentes på nytt hver gang fanen får fokus igjen.
  const oppdater = async () => {
    try {
      const res = await fetch("/api/ledighet", { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const ny: Ledighet = await res.json();
      setLedighet(ny);
      if (d.datoer.some((dato) => dato in ny)) {
        sett({ datoer: d.datoer.filter((dato) => !(dato in ny)) });
        setVarsel("En dato du hadde valgt, er ikke lenger ledig. Velg en annen.");
      }
    } catch {
      setVarsel("Vi fikk ikke hentet kalenderen. Sjekk nettforbindelsen og prøv igjen.");
    }
  };

  useEffect(() => {
    addEventListener("focus", oppdater);
    return () => removeEventListener("focus", oppdater);
  });

  // Ved stegbytte: flytt fokus til overskriften, så skjermlesere og tastatur følger med.
  useEffect(() => {
    if (forsteVisning.current) {
      forsteVisning.current = false;
      return;
    }
    topp.current?.scrollIntoView({ block: "start" });
    tittel.current?.focus({ preventScroll: true });
  }, [steg, referanse]);

  const velgDato = (dato: string) => {
    setVarsel("");
    if (d.datoer.includes(dato)) return sett({ datoer: d.datoer.filter((x) => x !== dato) });
    if (d.datoer.length >= MAKS_DATOER) return setVarsel(`Du kan velge inntil ${MAKS_DATOER} datoer. Fjern en for å velge en ny.`);
    sett({ datoer: [...d.datoer, dato].sort() });
  };

  const sjekk = (n: number): Feil => {
    const f: Feil = {};
    if (n === 0 && !d.datoer.length) f.datoer = "Velg minst én ledig dato i kalenderen.";
    if (n === 1) {
      if (!d.type) f.type = "Velg type arrangement.";
      const g = Number(d.gjester);
      if (!Number.isInteger(g) || g < 1 || g > MAKS_GJESTER) f.gjester = `Skriv et antall mellom 1 og ${MAKS_GJESTER}.`;
    }
    if (n === 3) {
      if (d.navn.trim().length < 2) f.navn = "Skriv navnet ditt.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.epost)) f.epost = "Skriv en gyldig e-postadresse.";
      if (d.telefon.replace(/\D/g, "").length < 8) f.telefon = "Skriv et telefonnummer med minst åtte siffer.";
    }
    if (n === 4 && !d.godtatt) f.godtatt = "Kryss av for at du har lest det praktiske.";
    return f;
  };

  const visFeil = (f: Feil) => {
    setFeil(f);
    // Flytt fokus til det første feltet med feil.
    requestAnimationFrame(() => document.getElementById(Object.keys(f)[0])?.focus());
  };

  const neste = () => {
    const f = sjekk(steg);
    if (Object.keys(f).length) return visFeil(f);
    setFeil({});
    setVarsel("");
    setSteg(steg + 1);
  };

  const send = async () => {
    const f = sjekk(4);
    if (Object.keys(f).length) return visFeil(f);
    setSender(true);
    setVarsel("");
    try {
      const svar = await sendForesporsel({ ...d, gjester: Number(d.gjester) });
      if (svar.ok) return setReferanse(svar.referanse);
      if (svar.opptatt) {
        await oppdater();
        setVarsel("Datoen ble nettopp reservert av noen andre. Velg en annen dato.");
        setSteg(0);
      } else if (svar.feil) {
        // Gå til det første steget som har en feil.
        const forsteSteg = [0, 1, 3, 4].find((n) => Object.keys(sjekk(n)).length) ?? 4;
        setSteg(forsteSteg);
        setFeil(svar.feil);
      } else setVarsel(svar.melding ?? "Noe gikk galt. Prøv igjen.");
    } catch {
      setVarsel("Vi fikk ikke sendt forespørselen. Sjekk nettforbindelsen og prøv igjen.");
    } finally {
      setSender(false);
    }
  };

  const typeNavn = typer.find((t) => t.id === d.type)?.navn;
  const valgteTillegg = tillegg.filter((t) => d.tillegg.includes(t.id));

  if (referanse)
    return (
      <div ref={topp} className="max-w-[60ch] scroll-mt-24 lg:scroll-mt-28">
        <p className="eyebrow">Referanse {referanse}</p>
        <h2 ref={tittel} tabIndex={-1} className="mt-5 text-h1 outline-none">
          Forespørselen er sendt
        </h2>
        <p className="mt-6 font-serif text-lede">
          Takk, {d.navn.trim().split(" ")[0]}. Vi har holdt av {d.datoer.length > 1 ? "datoene" : "datoen"} til dere i 48
          timer.
        </p>
        <ul className="mt-8 border-t border-ink/15">
          {d.datoer.map((dato) => (
            <li key={dato} className="border-b border-ink/15 py-4 font-serif text-h3 first-letter:uppercase">
              {formaterDato(dato)}
            </li>
          ))}
        </ul>
        <h3 className="eyebrow mt-12">Dette skjer nå</h3>
        <ol className="mt-5 list-decimal space-y-3 pl-5">
          <li>
            Du får en bekreftelse på e-post til <strong className="font-medium">{d.epost}</strong>.
          </li>
          <li>Vi ser på forespørselen og tar kontakt med bekreftelse og et prisforslag.</li>
          <li>Bookingen er ikke bindende før vi har bekreftet den.</li>
        </ol>
        <Link href="/" className="btn btn-secondary mt-10">
          Til forsiden
        </Link>
      </div>
    );

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
      <div ref={topp} className="min-w-0 scroll-mt-24 lg:col-span-7 lg:scroll-mt-28">
        {/* Fremdrift */}
        <p className="label text-stone lg:hidden">
          Steg {steg + 1} av {STEG.length} · {STEG[steg]}
        </p>
        <ol className="mt-3 grid grid-cols-5 gap-1 lg:mt-0 lg:gap-3">
          {STEG.map((navn, n) => (
            <li key={navn} aria-current={n === steg ? "step" : undefined}>
              <button
                type="button"
                disabled={n >= steg}
                onClick={() => {
                  setFeil({});
                  setSteg(n);
                }}
                className="group block w-full text-left disabled:cursor-default"
                aria-label={`Steg ${n + 1}: ${navn}${n < steg ? ", gå tilbake hit" : ""}`}
              >
                <span className={`block h-0.5 ${n <= steg ? "bg-brass" : "bg-ink/15"}`} />
                <span className={`label mt-3 hidden lg:block ${n === steg ? "text-ink" : "text-stone"} ${n < steg ? "group-hover:text-forest" : ""}`}>
                  {n + 1}. {navn}
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div className="mt-10" role="alert">
          {varsel && <p className="mb-6 border border-barn px-4 py-3 text-barn">{varsel}</p>}
        </div>

        {steg === 0 && (
          <section>
            <h2 ref={tittel} tabIndex={-1} className="text-h2 outline-none">
              Når skal dere feire?
            </h2>
            <p className="mt-4 max-w-[52ch] text-stone">
              Trykk på en ledig dato. Trenger dere dagen før til pynting, velger dere begge dagene.
            </p>
            <div className="mt-8" id="datoer" tabIndex={-1}>
              <Kalender ledighet={ledighet} valgt={d.datoer} onVelg={velgDato} forst={forst} sist={sist} />
            </div>
            {feil.datoer && <p className="felt-feil">{feil.datoer}</p>}
            <p className="mt-6" aria-live="polite">
              {d.datoer.length ? (
                <>
                  <span className="label text-stone">Valgt: </span>
                  {d.datoer.map(formaterDato).join(" og ")}
                </>
              ) : (
                <span className="text-stone">Ingen dato valgt ennå.</span>
              )}
            </p>
            <label className="mt-8 block max-w-[16rem]">
              <span className="felt-navn">Omtrent når starter dere? (valgfritt)</span>
              <input type="time" className="felt-inn" value={d.tid} onChange={(e) => sett({ tid: e.target.value })} />
            </label>
          </section>
        )}

        {steg === 1 && (
          <section>
            <h2 ref={tittel} tabIndex={-1} className="text-h2 outline-none">
              Hva skal dere feire?
            </h2>
            <fieldset className="mt-8">
              <legend className="felt-navn">Type arrangement</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {typer.map((t, n) => (
                  <label key={t.id} className="valg">
                    <input
                      type="radio"
                      name="type"
                      id={n === 0 ? "type" : undefined}
                      checked={d.type === t.id}
                      onChange={() => sett({ type: t.id })}
                    />
                    {t.navn}
                  </label>
                ))}
              </div>
              {feil.type && <p className="felt-feil">{feil.type}</p>}
            </fieldset>
            <label className="mt-8 block max-w-[16rem]">
              <span className="felt-navn">Antall gjester</span>
              <input
                id="gjester"
                type="number"
                inputMode="numeric"
                min={1}
                max={MAKS_GJESTER}
                className="felt-inn"
                value={d.gjester}
                onChange={(e) => sett({ gjester: e.target.value })}
                aria-invalid={!!feil.gjester}
                aria-describedby="gjester-hjelp"
              />
            </label>
            <p id="gjester-hjelp" className={feil.gjester ? "felt-feil" : "mt-2 text-small text-stone"}>
              {feil.gjester ?? "Bua har plass til 40 til bords, eller 60 stående."}
            </p>
          </section>
        )}

        {steg === 2 && (
          <section>
            <h2 ref={tittel} tabIndex={-1} className="text-h2 outline-none">
              Ønsker dere noe i tillegg?
            </h2>
            {tillegg.length ? (
              <>
                <p className="mt-4 max-w-[52ch] text-stone">Kryss av for det dere vil ha med i prisforslaget. Dere kan hoppe over dette.</p>
                <div className="mt-8 grid gap-2">
                  {tillegg.map((t) => (
                    <label key={t.id} className="valg">
                      <input
                        type="checkbox"
                        checked={d.tillegg.includes(t.id)}
                        onChange={(e) =>
                          sett({ tillegg: e.target.checked ? [...d.tillegg, t.id] : d.tillegg.filter((x) => x !== t.id) })
                        }
                      />
                      <span>
                        {t.name}
                        {t.description && <span className="block text-small text-stone">{t.description}</span>}
                      </span>
                    </label>
                  ))}
                </div>
              </>
            ) : (
              <p className="mt-4 text-stone">Det er ingen tillegg å velge akkurat nå. Gå videre.</p>
            )}
          </section>
        )}

        {steg === 3 && (
          <section>
            <h2 ref={tittel} tabIndex={-1} className="text-h2 outline-none">
              Hvem kan vi kontakte?
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <Felt navn="Navn" id="navn" feil={feil.navn} className="sm:col-span-2">
                <input id="navn" className="felt-inn" autoComplete="name" value={d.navn} onChange={(e) => sett({ navn: e.target.value })} aria-invalid={!!feil.navn} />
              </Felt>
              <Felt navn="E-post" id="epost" feil={feil.epost}>
                <input id="epost" type="email" className="felt-inn" autoComplete="email" value={d.epost} onChange={(e) => sett({ epost: e.target.value })} aria-invalid={!!feil.epost} />
              </Felt>
              <Felt navn="Telefon" id="telefon" feil={feil.telefon}>
                <input id="telefon" type="tel" className="felt-inn" autoComplete="tel" value={d.telefon} onChange={(e) => sett({ telefon: e.target.value })} aria-invalid={!!feil.telefon} />
              </Felt>
              <Felt navn="Melding (valgfritt)" id="melding" feil={feil.melding} className="sm:col-span-2">
                <textarea id="melding" className="felt-inn" maxLength={2000} value={d.melding} onChange={(e) => sett({ melding: e.target.value })} />
              </Felt>
              {/* Skjult for mennesker. Roboter fyller det ut, og blir stoppet på serveren. */}
              <input type="text" name="nettsted" tabIndex={-1} autoComplete="off" aria-hidden="true" className="sr-only" value={d.nettsted} onChange={(e) => sett({ nettsted: e.target.value })} />
            </div>
          </section>
        )}

        {steg === 4 && (
          <section>
            <h2 ref={tittel} tabIndex={-1} className="text-h2 outline-none">
              Stemmer dette?
            </h2>
            <dl className="mt-8 border-t border-ink/15">
              <Rad navn={d.datoer.length > 1 ? "Datoer" : "Dato"}>
                {d.datoer.map((dato) => (
                  <span key={dato} className="block first-letter:uppercase">
                    {formaterDato(dato)}
                  </span>
                ))}
                {d.tid && <span className="block text-stone">Start ca. kl. {d.tid}</span>}
              </Rad>
              <Rad navn="Arrangement">
                {typeNavn}, {d.gjester} gjester
              </Rad>
              <Rad navn="Tillegg">{valgteTillegg.length ? valgteTillegg.map((t) => t.name).join(", ") : "Ingen"}</Rad>
              <Rad navn="Kontakt">
                {d.navn}
                <span className="block text-stone">
                  {d.epost} · {d.telefon}
                </span>
              </Rad>
              {d.melding && <Rad navn="Melding">{d.melding}</Rad>}
              <Rad navn="Pris">Dere får et prisforslag fra oss når vi har sett på forespørselen.</Rad>
            </dl>
            <label className="valg mt-8">
              <input id="godtatt" type="checkbox" checked={d.godtatt} onChange={(e) => sett({ godtatt: e.target.checked })} aria-invalid={!!feil.godtatt} />
              <span>
                Jeg har lest{" "}
                <Link href="/praktisk" target="_blank" className="prose-link">
                  det praktiske
                </Link>
                , og forstår at dette er en forespørsel som må bekreftes av gården.
              </span>
            </label>
            {feil.godtatt && <p className="felt-feil">{feil.godtatt}</p>}
          </section>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-4">
          {steg < 4 ? (
            <button type="button" className="btn btn-primary" onClick={neste}>
              Videre
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={send} disabled={sender}>
              {sender ? "Sender …" : "Send forespørsel"}
            </button>
          )}
          {steg > 0 && (
            <button type="button" className="label link-draw" onClick={() => setSteg(steg - 1)} disabled={sender}>
              Tilbake
            </button>
          )}
        </div>
      </div>

      {/* Det som er valgt så langt. Bare på desktop; mobil får alt i oppsummeringen. */}
      <aside className="hidden lg:col-span-4 lg:col-start-9 lg:block" aria-label="Deres forespørsel">
        <div className="sticky top-28 border border-brass bg-parchment p-8">
          <p className="eyebrow">Deres forespørsel</p>
          <dl className="mt-6 space-y-5">
            <Kort navn="Dato">{d.datoer.length ? d.datoer.map(formaterDato).join(", ") : "Ikke valgt"}</Kort>
            <Kort navn="Arrangement">{typeNavn ?? "Ikke valgt"}</Kort>
            <Kort navn="Gjester">{d.gjester || "Ikke oppgitt"}</Kort>
            {valgteTillegg.length > 0 && <Kort navn="Tillegg">{valgteTillegg.map((t) => t.name).join(", ")}</Kort>}
          </dl>
          <p className="mt-8 border-t border-brass pt-5 text-small text-stone">
            Datoen holdes av i 48 timer når forespørselen er sendt. Prisforslag får dere av oss etterpå.
          </p>
        </div>
      </aside>
    </div>
  );
}

function Felt({ navn, id, feil, className = "", children }: { navn: string; id: string; feil?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="felt-navn">
        {navn}
      </label>
      {children}
      {feil && <p className="felt-feil">{feil}</p>}
    </div>
  );
}

function Rad({ navn, children }: { navn: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-x-6 gap-y-1 border-b border-ink/15 py-5 sm:grid-cols-[9rem_1fr]">
      <dt className="label pt-1.5 text-stone">{navn}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function Kort({ navn, children }: { navn: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="label text-stone">{navn}</dt>
      <dd className="mt-2 font-serif text-[1.375rem] leading-snug">{children}</dd>
    </div>
  );
}
