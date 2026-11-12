import { arrangementer } from "./arrangementer";
import { erDato, idag, leggTil } from "./dato";
import { sql } from "./db";

export const HOLD_TIMER = 48;
export const MAKS_DATOER = 3;
export const MAKS_GJESTER = 60;
export const MAKS_MND_FRAM = 24;

export const typer = [...arrangementer.map((a) => ({ id: a.slug as string, navn: a.navn as string })), { id: "annet", navn: "Annet" }];

export type Ledighet = Record<string, "reservert" | "opptatt">;
export type Tillegg = { id: string; name: string; description: string };

/** Datoer som ikke kan velges. Alt som ikke er med her, er ledig. */
export async function hentLedighet(): Promise<Ledighet> {
  const rader = await sql<{ date: string; status: "reservert" | "opptatt" }[]>`
    select to_char(d.date, 'YYYY-MM-DD') as date,
           case when b.status = 'foresporsel' then 'reservert' else 'opptatt' end as status
    from booking_dates d
    left join bookings b on b.id = d.booking_id
    where d.date >= current_date
      and (b.id is null or b.status = 'godkjent' or (b.status = 'foresporsel' and b.hold_expires_at > now()))`;
  return Object.fromEntries(rader.map((r) => [r.date, r.status]));
}

export const hentTillegg = () =>
  sql<Tillegg[]>`select id, name, description from addons where active order by sort, name`;

export type Foresporsel = {
  datoer: string[];
  tid: string;
  type: string;
  gjester: number;
  tillegg: string[];
  navn: string;
  epost: string;
  telefon: string;
  melding: string;
};

/** Sjekker alt på serveren. Gir feilmelding per felt, eller null hvis alt er i orden. */
export function valider(f: Foresporsel): Record<string, string> | null {
  const feil: Record<string, string> = {};
  const forst = leggTil(idag(), 1);
  const sist = leggTil(idag(), MAKS_MND_FRAM * 31);

  if (
    !Array.isArray(f.datoer) ||
    f.datoer.length < 1 ||
    f.datoer.length > MAKS_DATOER ||
    new Set(f.datoer).size !== f.datoer.length ||
    !f.datoer.every((d) => erDato(d) && d >= forst && d <= sist)
  )
    feil.datoer = "Velg mellom én og tre datoer fram i tid.";
  if (f.tid && !/^\d{2}:\d{2}$/.test(f.tid)) feil.tid = "Skriv klokkeslettet som 18:00.";
  if (!typer.some((t) => t.id === f.type)) feil.type = "Velg type arrangement.";
  if (!Number.isInteger(f.gjester) || f.gjester < 1 || f.gjester > MAKS_GJESTER)
    feil.gjester = `Skriv et antall mellom 1 og ${MAKS_GJESTER}.`;
  if (typeof f.navn !== "string" || f.navn.trim().length < 2 || f.navn.length > 120) feil.navn = "Skriv navnet ditt.";
  if (typeof f.epost !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.epost) || f.epost.length > 200)
    feil.epost = "Skriv en gyldig e-postadresse.";
  if (typeof f.telefon !== "string" || f.telefon.replace(/\D/g, "").length < 8 || f.telefon.length > 30)
    feil.telefon = "Skriv et telefonnummer med minst åtte siffer.";
  if (typeof f.melding !== "string" || f.melding.length > 2000) feil.melding = "Meldingen kan være på inntil 2000 tegn.";
  if (!Array.isArray(f.tillegg) || f.tillegg.length > 20) feil.tillegg = "Ugyldig valg av tillegg.";

  return Object.keys(feil).length ? feil : null;
}

const TEGN = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // uten 0/O og 1/I
const nyReferanse = () =>
  "NG-" + Array.from(crypto.getRandomValues(new Uint8Array(5)), (b) => TEGN[b % TEGN.length]).join("");

export type Lagret = Foresporsel & { referanse: string; tilleggNavn: string[] };

/**
 * Lagrer forespørselen og holder av datoene i én transaksjon.
 * Er en dato allerede tatt, stopper databasen det (primærnøkkel på dato), og vi gir `null`.
 */
export async function lagreForesporsel(f: Foresporsel): Promise<Lagret | null> {
  const referanse = nyReferanse();
  try {
    return await sql.begin(async (tx) => {
      // Frigi datoer der fristen har gått ut, før vi prøver å holde av nye.
      await tx`update bookings set status = 'utlopt', updated_at = now()
               where status = 'foresporsel' and hold_expires_at <= now()`;
      await tx`delete from booking_dates d using bookings b
               where d.booking_id = b.id and b.status = 'utlopt'`;

      const valgte = f.tillegg.length
        ? await tx<{ name: string }[]>`select name from addons where active and id::text in ${tx(f.tillegg)} order by sort`
        : [];
      const tilleggNavn = valgte.map((t) => t.name);

      const [b] = await tx<{ id: string }[]>`
        insert into bookings (reference, event_type, dates, guests, start_time, name, email, phone, message, addons, hold_expires_at)
        values (${referanse}, ${f.type}, ${f.datoer}::date[], ${f.gjester}, ${f.tid || null}, ${f.navn.trim()}, ${f.epost.trim()},
                ${f.telefon.trim()}, ${f.melding.trim()}, ${tx.json(tilleggNavn)}, now() + make_interval(hours => ${HOLD_TIMER}))
        returning id`;
      await tx`insert into booking_dates ${tx(f.datoer.map((date) => ({ date, booking_id: b.id })))}`;

      return { ...f, referanse, tilleggNavn };
    });
  } catch (e) {
    if ((e as { code?: string }).code === "23505") return null; // unique_violation: datoen er tatt
    throw e;
  }
}
