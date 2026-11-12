"use client";

import { useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import * as m from "motion/react-m";
import { useScroll, useTransform } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Bilde som avdekkes med maske når det kommer inn i bildet, og zoomer litt ved hover.
 * Ingen filter eller fargeslør. `parallax` flytter hele rammen, så bildet ikke
 * må forstørres.
 */
export function Photo({
  src,
  alt,
  sizes,
  caption,
  ratio = "3/2",
  position,
  parallax = false,
  forst = false,
  className = "",
}: {
  src: StaticImageData | string;
  alt: string;
  sizes: string;
  caption?: string;
  ratio?: string;
  position?: string;
  parallax?: boolean;
  /** Øverste bilde på siden: vises med en gang, uten maske, og lastes først. */
  forst?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);

  return (
    <m.figure ref={ref} className={className} style={parallax ? { y } : undefined}>
      <m.div
        data-reveal
        className="group relative overflow-hidden bg-parchment"
        style={{ aspectRatio: ratio }}
        initial={forst ? false : { clipPath: "inset(0 0 100% 0)" }}
        whileInView={{ clipPath: "inset(0 0 0% 0)" }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 1.2, ease }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading={forst ? "eager" : "lazy"}
          fetchPriority={forst ? "high" : "auto"}
          placeholder={typeof src === "string" ? "empty" : "blur"}
          className="object-cover transition-transform duration-[900ms] ease-lux group-hover:scale-[1.04]"
          style={{ objectPosition: position }}
        />
      </m.div>
      {caption && <figcaption className="mt-3 text-small text-stone italic">{caption}</figcaption>}
    </m.figure>
  );
}
