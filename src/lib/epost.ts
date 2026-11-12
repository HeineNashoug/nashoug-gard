import fs from "node:fs/promises";
import { HOLD_TIMER, typer, type Lagret } from "./booking";
import { formaterDato } from "./dato";
import { site } from "./site";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const serif = "Georgia, 'Times New Roman', serif";
const sans = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";

/** Felles ramme for alle e-poster: krem bunn, grønt hode med monogram, messinglinje. */
function ramme(tittel: string, innhold: string) {
  return `<!doctype html><html lang="nb"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(tittel)}</title></head>
<body style="margin:0;background:#EAE1CF;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EAE1CF;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#F5EFE4;">
<tr><td align="center" style="background:#1F3A2D;padding:28px 24px;border-bottom:2px solid #B8975A;">
  <div style="font-family:${serif};font-size:30px;line-height:1;color:#C9AD78;letter-spacing:1px;">NG</div>
  <div style="font-family:${sans};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#F5EFE4;margin-top:10px;">${esc(site.name)}</div>
</td></tr>
<tr><td style="padding:36px 32px 12px;font-family:${sans};font-size:16px;line-height:1.6;color:#1E1B16;">
  <h1 style="font-family:${serif};font-weight:normal;font-size:30px;line-height:1.15;margin:0 0 20px;">${esc(tittel)}</h1>
  ${innhold}
</td></tr>
<tr><td style="padding:20px 32px 32px;font-family:${sans};font-size:13px;line-height:1.6;color:#5A5347;border-top:1px solid #B8975A;">
  ${esc(site.name)} · ${esc(site.street)}, ${esc(site.postal)}<br>
  Telefon ${esc(site.phone)} · <a href="mailto:${site.email}" style="color:#5A5347;">${site.email}</a>
</td></tr>
</table></td></tr></table></body></html>`;
}

const rad = (navn: string, verdi: string) =>
  `<tr><td style="padding:10px 16px 10px 0;border-bottom:1px solid #E0D6C2;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#5A5347;vertical-align:top;white-space:nowrap;">${navn}</td>
<td style="padding:10px 0;border-bottom:1px solid #E0D6C2;vertical-align:top;">${verdi}</td></tr>`;

