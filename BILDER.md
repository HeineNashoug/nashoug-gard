# Bilder: plan og navneregler

Alle bilder legges i `public/images`. Siden må bygges på nytt etterpå
(`npm run build`, eller en ny utrulling på Vercel). Ingen kode må endres.

## Slik bør filene være

- Originalfiler rett fra mobil eller kamera, ikke via Word, Facebook eller
  Messenger. Minst 2400 px på den lengste siden.
- Ingen filter. Siden legger ikke noe oppå bildene.
- JPG, PNG eller WebP. Små bokstaver, bindestrek i stedet for mellomrom,
  og ikke æ, ø eller å i filnavnet.
- Gjenkjennelige gjester må ha sagt ja.

## 1. Faste plasser

Et bilde med riktig filnavn fyller plassen sin automatisk. Til det er på
plass, viser siden en plassholder eller et reservebilde.

| Filnavn | Side | Motiv | Format | Vises nå |
|---|---|---|---|---|
| `potetbua-historie` | Potetbua | Bua i gamle dager, eller redskapene på veggen | liggende 4:3 | plassholder |
| `kjokken` | Potetbua | Kjøkkenet, med benk og utstyr | liggende 3:2 | plassholder |
| `uteomradet` | Potetbua | Uteområdet en sommerkveld | liggende 4:3 | plassholder |
| `familien` | Om gården | Familien på gården | liggende 4:3 | plassholder |
| `garden-var` | Om gården | Gården om våren | stående 4:5 | reservebilde |
| `garden-sommer` | Om gården | Gården om sommeren | stående 4:5 | reservebilde |
| `garden-host` | Om gården | Innhøsting eller høstfarger | stående 4:5 | plassholder |
| `garden-vinter` | Om gården | Gården i snø, gjerne med lys i vinduene | stående 4:5 | plassholder |
| `arrangement-konfirmasjon` | Arrangementer | Bordet dekket til konfirmasjon | liggende 4:3 | reservebilde |
| `arrangement-julebord` | Arrangementer | Julebord: levende lys, pyntet bord | liggende 4:3 | reservebilde |
| `arrangement-sommerfest` | Arrangementer | Åpne dører, gjester ute | liggende 4:3 | reservebilde |
| `arrangement-bursdag` | Arrangementer | Bursdagsbord eller baren i bruk | liggende 4:3 | reservebilde |
| `arrangement-bryllup-og-jubileum` | Arrangementer | Bryllupsbord, hvitt og pyntet | liggende 4:3 | reservebilde |
| `arrangement-firmaarrangement` | Arrangementer | Firmafest eller middag | liggende 4:3 | reservebilde |

Eksempel: lagre kjøkkenbildet som `public/images/kjokken.jpg`.

## 2. Galleriet

Galleriet viser alle bildene i mappen. Gi nye bilder navn etter mønsteret
`kategori--beskrivelse.jpg` (to bindestreker etter kategorien):

    konfirmasjon--langbord-med-hvite-duker.jpg
    julebord--levende-lys-i-vinduet.jpg

Kategorien blir filterknapp, og beskrivelsen blir bildetekst
(«Langbord med hvite duker»). En filterknapp vises først når kategorien
har minst ett bilde.

Kategorier: `lokalet`, `garden`, `bord`, `fest`, `konfirmasjon`,
`julebord`, `sommerfest`, `bursdag`, `bryllup`, `firma`.

Bilder uten kategori vises bare under «Alle».

## 3. Bilder som må byttes i koden

Disse er valgt ut for hånd. Gi beskjed når det finnes bedre bilder, så
bytter vi dem:

- **Forsiden, øverst:** langbordet (`langbord.jpg`). Trenger originalfilen
  for å kunne vises i full skjermbredde.
- **Forsiden, «Gården»:** hovedhuset og Potetbua utenfra.
- **Forsiden, «Potetbua»:** Høna Bar.
- **Forsiden, «Bilder»:** middagen, koldtbordet og inngangen.

## Ønskeliste

Det siden mangler mest, i prioritert rekkefølge:

1. Langbordet i originaloppløsning (hovedbildet).
2. Potetbua utenfra en sommerkveld, med døra åpen.
3. Kjøkkenet og toalettene.
4. Ett bilde per arrangementstype, særlig konfirmasjon og bryllup.
5. Gården om vinteren.
6. Familien.
