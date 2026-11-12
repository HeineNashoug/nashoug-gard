import { hentLedighet } from "@/lib/booking";

/** Hvilke datoer som er reservert eller opptatt akkurat nå. Hentes ferskt hver gang. */
export async function GET() {
  return Response.json(await hentLedighet(), { headers: { "Cache-Control": "no-store" } });
}
