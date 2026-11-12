# DESIGN.md · Nashoug Gård

Retning: **herskapelig gård**. Hvitt hovedhus, rød låve, tømmer, hvite duker
og levende lys. Siden skal føles som et magasin om gården, ikke som en mal.
Ett tema (lyst), ingen mørk modus.

Retningen bygger på briefen og bildene fra gården. Den er ikke sammenlignet
med andre nettsteder.

## Farger

| Token | Verdi | Rolle |
|---|---|---|
| `cream` | `#F5EFE4` | Sidebakgrunn |
| `parchment` | `#EAE1CF` | Annenhver seksjon, bildeplassholdere, felt i tabeller |
| `paper` | `#FAF6EE` | Skjemafelt og kalender |
| `ink` | `#1E1B16` | Brødtekst og overskrifter (15:1 mot cream) |
| `stone` | `#5A5347` | Dempet tekst, bildetekster (6,6:1) |
| `forest` | `#1F3A2D` | Primærfarge: knapper, mørke seksjoner, valgt dato (10,8:1) |
| `forest-deep` | `#14261D` | Footer, hover på primærknapp |
| `brass` | `#B8975A` | Linjer, ornamenter, monogram. Kun pynt, aldri liten tekst på lys bunn |
| `brass-dark` | `#7B6029` | Etiketter og lenkestrek på lys bunn (5,2:1) |
| `brass-light` | `#C9AD78` | Etiketter og tekst på `forest` (5,7:1) |
| `barn` | `#7A2E2A` | Låverød: små detaljer, feilmeldinger, «opptatt» (8,2:1) |

Ren hvit og ren svart brukes ikke. Ingen gradienter.

## Typografi

- **Overskrifter:** Cormorant Garamond, vekt 400, kursiv til utheving.
  Aldri under 22 px (skriften har lav x-høyde).
- **Brødtekst og skjema:** Hanken Grotesk, vekt 400 og 500. Tabelltall i priser.
- Begge lastes med `next/font` (ingen eksterne kall, ingen layout-hopp).

| Stil | Størrelse / linjehøyde | Bruk |
|---|---|---|
| `display` | clamp(2,75rem, 8vw, 6,5rem) / 0,98 | Hero |
| `h1` | clamp(2,5rem, 6vw, 4,5rem) / 1,05 | Sidetittel |
| `h2` | clamp(2rem, 4,5vw, 3,25rem) / 1,1 | Seksjon |
| `h3` | 1,625rem / 1,2 | Undertittel |
| `lede` | 1,5rem / 1,4, Cormorant | Ingress |
| `body` | 1,0625rem / 1,65 | Brødtekst, maks 65 tegn per linje |
| `small` | 0,9375rem / 1,5 | Bildetekst, hjelpetekst |
| `label` | 0,75rem / 1, versaler, sperring 0,18em, vekt 500 | «ARRANGEMENTER», knapper, meny |

## Spacing og layout

- Skala (px): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160.
- Luft mellom seksjoner: clamp(4,5rem, 10vw, 10rem).
- Maks bredde 1320 px. 12 kolonner på desktop, 4 på mobil. Sidemarg 20 px
  på mobil, 48 px på desktop.
- Redaksjonell layout: bilder helt ut i kanten, tekst i smal spalte,
  forskjøvne bildepar, ingen seksjonstype to ganger på rad.

## Form

- Bilder og flater: radius 0. Knapper og felt: 2 px.
- Ingen skygger, bortsett fra én myk skygge under lysboks og meny.
- Hårlinjer: 1 px `brass`, eller `ink` med 12 % dekning.
- Papirkorn: SVG-støy over hele siden med 4 % dekning (ingen bildefil).

## Komponenter

- **Monogram:** en N i skjønnskrift (Italianno, tegnet som kurve) i en
  liggende dobbel oval. Brukes i meny,
  footer, intro og e-post.
- **Ornament:** en liten potetblomst i strek, mellom to messinglinjer. Skiller
  seksjoner.
- **Etikett:** kort messingstrek + `label`-tekst over overskrifter.
- **Knapper** (høyde 52 px, `label`-tekst):
  primær = `forest` fyll, `cream` tekst, hover `forest-deep`;
  sekundær = 1 px `forest` ramme, hover fylles;
  stille = tekst med messingstrek som tegnes fra venstre.
  Fokus: 2 px `brass-dark` ring med 3 px avstand. Deaktivert: 40 % dekning.
- **Lenker i tekst:** alltid tynn understrek; ved hover tegnes den på nytt.
- **Skjemafelt:** etikett over feltet, 1 px ramme, 52 px høyde, fokus
  `forest` ramme + ring. Feil i `barn` med tekst, aldri bare farge.
- **Meny:** `cream` med hårlinje, festet øverst. «Book» er alltid synlig. Mobil: fullskjermsmeny i `forest` med store
  serif-lenker.
- **Kalender:** ruter på minst 44 px.
  Ledig = tall på `cream`; valgt = `forest` fyll;
  reservert = messingskravur; opptatt = dempet tall med strek over.
  Tegnforklaring under. Status vises aldri bare med farge.
- **Fremdrift i booking:** fem nummererte steg på en messinglinje. Mobil:
  «Steg 2 av 5» + linje.
- **Arrangementer:** nummerert liste med stor serif og bilde, ikke kort.
- **Priser og FAQ:** tabell og trekkspill med hårlinjer.
- **Bildeplassholder:** `parchment` flate med messingramme og teksten
  «FOTO: hva som skal inn».
- **Ikoner:** ingen ikonbibliotek. Tall, tekst og strek gjør jobben.

## Bilder

- Varme interiører med levende lys, og gården utenfra i dagslys.
- Ingen filter, fargeslør eller tekst oppå bilder. Tekst står ved siden av
  eller under bildet.
- Bilder vises ikke større enn oppløsningen tåler. Hero er derfor delt i to
  på desktop (tekst til venstre, bilde til høyre) til vi har originalfiler.
- Format: 3:2 liggende, 4:5 stående.
- Bilder med rosa discolys brukes bare i galleriet, aldri som hovedbilde.
- Gjenkjennelige gjester vises bare med samtykke.

## Animasjon

- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`. Varighet 0,6 / 0,9 / 1,2 s.
  Forskyvning mellom elementer 80 ms.
- **Intro** (maks 1,5 s, én gang per økt): monogrammet tegnes, hero-bildet
  åpnes med maske.
- **Hero:** langsom Ken Burns (skala 1,06 til 1 over 12 s), overskrift linje
  for linje.
- **Scroll:** Lenis; bilder avdekkes med maske, parallax flytter hele
  bilderammen maks 4 % (bildet forstørres ikke), tall
  teller opp over 1,2 s.
- **Hover:** messingstrek under lenker, bilder zoomer til 1,04.
- **Sidebytte:** 0,4 s toning.
- Bare `transform`, `opacity` og `clip-path` animeres.
- `prefers-reduced-motion`: ingen intro, parallax eller Lenis; alt tones
  inn på 0,2 s.
- Bibliotek: Motion (Framer Motion) + Lenis. GSAP tas bare inn hvis Motion
  ikke rekker til.
