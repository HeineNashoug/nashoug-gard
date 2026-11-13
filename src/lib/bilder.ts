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
  kjokken: "Kjøkken og dekketøy",
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
  // Lokalet
  langbord: { kategori: "lokalet", alt: "Potetbua med langbordet dekket under tømmerbjelkene, lyslenker i taket og Høna Bar til venstre." },
  "langbord-kveld": { kategori: "lokalet", alt: "Langbordet i Potetbua om kvelden, med levende lys og blomster hele veien og lykter over bordet." },
  "hona-bar": { kategori: "lokalet", alt: "Høna Bar med høne i keramikk, lysestake i messing og krukke med rognebær, og en gammel trillebår foran." },
  "potetbua-historie": { kategori: "lokalet", alt: "Glass på brett foran veggen med gamle redskaper, kornbunter og lysestaker." },
  "lokalet--hjornet-med-gevir-og-gamle-flasker": { kategori: "lokalet", alt: "Hjørne med reinsdyrgevir, gamle flasker i vinduet, saueskinn og melkespann med blomster på bordet." },
  "lokalet--seletoy-og-slipestein": { kategori: "lokalet", alt: "Gammelt seletøy, slipestein og hestesko i en krok av Potetbua." },
  "lokalet--vedovnen-og-langbordet": { kategori: "lokalet", alt: "Vedovn og benk med saueskinn og røde puter, med et dekket bord foran." },
  "lokalet--hona-bar-skiltet": { kategori: "lokalet", alt: "Skiltet over Høna Bar, med høne i keramikk, krukke med rognebær og tente lys." },
  "lokalet--hona-ved-baren": { kategori: "lokalet", alt: "Høne i keramikk og lys i glass på bardisken." },
  "lokalet--baren-med-plakater": { kategori: "lokalet", alt: "Bardisken i Høna Bar med gamle plakater, traktorseter som barkrakker og flasker på hylla." },
  "lokalet--vedovnkroken": { kategori: "lokalet", alt: "Kroken ved vedovnen med saueskinn på benken, gamle foto og lykter." },
  "lokalet--gammel-telefon-og-levende-lys": { kategori: "lokalet", alt: "Gammel veivtelefon og lys i glass på et slitt skrivebord." },
  "lokalet--skrivebordet-med-skrivemaskin": { kategori: "lokalet", alt: "Gammelt skrivebord med skrivemaskin, lysestake, gammel telefon og levende lys." },
  // Mat og bord
  koldtbord: { kategori: "bord", alt: "Koldtbord med laks, salater og reker dekket på en gammel høvelbenk." },
  "koldtbord-naert": { kategori: "bord", alt: "Fat med reker, laks og salater på en gammel arbeidsbenk." },
  cognac: { kategori: "bord", alt: "To flasker cognac på en gammel arbeidsbenk, foran en krukke med havre." },
  "bord--rognebaer-og-eple-i-skal": { kategori: "bord", alt: "Skål med rognebær, eple og løv, med lysestake i messing bak." },
  "bord--rognebaer-i-levende-lys": { kategori: "bord", alt: "Skål med rognebær og eple foran tre tente lys." },
  "bord--melkespann-med-rognebaer": { kategori: "bord", alt: "Gammelt melkespann brukt som vase, med rognebær og hvite bær." },
  "bord--glass-pa-brett-i-levende-lys": { kategori: "bord", alt: "Glass på brett med blondeserviett, foran levende lys." },
  "bord--sitron-lime-og-dill": { kategori: "bord", alt: "Skåler med sitron og lime, og en bunt dill." },
  // Fest
  "middag-gjester": { kategori: "fest", alt: "Gjester til bords ved langbordene i Potetbua, under lyslenker og lykter." },
  "dans-discolys": { kategori: "fest", alt: "To gjester danser i rosa discolys og røyk under tømmertaket." },
  "fest--dekkede-bord-foran-skinnet": { kategori: "fest", alt: "Dekkede bord foran et stort skinn på veggen, med lykter i taket." },
  "fest--dekket-i-lyktelys": { kategori: "fest", alt: "Dekkede bord i lyktelys, sett innover i Potetbua." },
  "fest--lyd-og-lys": { kategori: "fest", alt: "Høyttaler med lysbriller og glowsticks." },
  // Gården
  "potetbua-utenfra": { kategori: "garden", alt: "Potetbua sett mellom trærne: rød bygning med hvit dør." },
  "potetbua-inngang-flagg": { kategori: "garden", alt: "Inngangen til Potetbua, pyntet med bjørk og norske flagg." },
  uteomradet: { kategori: "garden", alt: "Potetbua sett fra tunet, med grusvei, melkespann ved døra og lykter langs veien." },
  "garden-host": { kategori: "garden", alt: "Potetbua i høstsol, med rødt villvin og blå himmel." },
  "garden-sommer": { kategori: "garden", alt: "Potetbua en sommerkveld i solnedgang, med flagg ved døra og lys i lyktene." },
  "garden--potetbua-en-kveld": { kategori: "garden", alt: "Potetbua om kvelden, med lys i døra og sykler på tunet." },
  "garden--katten-pa-benken": { kategori: "garden", alt: "Gårdskatten, en svart katt, på saueskinn i benken." },
  "hovedhuset-host": { kategori: "garden", alt: "Det hvite hovedhuset på Nashoug Gård i høstsol, med gult løv på trærne og plenen." },
  "garden-var": { kategori: "garden", alt: "Potetbua om våren, med gule blomster i forgrunnen og grusveien opp til døra." },
  "garden-vinter": { kategori: "garden", alt: "Potetbua i rimfrost, med snødekte trær og blå himmel." },
  "garden--rimfrost-ved-hovedhuset": { kategori: "garden", alt: "Tunet ved hovedhuset i rimfrost og lav vintersol." },
  "garden--flagget-pa-tunet": { kategori: "garden", alt: "Flaggstanga på tunet med flagget heist mot blå himmel." },
  "garden--utsikten-mot-mjosa": { kategori: "garden", alt: "Utsikten fra gården over grønne jorder mot Mjøsa, med flaggstanga i forgrunnen." },
  "garden--skiloype-over-jordene": { kategori: "garden", alt: "Skiløype over snødekte jorder i lav vintersol." },
  "garden--veteranbil-under-treet": { kategori: "garden", alt: "Svart veteranbil på grusveien under det store treet på tunet." },
  // Kjøkken og dekketøy
  kjokken: { kategori: "kjokken", alt: "Kjøkkenet i Potetbua, med komfyr og stekeovn, oppvaskmaskin, kaffetrakter og stor oppvaskkum." },
  "kjokken--glass-og-tallerkener": { kategori: "kjokken", alt: "Skap med vinglass, vannglass og tallerkener." },
  "kjokken--tallerkener": { kategori: "kjokken", alt: "Stabler med hvite tallerkener og dype tallerkener." },
  "kjokken--kopper-og-asjetter": { kategori: "kjokken", alt: "Hvite kopper, skåler og asjetter i skapet." },
  "kjokken--glassflasker-pa-hylla": { kategori: "kjokken", alt: "Glassflasker med patentkork på en hylle i kjøkkenet." },
  // Julebord
  "julebord--langbordet-dekket-til-jul": { kategori: "julebord", alt: "Langbordet i Potetbua dekket til julebord, med røde julekuler og lys." },
  "julebord--hovedhuset-i-julelys": { kategori: "julebord", alt: "Hovedhuset i blåtimen, med julelys på verandaen og i trærne." },
  "julebord--potetbua-en-forjulskveld": { kategori: "julebord", alt: "Potetbua en førjulskveld, med fakler langs veien og granbar ved døra." },
  // Vises ikke i galleriet
  familien: { kategori: "skjult", alt: "Familien på Nashoug på tur på fjellet: Håkon, Silja og de tre barna." },
};

// Bilder som har en fast plass, men som ikke skal i galleriet.
const ikkeIGalleri = new Set(["familien"]);

/** Beskrivelsen av et kjent bilde, til alt-tekst. */
export const kjentAlt = (navn: string) => kjente[navn]?.alt;

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

// Rekkefølgen i galleriet: lokalet først, gården sist.
const orden = ["lokalet", "fest", "bord", "kjokken", "konfirmasjon", "julebord", "sommerfest", "bursdag", "bryllup", "firma", "garden"];

export function galleriBilder(): GalleriBilde[] {
  return lesBilder().sort((a, b) => orden.indexOf(a.kategori ?? "") - orden.indexOf(b.kategori ?? ""));
}

function lesBilder(): GalleriBilde[] {
  const filer = fs
    .readdirSync(MAPPE)
    .filter((f) => BILDEFIL.test(f) && !ikkeIGalleri.has(f.replace(BILDEFIL, "")))
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
