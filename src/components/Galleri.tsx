"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { GalleriBilde } from "@/lib/bilder";

/** Murverksgalleri med filter og lysboks. Piltastene blar, Esc lukker. */
export function Galleri({ bilder, filtre }: { bilder: GalleriBilde[]; filtre: { id: string; navn: string }[] }) {
  const [filter, setFilter] = useState<string | null>(null);
  const [aapen, setAapen] = useState<number | null>(null);
  const lysboks = useRef<HTMLDialogElement>(null);

  const synlige = filter ? bilder.filter((b) => b.kategori === filter) : bilder;
  const bla = (d: number) => setAapen((n) => (n === null ? n : (n + d + synlige.length) % synlige.length));
  const valgt = aapen === null ? null : synlige[aapen];

  return (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer bildene">
        {[{ id: null, navn: "Alle" }, ...filtre].map((f) => (
          <button
            key={f.navn}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className="label min-h-11 rounded-[2px] border border-forest px-4 text-forest transition-colors duration-[600ms] ease-lux hover:bg-forest hover:text-cream aria-pressed:bg-forest aria-pressed:text-cream"
          >
            {f.navn}
          </button>
        ))}
      </div>

      <ul className="mt-10 columns-2 gap-3 lg:columns-3 lg:gap-6">
        {synlige.map((b, n) => (
          <li key={b.src} className="mb-3 break-inside-avoid lg:mb-6">
            <button
              type="button"
              className="group block w-full overflow-hidden bg-parchment"
              aria-label={`Vis større: ${b.alt}`}
              onClick={() => {
                setAapen(n);
                lysboks.current?.showModal();
              }}
            >
              <Image
                src={b.src}
                alt={b.alt}
                width={b.bredde}
                height={b.hoyde}
                sizes="(min-width: 1024px) 33vw, 50vw"
                loading={n < 4 ? "eager" : "lazy"}
                className="h-auto w-full transition-transform duration-[900ms] ease-lux group-hover:scale-[1.04]"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={lysboks}
        className="lysboks on-dark"
        aria-label="Bildevisning"
        data-lenis-prevent
        onClose={() => setAapen(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") bla(1);
          if (e.key === "ArrowLeft") bla(-1);
        }}
      >
        {valgt && (
          <div className="flex h-full flex-col p-4 lg:p-8">
            <div className="flex items-center justify-between">
              <p className="label text-brass-light">
                {aapen! + 1} / {synlige.length}
              </p>
              <button type="button" className="label min-h-11 px-3" onClick={() => lysboks.current?.close()}>
                Lukk
              </button>
            </div>
            <div className="relative my-4 flex-1">
              <Image key={valgt.src} src={valgt.src} alt={valgt.alt} fill sizes="100vw" quality={90} className="object-contain" />
            </div>
            <div className="flex items-center justify-between gap-4">
              <button type="button" className="label min-h-11 px-3" onClick={() => bla(-1)}>
                Forrige
              </button>
              <p className="text-center text-small text-cream/85">{valgt.alt}</p>
              <button type="button" className="label min-h-11 px-3" onClick={() => bla(1)}>
                Neste
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
