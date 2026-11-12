"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as admin from "@/lib/admin";
import { adminEposter, krevAdmin, supabase } from "@/lib/auth";
import { erDato } from "@/lib/dato";
import { sendEpost, svarTilKunde } from "@/lib/epost";

const tekst = (f: FormData, navn: string) => String(f.get(navn) ?? "").trim();
const tilbake = (sti: string, melding?: string): never => {
  revalidatePath("/admin", "layout");
  redirect(melding ? `${sti}?melding=${encodeURIComponent(melding)}` : sti);
};

export async function loggInn(f: FormData) {
  const { error } = await (await supabase()).auth.signInWithPassword({ email: tekst(f, "epost"), password: tekst(f, "passord") });
  if (error) redirect("/admin/logg-inn?feil=1");
  redirect("/admin");
}

export async function loggUt() {
  await (await supabase()).auth.signOut();
  redirect("/admin/logg-inn");
}

/** Sender svar til kunden. Feiler e-posten, sier vi fra i panelet i stedet for å late som den gikk. */
async function varsle(id: string, type: keyof typeof svarTilKunde, melding: string) {
  const b = await admin.hentBooking(id);
  try {
    await sendEpost({ til: [b.email], svarTil: adminEposter()[0], ...svarTilKunde[type](b, melding) });
    return `${b.name} har fått e-post.`;
  } catch (e) {
    console.error("E-post feilet for", b.reference, e);
    return `E-posten til ${b.name} ble ikke sendt. Ta kontakt på ${b.phone}.`;
  }
}

export async function godkjenn(f: FormData) {
  await krevAdmin();
  const id = tekst(f, "id");
  const pris = Number(tekst(f, "pris").replace(/\s/g, "")) || null;
  if (!(await admin.godkjenn(id, pris))) tilbake("/admin", "Kunne ikke godkjenne: datoen er tatt av en annen booking.");
  tilbake("/admin", "Godkjent. " + (await varsle(id, "godkjent", tekst(f, "melding"))));
}

export async function avslaa(f: FormData) {
  await krevAdmin();
  const id = tekst(f, "id");
  await admin.avslutt(id, "avslatt");
  tilbake("/admin", "Avslått. " + (await varsle(id, "avslatt", tekst(f, "melding"))));
}

export async function foreslaDato(f: FormData) {
  await krevAdmin();
  const id = tekst(f, "id");
  const dato = tekst(f, "dato");
  if (!erDato(dato)) tilbake("/admin", "Velg en gyldig dato.");
  if (!(await admin.flyttDato(id, dato))) tilbake("/admin", "Den datoen er allerede opptatt. Velg en annen.");
  tilbake("/admin", "Ny dato foreslått. " + (await varsle(id, "nydato", tekst(f, "melding"))));
}

export async function kanseller(f: FormData) {
  await krevAdmin();
  await admin.avslutt(tekst(f, "id"), "kansellert");
  tilbake("/admin", "Bookingen er kansellert og datoen er ledig igjen. Kunden har ikke fått e-post.");
}

export async function sperr(f: FormData) {
  await krevAdmin();
  const dato = tekst(f, "dato");
  const sti = `/admin/kalender`;
  if (!erDato(dato)) tilbake(sti, "Velg en gyldig dato.");
  const ok = await admin.sperr(dato, tekst(f, "grunn") || "Sperret");
  tilbake(sti, ok ? "Datoen er sperret." : "Datoen er allerede opptatt.");
}

export async function fjernSperre(f: FormData) {
  await krevAdmin();
  await admin.fjernSperre(tekst(f, "dato"));
  tilbake("/admin/kalender", "Sperren er fjernet.");
}

export async function lagreTillegg(f: FormData) {
  await krevAdmin();
  const name = tekst(f, "name");
  if (!name) tilbake("/admin/tillegg", "Tillegget må ha et navn.");
  await admin.lagreTillegg({
    id: tekst(f, "id") || undefined,
    name,
    description: tekst(f, "description"),
    price: Number(tekst(f, "price").replace(/\s/g, "")) || null,
    active: f.get("active") === "on",
    sort: Number(tekst(f, "sort")) || 0,
  });
  tilbake("/admin/tillegg", "Lagret.");
}
