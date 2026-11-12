-- Booking for Potetbua på Nashoug Gård.
-- Kjøres mot Supabase (Postgres) med `supabase db push`, eller lokalt med psql.

create type booking_status as enum (
  'foresporsel', -- ny forespørsel, datoen holdes til hold_expires_at
  'godkjent',    -- godkjent av gården, datoen er opptatt
  'avslatt',     -- avslått av gården
  'utlopt',      -- ikke godkjent innen fristen, datoen er frigitt
  'kansellert'   -- avbestilt
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  status booking_status not null default 'foresporsel',
  event_type text not null,
  dates date[] not null, -- datoene det er spurt om. Selve sperren ligger i booking_dates.
  guests integer not null check (guests between 1 and 60),
  start_time time,
  name text not null,
  email text not null,
  phone text not null,
  message text not null default '',
  addons jsonb not null default '[]', -- navnene på valgte tillegg, slik de var da forespørselen ble sendt
  hold_expires_at timestamptz not null,
  price_offer integer, -- prisforslag i kroner, settes av gården
  admin_note text not null default '',
  -- Forberedt for depositum via Vipps eller Stripe. Ikke i bruk ennå.
  deposit_amount integer,
  deposit_status text not null default 'ikke_krevd'
    check (deposit_status in ('ikke_krevd', 'venter', 'betalt', 'refundert')),
  payment_provider text,
  payment_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Én rad per dato som er holdt av. Datoen er primærnøkkel, så to bookinger
-- kan aldri ha samme dato, uansett hva nettsiden gjør.
create table booking_dates (
  date date primary key,
  booking_id uuid references bookings (id) on delete cascade,
  blocked_reason text, -- satt når gården har sperret datoen selv
  check (booking_id is not null or blocked_reason is not null)
);
create index booking_dates_booking_id on booking_dates (booking_id);

-- Tillegg som kan velges i bookingen. Redigeres i adminpanelet.
create table addons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price integer, -- kroner. Vises ikke på nettsiden ennå.
  active boolean not null default true,
  sort integer not null default 0
);

-- Ingen tilgang via Supabase sitt åpne API. Nettsiden leser og skriver bare fra serveren.
alter table bookings enable row level security;
alter table booking_dates enable row level security;
alter table addons enable row level security;
