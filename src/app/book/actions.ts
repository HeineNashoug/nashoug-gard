"use server";

import { lagreForesporsel, valider, type Foresporsel } from "@/lib/booking";
import { bekreftelseTilKunde, sendEpost, varselTilGarden } from "@/lib/epost";

export type Svar =
  | { ok: true; referanse: string }
  | { ok: false; feil?: Record<string, string>; opptatt?: true; melding?: string };

export async function sendForesporsel(inn: Foresporsel & { nettsted?: string; godtatt?: boolean }): Promise<Svar> {
  // Skjult felt som bare roboter fyller ut. Later som alt gikk bra.
  if (inn.nettsted) return { ok: true, referanse: "NG-00000" };
  if (!inn.godtatt) return { ok: false, feil: { godtatt: "Kryss av for at du har lest det praktiske." } };

  const f: Foresporsel = {
    datoer: inn.datoer,
    tid: inn.tid ?? "",
    type: inn.type,
    gjester: Number(inn.gjester),
    tillegg: inn.tillegg ?? [],
    navn: inn.navn,
    epost: inn.epost,
    telefon: inn.telefon,
    melding: inn.melding ?? "",
  };
  const feil = valider(f);
  if (feil) return { ok: false, feil };

  let lagret;
  try {
    lagret = await lagreForesporsel(f);
  } catch (e) {
    console.error("Kunne ikke lagre forespørsel", e);
    return { ok: false, melding: "Noe gikk galt hos oss. Prøv igjen, eller ring oss." };
  }
  if (!lagret) return { ok: false, opptatt: true };

  // Forespørselen er lagret. Feiler e-posten, skal ikke kunden få feilmelding.
  const admin = (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const sendt = await Promise.allSettled([
    sendEpost({ til: [lagret.epost], svarTil: admin[0], ...bekreftelseTilKunde(lagret) }),
    admin.length ? sendEpost({ til: admin, svarTil: lagret.epost, ...varselTilGarden(lagret) }) : null,
  ]);
  for (const s of sendt) if (s.status === "rejected") console.error("E-post feilet for", lagret.referanse, s.reason);

  return { ok: true, referanse: lagret.referanse };
}
