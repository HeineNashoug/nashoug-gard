import Link from "next/link";
import { Melding } from "@/components/admin/Melding";
import { hentDager } from "@/lib/admin";
import { krevAdmin } from "@/lib/auth";
import { formaterDato, idag, leggTil } from "@/lib/dato";
import { fjernSperre, sperr } from "../../actions";

const mndNavn = new Intl.DateTimeFormat("nb-NO", { month: "long", year: "numeric", timeZone: "UTC" });
const flytt = (mnd: string, n: number) => {
  const d = new Date(mnd + "-01T00:00:00Z");
  d.setUTCMonth(d.getUTCMonth() + n);
  return d.toISOString().slice(0, 7);
};

export default async function AdminKalender({ searchParams }: PageProps<"/admin/kalender">) {
  await krevAdmin();
  const sp = await searchParams;
  const mnd = typeof sp.mnd === "string" && /^\d{4}-\d{2}$/.test(sp.mnd) ? sp.mnd : idag().slice(0, 7);
  const forste = mnd + "-01";
  const antall = new Date(Date.UTC(+mnd.slice(0, 4), +mnd.slice(5), 0)).getUTCDate();
  const dager = await hentDager(forste, leggTil(forste, antall - 1));
  const opptatt = new Map(dager.map((d) => [d.date, d]));
  const tomme = (new Date(forste + "T00:00:00Z").getUTCDay() + 6) % 7;

  return (
    <>
      <Melding tekst={sp.melding} />
      <div className="mt-10 flex items-center justify-between gap-4">
        <Link href={`/admin/kalender?mnd=${flytt(mnd, -1)}`} prefetch={false} className="label link-draw">
          Forrige
        </Link>
        <h1 className="text-h2 first-letter:uppercase">{mndNavn.format(new Date(forste + "T00:00:00Z"))}</h1>
        <Link href={`/admin/kalender?mnd=${flytt(mnd, 1)}`} prefetch={false} className="label link-draw">
          Neste
        </Link>
      </div>

      <ol className="mt-6 grid grid-cols-1 gap-1 sm:grid-cols-7">
        {Array.from({ length: tomme }, (_, n) => (
          <li key={`t${n}`} className="hidden sm:block" />
        ))}
        {Array.from({ length: antall }, (_, n) => {
          const dato = `${mnd}-${String(n + 1).padStart(2, "0")}`;
          const d = opptatt.get(dato);
          const farge = !d ? "bg-paper" : d.status === "foresporsel" ? "bg-brass-light/40" : "bg-parchment";
          return (
            <li key={dato} className={`min-h-20 border border-ink/15 p-2 text-small ${farge} ${d ? "" : "max-sm:hidden"}`}>
              <p className="font-medium">
                <span className="sm:hidden">{formaterDato(dato)}</span>
                <span className="max-sm:hidden">{n + 1}</span>
              </p>
              {d?.reference && (
                <p className="mt-1 break-words">
                  {d.name}
                  <span className="block text-stone">{d.status === "foresporsel" ? "Reservert" : "Godkjent"}</span>
                </p>
              )}
              {d && !d.reference && (
                <form action={fjernSperre} className="mt-1">
                  <input type="hidden" name="dato" value={dato} />
                  <p className="break-words text-barn">{d.blocked_reason}</p>
                  <button className="prose-link mt-1">Fjern sperre</button>
                </form>
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-small text-stone sm:hidden">På mobil vises bare dagene som er opptatt.</p>

      <section className="mt-12 max-w-md">
        <h2 className="text-h3">Sperr en dato</h2>
        <p className="mt-2 text-stone">Til egne arrangementer eller vedlikehold. Datoen vises som opptatt på nettsiden.</p>
        <form action={sperr} className="mt-6 space-y-4">
          <label className="block">
            <span className="felt-navn">Dato</span>
            <input name="dato" type="date" required min={idag()} className="felt-inn" />
          </label>
          <label className="block">
            <span className="felt-navn">Grunn (vises bare her)</span>
            <input name="grunn" className="felt-inn" maxLength={80} />
          </label>
          <button className="btn btn-primary">Sperr datoen</button>
        </form>
      </section>

      <section className="mt-12 max-w-[60ch]">
        <h2 className="text-h3">Abonner i Google Kalender eller på telefonen</h2>
        <p className="mt-2 text-stone">
          Legg til denne adressen som kalenderabonnement, så dukker godkjente bookinger og reservasjoner opp i din egen
          kalender. Adressen er hemmelig. Del den ikke.
        </p>
        <p className="mt-4 border border-ink/15 bg-paper p-3 font-mono text-small break-all">
          /api/kalender?token={process.env.ICAL_TOKEN}
        </p>
      </section>
    </>
  );
}