function detaljer(b: Lagret, medKontakt: boolean) {
  const type = typer.find((t) => t.id === b.type)?.navn ?? b.type;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 24px;border-top:1px solid #E0D6C2;font-size:16px;line-height:1.5;">
${rad("Referanse", esc(b.referanse))}
${rad(b.datoer.length > 1 ? "Datoer" : "Dato", b.datoer.map((d) => esc(formaterDato(d))).join("<br>"))}
${b.tid ? rad("Start", "ca. kl. " + esc(b.tid)) : ""}
${rad("Arrangement", esc(type))}
${rad("Gjester", String(b.gjester))}
${b.tilleggNavn.length ? rad("Tillegg", b.tilleggNavn.map(esc).join("<br>")) : ""}
${medKontakt ? rad("Navn", esc(b.navn)) + rad("E-post", `<a href="mailto:${esc(b.epost)}" style="color:#1F3A2D;">${esc(b.epost)}</a>`) + rad("Telefon", `<a href="tel:${esc(b.telefon)}" style="color:#1F3A2D;">${esc(b.telefon)}</a>`) : ""}
${b.melding ? rad("Melding", esc(b.melding).replace(/\n/g, "<br>")) : ""}
</table>`;
}

export function bekreftelseTilKunde(b: Lagret) {
  return {
    emne: `Vi har mottatt forespørselen din (${b.referanse})`,
    html: ramme(
      "Takk for forespørselen",
      `<p style="margin:0 0 12px;">Hei ${esc(b.navn.split(" ")[0])},</p>
<p style="margin:0 0 12px;">Vi har mottatt forespørselen din om å leie Potetbua. Datoen er holdt av til deg i ${HOLD_TIMER} timer.</p>
<p style="margin:0;">Vi tar kontakt med bekreftelse og et prisforslag. Dette er en forespørsel, og bookingen er ikke bindende før vi har bekreftet den.</p>
${detaljer(b, false)}
<p style="margin:0 0 24px;">Har du spørsmål, kan du svare på denne e-posten eller ringe Håkon på ${esc(site.phone)}.</p>`,
    ),
  };
}

export function varselTilGarden(b: Lagret) {
  return {
    emne: `Ny forespørsel: ${formaterDato(b.datoer[0])} (${b.referanse})`,
    html: ramme(
      "Ny forespørsel om Potetbua",
      `<p style="margin:0;">${esc(b.navn)} har sendt en forespørsel. Datoen er reservert i ${HOLD_TIMER} timer. Etter det blir den ledig igjen hvis forespørselen ikke er godkjent.</p>
${detaljer(b, true)}
<p style="margin:0 0 24px;">Svar på denne e-posten for å skrive direkte til ${esc(b.navn.split(" ")[0])}.</p>`,
    ),
  };
}

/** Sender via Resend. Uten RESEND_API_KEY lagres e-posten som fil i .epost/ (til lokal forhåndsvisning). */
export async function sendEpost(m: { til: string[]; emne: string; html: string; svarTil?: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    await fs.mkdir(".epost", { recursive: true });
    await fs.writeFile(`.epost/${Date.now()}-${m.til[0]}.html`, `<!-- Til: ${m.til.join(", ")} | Emne: ${m.emne} -->\n${m.html}`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.EMAIL_FROM, to: m.til, subject: m.emne, html: m.html, reply_to: m.svarTil }),
  });
  if (!res.ok) throw new Error(`Resend svarte ${res.status}: ${await res.text()}`);
}

type Svar = { reference: string; name: string; dates: string[]; price_offer?: number | null };

const egenMelding = (m: string) =>
  m.trim() ? `<p style="margin:0 0 12px;padding:12px 16px;background:#EAE1CF;">${esc(m.trim()).replace(/\n/g, "<br>")}</p>` : "";
const datoliste = (b: Svar) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 24px;border-top:1px solid #E0D6C2;font-size:16px;line-height:1.5;">
${rad("Referanse", esc(b.reference))}${rad(b.dates.length > 1 ? "Datoer" : "Dato", b.dates.map((d) => esc(formaterDato(d))).join("<br>"))}
${b.price_offer ? rad("Pris", `kr ${b.price_offer.toLocaleString("nb-NO")}`) : ""}</table>`;
const hilsen = (b: Svar) => `<p style="margin:0 0 12px;">Hei ${esc(b.name.split(" ")[0])},</p>`;
const avslutning = `<p style="margin:0 0 24px;">Har du spørsmål, kan du svare på denne e-posten eller ringe Håkon på ${esc(site.phone)}.</p>`;

/** E-postene kunden får når gården godkjenner, avslår eller foreslår ny dato. */
export const svarTilKunde = {
  godkjent: (b: Svar, melding: string) => ({
    emne: `Bookingen din er bekreftet (${b.reference})`,
    html: ramme(
      "Bookingen er bekreftet",
      `${hilsen(b)}<p style="margin:0 0 12px;">Vi har godkjent forespørselen din, og Potetbua er holdt av til dere.</p>${egenMelding(melding)}${datoliste(b)}${avslutning}`,
    ),
  }),
  avslatt: (b: Svar, melding: string) => ({
    emne: `Om forespørselen din (${b.reference})`,
    html: ramme(
      "Vi kan dessverre ikke ta imot forespørselen",
      `${hilsen(b)}<p style="margin:0 0 12px;">Takk for at du spurte om å leie Potetbua. Denne gangen får vi det dessverre ikke til.</p>${egenMelding(melding)}${datoliste(b)}${avslutning}`,
    ),
  }),
  nydato: (b: Svar, melding: string) => ({
    emne: `Forslag til ny dato (${b.reference})`,
    html: ramme(
      "Vi foreslår en annen dato",
      `${hilsen(b)}<p style="margin:0 0 12px;">Datoen du spurte om, passer dessverre ikke. Vi har holdt av datoen under til deg i ${HOLD_TIMER} timer. Svar på denne e-posten og si om den passer.</p>${egenMelding(melding)}${datoliste(b)}${avslutning}`,
    ),
  }),
};
