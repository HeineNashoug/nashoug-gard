"use client";

import { site } from "@/lib/site";

/** Vises når en side feiler på serveren, f.eks. hvis databasen ikke svarer. Meny og bunn blir stående. */
export default function Feil({ retry }: { error: unknown; retry: () => void }) {
  return (
    <section className="wrap py-section">
      <p className="eyebrow">Noe gikk galt</p>
      <h1 className="mt-5 max-w-[18ch] text-h1">Siden lot seg ikke åpne</h1>
      <p className="mt-6 max-w-[46ch]">
        Feilen ligger hos oss. Prøv igjen om litt, eller ring Håkon på{" "}
        <a href={site.phoneHref} className="prose-link whitespace-nowrap">
          {site.phone}
        </a>
        , så ordner vi bookingen på telefon.
      </p>
      <button type="button" className="btn btn-primary mt-8" onClick={() => retry()}>
        Prøv igjen
      </button>
    </section>
  );
}
