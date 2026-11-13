import { site } from "@/lib/site";

const adresse = `${site.street}, ${site.postal}`;

/** Kart fra Google Maps over gården. Lastes først når det kommer nær skjermen. */
export function Kart() {
  return (
    <div className="relative aspect-[4/3] border border-brass bg-parchment">
      <iframe
        title={`Kart over ${adresse}`}
        src={`https://www.google.com/maps?q=${encodeURIComponent(adresse)}&output=embed`}
        className="absolute inset-0 size-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
