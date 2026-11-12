import { hentBookinger } from "@/lib/admin";
import { hentAdmin } from "@/lib/auth";

const celle = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

/** Alle bookinger som CSV, til Excel. Krever innlogging. */
export async function GET() {
  if (!(await hentAdmin())) return new Response("Ikke innlogget", { status: 401 });
  const rader = (await hentBookinger()).map((b) =>
    [b.reference, b.status, b.dates.join(" "), b.event_type, b.guests, b.start_time, b.name, b.email, b.phone, b.addons.join(", "), b.price_offer, b.message, b.created_at.toISOString()]
      .map(celle)
      .join(";"),
  );
  const csv = ["Referanse;Status;Datoer;Arrangement;Gjester;Start;Navn;E-post;Telefon;Tillegg;Pris;Melding;Mottatt", ...rader].join("\r\n");
  // BOM først, så Excel leser æ, ø og å riktig.
  return new Response("﻿" + csv, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="bookinger.csv"' },
  });
}
