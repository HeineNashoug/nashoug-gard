import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { BookingFlyt } from "@/components/BookingFlyt";
import { hentLedighet, hentTillegg, typer } from "@/lib/booking";

export const metadata: Metadata = {
  alternates: { canonical: "/book" },
  title: "Book Potetbua – se ledige datoer",
  description:
    "Se ledige datoer for Potetbua på Nashoug Gård ved Hamar, og send en forespørsel på et par minutter. Datoen holdes av i 48 timer.",
};

export default function Book({ searchParams }: PageProps<"/book">) {
  return (
    <>
      <header className="wrap pt-14 pb-10 lg:pt-20 lg:pb-14">
        <p className="eyebrow">Book Potetbua</p>
        <h1 className="mt-5 max-w-[16ch] text-h1">Finn en ledig dato</h1>
        <p className="mt-6 max-w-[40ch] font-serif text-lede">
          Velg dato, fortell hva dere planlegger, og send forespørselen. Det tar et par minutter.
        </p>
      </header>
      {/* Fast minstehøyde, så bunnen av siden ikke hopper når kalenderen kommer inn. */}
      <div className="wrap min-h-[62rem] pb-section lg:min-h-[54rem]">
        <Suspense fallback={<p className="text-stone">Henter kalenderen …</p>}>
          <Flyt searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}

async function Flyt({ searchParams }: Pick<PageProps<"/book">, "searchParams">) {
  await connection(); // ledighet og tillegg leses ferskt fra databasen ved hver visning
  const [{ type }, tillegg, ledighet] = await Promise.all([searchParams, hentTillegg(), hentLedighet()]);
  return (
    <BookingFlyt
      startLedighet={ledighet}
      tillegg={tillegg.map(({ id, name, description }) => ({ id, name, description }))}
      typer={typer}
      startType={typer.some((t) => t.id === type) ? (type as string) : ""}
    />
  );
}
