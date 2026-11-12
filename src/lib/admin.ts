import { HOLD_TIMER } from "./booking";
import { sql } from "./db";

export type Booking = {
  id: string;
  reference: string;
  status: "foresporsel" | "godkjent" | "avslatt" | "utlopt" | "kansellert";
  event_type: string;
  dates: string[];
  guests: number;
  start_time: string | null;
  name: string;
  email: string;
  phone: string;
  message: string;
  addons: string[];
  price_offer: number | null;
  admin_note: string;
  hold_expires_at: Date;
  created_at: Date;
};

const felt = sql`id, reference, status, event_type, guests, to_char(start_time, 'HH24:MI') as start_time, name, email, phone,
  message, addons, price_offer, admin_note, hold_expires_at, created_at,
  array(select to_char(x, 'YYYY-MM-DD') from unnest(dates) x order by x) as dates`;

/** Merker forespørsler der fristen har gått ut, og frigir datoene deres. */
async function ryddUtlopte(tx: typeof sql = sql) {
  await tx`update bookings set status = 'utlopt', updated_at = now() where status = 'foresporsel' and hold_expires_at <= now()`;
  await tx`delete from booking_dates d using bookings b where d.booking_id = b.id and b.status = 'utlopt'`;
}

export async function hentBookinger() {
  await ryddUtlopte();
  return sql<Booking[]>`select ${felt} from bookings order by dates[1], created_at`;
}

export const hentBooking = async (id: string) => (await sql<Booking[]>`select ${felt} from bookings where id = ${id}`)[0];

export type Dag = { date: string; reference: string | null; name: string | null; status: string | null; blocked_reason: string | null };

export async function hentDager(fra: string, til: string) {
  await ryddUtlopte();
  return sql<Dag[]>`
    select to_char(d.date, 'YYYY-MM-DD') as date, b.reference, b.name, b.status::text, d.blocked_reason
    from booking_dates d left join bookings b on b.id = d.booking_id
    where d.date between ${fra} and ${til} order by d.date`;
}

const erTatt = (e: unknown) => (e as { code?: string }).code === "23505";

/**
 * Godkjenner en forespørsel. Er fristen ute, holdes datoene av på nytt først.
 * Gir false hvis en av datoene er tatt av noen andre i mellomtiden.
 */
export async function godkjenn(id: string, pris: number | null) {
  try {
    await sql.begin(async (tx) => {
      await ryddUtlopte(tx as unknown as typeof sql);
      const [b] = await tx<{ dates: string[] }[]>`
        update bookings set status = 'godkjent', price_offer = ${pris}, updated_at = now()
        where id = ${id} and status in ('foresporsel', 'utlopt')
        returning array(select to_char(x, 'YYYY-MM-DD') from unnest(dates) x) as dates`;
      if (!b) throw new Error("Forespørselen kan ikke godkjennes.");
      await tx`insert into booking_dates ${tx(b.dates.map((date) => ({ date, booking_id: id })))}
               on conflict (date) do update set booking_id = excluded.booking_id
               where booking_dates.booking_id = excluded.booking_id`;
      const [{ n }] = await tx<{ n: number }[]>`select count(*)::int as n from booking_dates where booking_id = ${id}`;
      if (n !== b.dates.length) throw Object.assign(new Error("tatt"), { code: "23505" });
    });
    return true;
  } catch (e) {
    if (erTatt(e)) return false;
    throw e;
  }
}

/** Avslår eller kansellerer, og frigir datoene. */
export async function avslutt(id: string, status: "avslatt" | "kansellert") {
  await sql.begin(async (tx) => {
    await tx`update bookings set status = ${status}, updated_at = now() where id = ${id}`;
    await tx`delete from booking_dates where booking_id = ${id}`;
  });
}

/** Flytter forespørselen til en ny dato og holder den av i 48 nye timer. Gir false hvis datoen er tatt. */
export async function flyttDato(id: string, dato: string) {
  try {
    await sql.begin(async (tx) => {
      await ryddUtlopte(tx as unknown as typeof sql);
      await tx`delete from booking_dates where booking_id = ${id}`;
      await tx`update bookings set dates = array[${dato}::date], status = 'foresporsel',
               hold_expires_at = now() + make_interval(hours => ${HOLD_TIMER}), updated_at = now() where id = ${id}`;
      await tx`insert into booking_dates (date, booking_id) values (${dato}, ${id})`;
    });
    return true;
  } catch (e) {
    if (erTatt(e)) return false;
    throw e;
  }
}

/** Sperrer en dato manuelt. Gir false hvis datoen allerede er opptatt. */
export async function sperr(dato: string, grunn: string) {
  await ryddUtlopte();
  const r = await sql`insert into booking_dates (date, blocked_reason) values (${dato}, ${grunn}) on conflict do nothing`;
  return r.count === 1;
}

export const fjernSperre = (dato: string) => sql`delete from booking_dates where date = ${dato} and booking_id is null`;

export type TilleggRad = { id: string; name: string; description: string; price: number | null; active: boolean; sort: number };
export const hentAlleTillegg = () => sql<TilleggRad[]>`select * from addons order by sort, name`;

export async function lagreTillegg(t: Omit<TilleggRad, "id"> & { id?: string }) {
  if (t.id)
    await sql`update addons set name = ${t.name}, description = ${t.description}, price = ${t.price}, active = ${t.active}, sort = ${t.sort} where id = ${t.id}`;
  else await sql`insert into addons (name, description, price, active, sort) values (${t.name}, ${t.description}, ${t.price}, ${t.active}, ${t.sort})`;
}
