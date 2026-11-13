import type { StaticImageData } from "next/image";
import { finnBilde, kjentAlt } from "@/lib/bilder";
import { Photo } from "./Photo";

/**
 * Fast bildeplass. Ligger filen `fil` i public/images, vises den. Ellers vises
 * reservebildet, eller en tydelig plassholder som sier hvilket bilde som skal inn.
 */
export function Bildeplass({
  fil,
  motiv,
  reserve,
  ratio = "3/2",
  sizes,
  caption,
  parallax,
  className = "",
}: {
  fil: string;
  motiv: string;
  reserve?: { src: StaticImageData; alt: string };
  ratio?: string;
  sizes: string;
  caption?: string;
  parallax?: boolean;
  className?: string;
}) {
  const egen = finnBilde(fil);
  if (egen) return <Photo src={egen} alt={kjentAlt(fil) ?? motiv} {...{ ratio, sizes, caption, parallax, className }} />;
  if (reserve) return <Photo src={reserve.src} alt={reserve.alt} {...{ ratio, sizes, caption, parallax, className }} />;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 border border-brass bg-parchment p-6 text-center ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <p className="label leading-relaxed text-brass-dark">Foto: {motiv}</p>
      <p className="text-small text-stone">Lagres som {fil}.jpg</p>
    </div>
  );
}
