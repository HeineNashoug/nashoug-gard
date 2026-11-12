"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { arrangementer } from "@/lib/arrangementer";
import cognac from "../../public/images/cognac.jpg";
import koldtbord from "../../public/images/koldtbord.jpg";
import langbord from "../../public/images/langbord.jpg";
import middag from "../../public/images/middag-gjester.jpg";
import flagg from "../../public/images/potetbua-inngang-flagg.jpg";
import utenfra from "../../public/images/potetbua-utenfra.jpg";

// Samme rekkefølge som i lib/arrangementer.ts
const bilder = [flagg, middag, utenfra, cognac, langbord, koldtbord];

/** Nummerert liste. På desktop bytter bildet til høyre når en rad får hover eller fokus. */
export function ArrangementListe() {
  const [aktiv, setAktiv] = useState(0);

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <ol className="border-t border-ink/15 lg:col-span-7">
        {arrangementer.map((a, n) => (
          <li key={a.slug} className="border-b border-ink/15">
            <Link
              href={`/arrangementer#${a.slug}`}
              className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 py-6 lg:grid-cols-[4rem_1fr] lg:py-8"
              onMouseEnter={() => setAktiv(n)}
              onFocus={() => setAktiv(n)}
            >
              <span className="font-serif text-h3 text-brass-dark">{String(n + 1).padStart(2, "0")}</span>
              <span className="transition-transform duration-[600ms] ease-lux group-hover:translate-x-3">
                <span className="block font-serif text-[clamp(1.875rem,4vw,3rem)] leading-[1.1]">{a.navn}</span>
                <span className="mt-2 block text-stone">{a.kort}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <div className="hidden lg:col-span-4 lg:col-start-9 lg:block" aria-hidden="true">
        <div className="sticky top-28 aspect-[4/5] overflow-hidden bg-parchment">
          {bilder.map((src, n) => (
            <Image
              key={n}
              src={src}
              alt=""
              fill
              sizes="(min-width: 1024px) 30vw, 1px"
              className={`object-cover transition-opacity duration-[900ms] ease-lux ${n === aktiv ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
