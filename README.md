# Nashoug Gård

Nettsiden for Nashoug Gård og festlokalet Potetbua, med booking og adminpanel.

Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Motion og Lenis. PostgreSQL
(Supabase) til bookinger, Supabase Auth til innlogging, Resend til e-post.

- `DESIGN.md`: farger, skrifter, komponenter og animasjonsregler.
- `BILDER.md`: hvilke bilder som mangler, og hvordan nye legges inn.

## Kjøre lokalt

Krever Node 22 og en PostgreSQL-database.

```bash
npm install
cp .env.example .env.local
psql "$DATABASE_URL" -f supabase/migrations/20261112000000_booking.sql
psql "$DATABASE_URL" -f supabase/seed.sql
npm run dev
```

Siden ligger da på http://localhost:3000.

## Miljøvariabler

| Navn | Hva |
|---|---|
| `DATABASE_URL` | Tilkobling til Postgres. Fra Supabase: Connect → Transaction pooler. Hemmelig. |
| `SUPABASE_URL` | Adressen til Supabase-prosjektet. |
| `SUPABASE_PUBLISHABLE_KEY` | Åpen nøkkel til Supabase (innlogging). |
| `ADMIN_EMAILS` | Hvem som slipper inn i adminpanelet og får varsel om nye forespørsler. Kommaseparert. |
| `RESEND_API_KEY` | Nøkkel til Resend. Hemmelig. Uten den lagres e-postene som filer i `.epost/`. |
| `EMAIL_FROM` | Avsender, f.eks. `Nashoug Gård <booking@nashoug.no>`. Domenet må være godkjent i Resend. |
| `ICAL_TOKEN` | Lang, tilfeldig tekst som beskytter kalenderabonnementet. Hemmelig. |
| `ADMIN_DEV_EMAIL` | Bare for `npm run dev`: hopper over innlogging. Virker ikke på den ferdige siden. |

## Slik virker bookingen

1. Gjesten velger dato og sender en forespørsel på `/book`.
2. Datoen holdes av som «Reservert» i 48 timer. Gjesten får bekreftelse på e-post,
   og adressene i `ADMIN_EMAILS` får varsel.
3. Gården godkjenner, avslår eller foreslår ny dato i adminpanelet. Gjesten får e-post.
4. Uten svar innen 48 timer blir datoen ledig igjen, og forespørselen merkes «Utløpt».
   Den kan fortsatt godkjennes så lenge datoen er ledig.

Dobbeltbooking er umulig: tabellen `booking_dates` har datoen som primærnøkkel,
så databasen avviser en dato som allerede er tatt.

## Adminpanelet

Adressen er `/admin`. Brukerne lages i Supabase (Authentication → Users → Add user,
med «Auto Confirm User»), og e-posten må stå i `ADMIN_EMAILS`.

- **Forespørsler:** godkjenn (med valgfri pris), avslå eller foreslå ny dato.
- **Kalender:** se alle bookinger, og sperr datoer til eget bruk.
- **Tillegg:** det gjestene kan krysse av for i bookingen.
- **Last ned CSV:** alle bookinger, til Excel.
- **Kalenderabonnement:** adressen står nederst på kalendersiden. Legg den til i
  Google Kalender under «Andre kalendere → Fra nettadresse».

## Bilder og tekst

Nye bilder legges i `public/images` etter reglene i `BILDER.md`. Tekstene står i
sidene under `src/app/`. Arrangementstypene står i `src/lib/arrangementer.ts`, og
adresse, telefon og meny i `src/lib/site.ts`.

## Legge ut på Vercel

1. Kjør `supabase/migrations/20261112000000_booking.sql` og `supabase/seed.sql`
   i Supabase (SQL Editor).
2. Importer repoet i Vercel, og legg inn miljøvariablene over.
3. Legg til domenet nashoug.no i Vercel.
4. Godkjenn nashoug.no som avsenderdomene i Resend.

## Før lansering

Søk etter `Mangler` og `PLASSHOLDERE` i `src/app/`. Dette må fylles ut eller fjernes:

- Historien til gården og Potetbua.
- Hva som finnes på kjøkkenet, og om adkomsten er trinnfri.
- Når leietaker kan pynte, når lokalet må være ryddet, og hvem som vasker.
- Veibeskrivelse og parkering.
- Sitatene på forsiden (plassholdere).
- Bildene som står som plassholdere (se `BILDER.md`).

## Kommandoer

| Kommando | Hva |
|---|---|
| `npm run dev` | Utvikling |
| `npm run build` | Bygg for produksjon |
| `npm run start` | Kjør det som er bygget |
| `npm run lint` | Kodesjekk |
