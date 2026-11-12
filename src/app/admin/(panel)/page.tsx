import { Melding } from "@/components/admin/Melding";
import { hentBookinger, type Booking } from "@/lib/admin";
import { krevAdmin } from "@/lib/auth";
import { typer } from "@/lib/booking";
import { formaterDato, idag, leggTil } from "@/lib/dato";
import { avslaa, foreslaDato, godkjenn, kanseller } from "../actions";

const statusNavn = { foresporsel: "Forespørsel", godkjent: "Godkjent", avslatt: "Avslått", utlopt: "Utløpt", kansellert: "Kansellert" };
const tid = new Intl.DateTimeFormat("nb-NO", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Oslo" });

export default async function Foresporsler({ searchParams }: PageProps<"/admin">) {
  await krevAdmin();
  const [{ melding }, alle] = await Promise.all([searchParams, hentBookinger()]);
  const naa = idag();
  const kommer = (b: Booking) => b.dates.at(-1)! >= naa;
  const venter = alle.filter((b) => (b.status === "foresporsel" || b.status === "utlopt") && kommer(b));
  const godkjente = alle.filter((b) => b.status === "godkjent" && kommer(b));
  const resten = alle.filter((b) => !venter.includes(b) && !godkjente.includes(b)).reverse();

  return (
    <>
      <Melding tekst={melding} />
      <Liste tittel="Venter på svar" tom="Ingen forespørsler venter på svar." bookinger={venter} />
      <Liste tittel="Godkjente, kommende" tom="Ingen godkjente bookinger fram i tid." bookinger={godkjente} />
      <Liste tittel="Tidligere og avsluttede" tom="Ingenting her ennå." bookinger={resten} />
    </>
  );
}

function Liste({ tittel, tom, bookinger }: { tittel: string; tom: string; bookinger: Booking[] }) {
  return (
    <section className="mt-12">
      <h2 className="text-h2">
        {tittel} <span className="text-stone">({bookinger.length})</span>
      </h2>
      {bookinger.length ? (
        <ul className="mt-6 space-y-4">
          {bookinger.map((b) => (
            <Kort key={b.id} b={b} />
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-stone">{tom}</p>
      )}
    </section>
  );
}

function Kort({ b }: { b: Booking }) {
  const kanSvares = b.status === "foresporsel" || b.status === "utlopt";
  return (
    <li className="border border-ink/15 bg-paper p-5 lg:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h3 className="text-h3 first-letter:uppercase">{b.dates.map(formaterDato).join(" og ")}</h3>
        <p className={`label ${b.status === "foresporsel" ? "text-brass-dark" : b.status === "godkjent" ? "text-forest" : "text-barn"}`}>
          {statusNavn[b.status]} · {b.reference}
        </p>
      </div>
      <dl className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
        <Felt navn="Arrangement">
          {typer.find((t) => t.id === b.event_type)?.navn ?? b.event_type}, {b.guests} gjester
          {b.start_time && `, fra ca. kl. ${b.start_time}`}
        </Felt>
        <Felt navn="Kontakt">
          {b.name}
          <br />
          <a href={`tel:${b.phone}`} className="prose-link">
            {b.phone}
          </a>
          <br />
          <a href={`mailto:${b.email}`} className="prose-link break-all">
            {b.email}
          </a>
        </Felt>
        <Felt navn="Tillegg">{b.addons.length ? b.addons.join(", ") : "Ingen"}</Felt>
        <Felt navn={b.status === "foresporsel" ? "Holdes til" : "Mottatt"}>
          {tid.format(b.status === "foresporsel" ? b.hold_expires_at : b.created_at)}
          {b.price_offer && (
            <>
              <br />
              Pris: kr {b.price_offer.toLocaleString("nb-NO")}
            </>
          )}
        </Felt>
      </dl>
      {b.message && <p className="mt-5 max-w-[70ch] border-l border-brass pl-4 whitespace-pre-line">{b.message}</p>}
      {b.status === "utlopt" && (
        <p className="mt-5 text-small text-barn">Fristen på 48 timer er ute, og datoen er ledig for andre. Du kan fortsatt godkjenne hvis den ikke er tatt.</p>
      )}

      {kanSvares && (
        <div className="mt-6 grid items-start gap-3 lg:grid-cols-3">
          <Handling tittel="Godkjenn" action={godkjenn} id={b.id} knapp="Godkjenn og send e-post">
            <label className="block">
              <span className="felt-navn">Pris i kroner (valgfritt)</span>
              <input name="pris" inputMode="numeric" className="felt-inn" />
            </label>
          </Handling>
          <Handling tittel="Foreslå ny dato" action={foreslaDato} id={b.id} knapp="Flytt og send e-post">
            <label className="block">
              <span className="felt-navn">Ny dato</span>
              <input name="dato" type="date" required min={leggTil(idag(), 1)} className="felt-inn" />
            </label>
          </Handling>
          <Handling tittel="Avslå" action={avslaa} id={b.id} knapp="Avslå og send e-post" />
        </div>
      )}
      {b.status === "godkjent" && (
        <div className="mt-6 max-w-md">
          <Handling tittel="Kanseller bookingen" action={kanseller} id={b.id} knapp="Kanseller og frigi datoen" utenMelding />
        </div>
      )}
    </li>
  );
}

function Felt({ navn, children }: { navn: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="label text-stone">{navn}</dt>
      <dd className="mt-2">{children}</dd>
    </div>
  );
}

/** Utbrettbart skjema, så ingen handling skjer med ett feilklikk. */
function Handling({
  tittel,
  action,
  id,
  knapp,
  utenMelding,
  children,
}: {
  tittel: string;
  action: (f: FormData) => Promise<void>;
  id: string;
  knapp: string;
  utenMelding?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <details className="border border-ink/15 bg-cream">
      <summary className="label flex min-h-12 cursor-pointer items-center px-4">{tittel}</summary>
      <form action={action} className="space-y-4 border-t border-ink/15 p-4">
        <input type="hidden" name="id" value={id} />
        {children}
        {!utenMelding && (
          <label className="block">
            <span className="felt-navn">Melding til kunden (valgfritt)</span>
            <textarea name="melding" className="felt-inn" />
          </label>
        )}
        <button className="btn btn-primary btn-small w-full whitespace-normal">{knapp}</button>
      </form>
    </details>
  );
}
