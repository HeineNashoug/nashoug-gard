import Link from "next/link";
import { site } from "@/lib/site";
import { Blomst } from "./Ornament";
import { Reveal } from "./Reveal";

/** Avslutning nederst på sidene. */
export function BookCta() {
  return (
    <section className="bg-parchment">
      <Reveal className="wrap flex flex-col items-center py-section text-center">
        <Blomst className="size-8 text-brass-dark" />
        <h2 className="mt-6 max-w-[18ch] text-h1">Se om datoen deres er ledig</h2>
        <p className="mt-6 max-w-[44ch]">
          Kalenderen er oppdatert til enhver tid. Vil du heller ta det på telefon, ringer du Håkon på{" "}
          <a href={site.phoneHref} className="prose-link whitespace-nowrap">
            {site.phone}
          </a>
          .
        </p>
        <Link href="/book" className="btn btn-primary mt-8">
          Se ledige datoer
        </Link>
      </Reveal>
    </section>
  );
}
