"use client";

import { useState } from "react";
import { site } from "@/lib/site";

const adresse = `${site.street}, ${site.postal}`;
const sok = encodeURIComponent(adresse);

/** Kartet lastes først når besøkende ber om det, så Google ikke får data fra alle som åpner siden. */
export function Kart() {
  const [vis, setVis] = useState(false);

  return (
    <div className="relative aspect-[4/3] border border-brass bg-parchment">
      {vis ? (
        <iframe
          title={`Kart over ${adresse}`}
          src={`https://www.google.com/maps?q=${sok}&output=embed`}
          className="absolute inset-0 size-full"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center">
          <p className="font-serif text-h3">{adresse}</p>
          <button type="button" className="btn btn-secondary" onClick={() => setVis(true)}>
            Vis kart
          </button>
          <p className="text-small text-stone">Kartet hentes fra Google Maps.</p>
        </div>
      )}
    </div>
  );
}
