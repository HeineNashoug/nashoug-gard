/** Datoer håndteres som tekst på formen 2027-06-12, så tidssoner aldri flytter en dag. */

export const erDato = (s: unknown): s is string =>
  typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));

export const idag = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Oslo" }).format(new Date());

export function leggTil(dato: string, dager: number) {
  const d = new Date(dato + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + dager);
  return d.toISOString().slice(0, 10);
}

const lang = new Intl.DateTimeFormat("nb-NO", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** «lørdag 12. juni 2027» */
export const formaterDato = (dato: string) => lang.format(new Date(dato + "T00:00:00Z"));
