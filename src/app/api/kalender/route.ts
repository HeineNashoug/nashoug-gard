import { hentDager } from "@/lib/admin";
import { idag, leggTil } from "@/lib/dato";

const ren = (s: string) => s.replace(/[\;,]/g, (c) => "\\" + c).replace(/\n/g, " ");

/** Kalenderabonnement (iCal) for Google Kalender og telefon. Beskyttet med hemmelig nøkkel i adressen. */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  if (!process.env.ICAL_TOKEN || process.env.ICAL_TOKEN === "bytt-meg" || token !== process.env.ICAL_TOKEN)
    return new Response("Ugyldig nøkkel", { status: 401 });

  const dager = await hentDager(leggTil(idag(), -60), leggTil(idag(), 800));
  const hendelser = dager.map((d) => {
    const tittel = d.reference ? `${d.status === "foresporsel" ? "Reservert" : "Potetbua"}: ${d.name}` : `Sperret: ${d.blocked_reason}`;
    const dag = d.date.replaceAll("-", "");
    return ["BEGIN:VEVENT", `UID:${d.date}@nashoug.no`, `DTSTAMP:${dag}T000000Z`, `DTSTART;VALUE=DATE:${dag}`, `DTEND;VALUE=DATE:${leggTil(d.date, 1).replaceAll("-", "")}`, `SUMMARY:${ren(tittel)}`, "END:VEVENT"].join("\r\n");
  });
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Nashoug Gård//Potetbua//NO", "X-WR-CALNAME:Potetbua", ...hendelser, "END:VCALENDAR"].join("\r\n");
  return new Response(ics, { headers: { "Content-Type": "text/calendar; charset=utf-8", "Cache-Control": "no-store" } });
}
