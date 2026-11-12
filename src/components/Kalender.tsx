"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Ledighet } from "@/lib/booking";
import { formaterDato, leggTil } from "@/lib/dato";

const UKEDAGER = [
  ["Ma", "mandag"],
  ["Ti", "tirsdag"],
  ["On", "onsdag"],
  ["To", "torsdag"],
  ["Fr", "fredag"],
  ["Lø", "lørdag"],
  ["Sø", "søndag"],
];
const TEKST = { ledig: "ledig", valgt: "valgt", reservert: "reservert, kan ikke velges", opptatt: "opptatt", utenfor: "kan ikke velges" };
const mndNavn = new Intl.DateTimeFormat("nb-NO", { month: "long", year: "numeric", timeZone: "UTC" });

const utc = (dato: string) => new Date(dato + "T00:00:00Z");
const iso = (d: Date) => d.toISOString().slice(0, 10);

/** Flytter en dato et antall måneder, og holder seg på samme dag i måneden når den finnes. */
function leggTilMnd(dato: string, n: number) {
  const d = utc(dato);
  const dagIMnd = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + n);
  const sisteDag = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  d.setUTCDate(Math.min(dagIMnd, sisteDag));
  return iso(d);
}

/**
 * Månedskalender. Piltastene flytter mellom dager, Page Up og Page Down bytter måned,
 * Home og End går til start og slutt av uka, Enter eller mellomrom velger.
 */
export function Kalender({
  ledighet,
  valgt,
  onVelg,
  forst,
  sist,
}: {
  ledighet: Ledighet;
  valgt: string[];
  onVelg: (dato: string) => void;
  forst: string;
  sist: string;
}) {
  const [fokus, setFokus] = useState(valgt[0] ?? forst);
  const flyttFokus = useRef(false);
  const tabell = useRef<HTMLTableElement>(null);
  const tittelId = useId();

  useEffect(() => {
    if (!flyttFokus.current) return;
    flyttFokus.current = false;
    tabell.current?.querySelector<HTMLElement>(`[data-dato="${fokus}"]`)?.focus();
  }, [fokus]);

  const gaTil = (dato: string, medFokus: boolean) => {
    flyttFokus.current = medFokus;
    setFokus(dato < forst ? forst : dato > sist ? sist : dato);
  };

  const mnd = fokus.slice(0, 7);
  const forsteIMnd = utc(mnd + "-01");
  const tomme = (forsteIMnd.getUTCDay() + 6) % 7; // mandag først
  const antall = new Date(Date.UTC(forsteIMnd.getUTCFullYear(), forsteIMnd.getUTCMonth() + 1, 0)).getUTCDate();
  const ruter: (string | null)[] = [
    ...Array<null>(tomme).fill(null),
    ...Array.from({ length: antall }, (_, n) => `${mnd}-${String(n + 1).padStart(2, "0")}`),
  ];
  while (ruter.length % 7) ruter.push(null);
  const uker = Array.from({ length: ruter.length / 7 }, (_, u) => ruter.slice(u * 7, u * 7 + 7));

  const statusFor = (d: string): "ledig" | "reservert" | "opptatt" | "utenfor" =>
    d < forst || d > sist ? "utenfor" : d in ledighet ? ledighet[d] : "ledig";

  const tast = (e: React.KeyboardEvent) => {
    const ukedag = (utc(fokus).getUTCDay() + 6) % 7;
    const ny: Record<string, string> = {
      ArrowLeft: leggTil(fokus, -1),
      ArrowRight: leggTil(fokus, 1),
      ArrowUp: leggTil(fokus, -7),
      ArrowDown: leggTil(fokus, 7),
      Home: leggTil(fokus, -ukedag),
      End: leggTil(fokus, 6 - ukedag),
      PageUp: leggTilMnd(fokus, -1),
      PageDown: leggTilMnd(fokus, 1),
    };
    if (!(e.key in ny)) return;
    e.preventDefault();
    gaTil(ny[e.key], true);
  };

  return (
    <div className="border border-ink/15 bg-paper p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <button
          type="button"
          className="label min-h-11 px-2 disabled:opacity-30"
          aria-label="Forrige måned"
          disabled={mnd <= forst.slice(0, 7)}
          onClick={() => gaTil(leggTilMnd(mnd + "-01", -1), false)}
        >
          Forrige
        </button>
        <h3 id={tittelId} className="font-serif text-[1.5rem] leading-none whitespace-nowrap first-letter:uppercase sm:text-[1.875rem]" aria-live="polite">
          {mndNavn.format(forsteIMnd)}
        </h3>
        <button
          type="button"
          className="label min-h-11 px-2 disabled:opacity-30"
          aria-label="Neste måned"
          disabled={mnd >= sist.slice(0, 7)}
          onClick={() => gaTil(leggTilMnd(mnd + "-01", 1), false)}
        >
          Neste
        </button>
      </div>

      <table ref={tabell} role="grid" aria-labelledby={tittelId} className="w-full table-fixed border-separate border-spacing-1" onKeyDown={tast}>
        <thead>
          <tr>
            {UKEDAGER.map(([kort, langt]) => (
              <th key={kort} scope="col" abbr={langt} className="label pb-2 text-[0.6875rem] tracking-[0.14em] text-stone">
                {kort}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {uker.map((uke, u) => (
            <tr key={u}>
              {uke.map((d, n) => {
                if (!d) return <td key={n} />;
                const status = statusFor(d);
                const erValgt = valgt.includes(d);
                return (
                  <td key={n} className="p-0">
                    <button
                      type="button"
                      className="dag"
                      data-dato={d}
                      data-status={status}
                      tabIndex={d === fokus ? 0 : -1}
                      aria-pressed={erValgt}
                      aria-disabled={status !== "ledig"}
                      aria-label={`${formaterDato(d)}, ${TEKST[erValgt ? "valgt" : status]}`}
                      onClick={() => {
                        setFokus(d);
                        if (status === "ledig") onVelg(d);
                      }}
                    >
                      {Number(d.slice(8))}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-small text-stone" aria-label="Tegnforklaring">
        <li className="flex items-center gap-2">
          <span className="dag !min-h-0 !w-4" data-status="ledig" /> Ledig
        </li>
        <li className="flex items-center gap-2">
          <span className="dag !min-h-0 !w-4" data-status="valgt" /> Valgt
        </li>
        <li className="flex items-center gap-2">
          <span className="dag !min-h-0 !w-4" data-status="reservert" /> Reservert
        </li>
        <li className="flex items-center gap-2">
          <span className="dag !min-h-0 !w-4" data-status="opptatt" /> <s className="decoration-barn">Opptatt</s>
        </li>
      </ul>
    </div>
  );
}
