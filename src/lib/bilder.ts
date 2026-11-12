import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";

/**
 * Alle bilder ligger i public/images. Se BILDER.md for navneregler.
 * - Faste plasser: en fil med riktig navn (f.eks. kjokken.jpg) fyller plassen sin automatisk.
 * - Galleriet: viser alle bildene i mappen. Filnavn «kategori--beskrivelse.jpg» gir filter og bildetekst.
 */
const MAPPE = path.join(process.cwd(), "public/images");
const BILDEFIL = /\.(jpe?g|png|webp|avif)$/i;

export const kategorier: Record<string, string> = {
  lokalet: "Lokalet",
  garden: "Gården",
  bord: "Mat og bord",
  fest: "Fest",
  konfirmasjon: "Konfirmasjon",
  julebord: "Julebord",
  sommerfest: "Sommerfest",
  bursdag: "Bursdag",
  bryllup: "Bryllup og jubileum",
  firma: "Firmaarrangement",
};

// Bildene som lå her fra start, og som ikke følger navneregelen.
const kjente: Record<string, { kategori: string; alt: string }> = {
  langbord: {
    kategori: "bord",
    alt: "Langbord dekket til selskap i Potetbua, med tømmerbjelker i taket og grønne stoler.",
  },
  koldtbord: {
    kategori: "bord",
    alt: "Koldtbord med laks, salater og reker dekket på en gammel høvelbenk.",
  },
  "koldtbord-naert": {
    kategori: "bord",
    alt: "Fat med reker, laks og salater på en gammel arbeidsbenk.",
  },
  cognac: {
    kategori: "bord",
    alt: "To flasker cognac på en gammel arbeidsbenk, foran en krukke med havre.",
  },
  "hona-bar": {
    kategori: "lokalet",
    alt: "Høna Bar i Potetbua: bardisk av grovt treverk, levende lys og treskilt i taket.",
  },
  "middag-gjester": {
    kategori: "fest",
    alt: "Gjester til bords ved langbordene i Potetbua, under lyslenker og lykter.",
  },
  "dans-discolys": {
    kategori: "fest",
    alt: "To gjester danser i rosa discolys og røyk under tømmertaket.",
  },
  "inngang-kveld": {
    kategori: "fest",
    alt: "Inngangen til Potetbua en kveld, med åpen dør og lys fra festen innenfor.",
  },
  "hovedhuset-host": {
    kategori: "garden",
    alt: "Det hvite hovedhuset på Nashoug Gård en høstdag, med gult løv på trærne.",
  },
  "potetbua-utenfra": {
    kategori: "garden",
    alt: "Potetbua sett mellom trærne: rød bygning med hvit dør.",
  },
  "potetbua-inngang-flagg": {
    kategori: "garden",
    alt: "Inngangen til Potetbua, pyntet med bjørk og norske flagg.",
  },
};

/** Finner en fil i public/images uten å kjenne filtypen. Gir null hvis den ikke er lagt inn ennå. */
export function finnBilde(navn: string): string | null {
  const fil = fs
    .readdirSync(MAPPE)
    .find((f) => BILDEFIL.test(f) && f.replace(BILDEFIL, "") === navn);
  return fil ? `/images/${fil}` : null;
}

export type GalleriBilde = {
  src: string;
  alt: string;
  kategori: string | null;
  bredde: number;
  hoyde: number;
};

export function galleriBilder(): GalleriBilde[] {
  const filer = fs
    .readdirSync(MAPPE)
    .filter((f) => BILDEFIL.test(f))
    .sort();
  return filer.map((fil) => {
    const navn = fil.replace(BILDEFIL, "");
    const [forledd, beskrivelse] = navn.includes("--")
      ? navn.split("--")
      : [null, navn];
    const { width, height } = imageSize(fs.readFileSync(path.join(MAPPE, fil)));
    const tekst = beskrivelse.replaceAll("-", " ");
    return {
      src: `/images/${fil}`,
      alt: kjente[navn]?.alt ?? tekst.charAt(0).toUpperCase() + tekst.slice(1),
      kategori:
        kjente[navn]?.kategori ??
        (forledd && forledd in kategorier ? forledd : null),
      bredde: width,
      hoyde: height,
    };
  });
}
