import { Melding } from "@/components/admin/Melding";
import { hentAlleTillegg, type TilleggRad } from "@/lib/admin";
import { krevAdmin } from "@/lib/auth";
import { lagreTillegg } from "../../actions";

export default async function AdminTillegg({ searchParams }: PageProps<"/admin/tillegg">) {
  await krevAdmin();
  const [{ melding }, tillegg] = await Promise.all([searchParams, hentAlleTillegg()]);
  return (
    <>
      <Melding tekst={melding} />
      <h1 className="mt-10 text-h2">Tillegg</h1>
      <p className="mt-2 max-w-[60ch] text-stone">
        Dette kan gjestene krysse av for i bookingen. Prisen vises ikke på nettsiden. Den er til eget bruk når dere lager
        prisforslag.
      </p>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {tillegg.map((t) => (
          <Skjema key={t.id} t={t} />
        ))}
        <Skjema />
      </div>
    </>
  );
}

function Skjema({ t }: { t?: TilleggRad }) {
  return (
    <form action={lagreTillegg} className="space-y-4 border border-ink/15 bg-paper p-5">
      <h2 className="text-h3">{t ? t.name : "Nytt tillegg"}</h2>
      {t && <input type="hidden" name="id" value={t.id} />}
      <label className="block">
        <span className="felt-navn">Navn</span>
        <input name="name" required defaultValue={t?.name} className="felt-inn" />
      </label>
      <label className="block">
        <span className="felt-navn">Beskrivelse</span>
        <input name="description" defaultValue={t?.description} className="felt-inn" />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="felt-navn">Pris i kroner</span>
          <input name="price" inputMode="numeric" defaultValue={t?.price ?? ""} className="felt-inn" />
        </label>
        <label className="block">
          <span className="felt-navn">Rekkefølge</span>
          <input name="sort" inputMode="numeric" defaultValue={t?.sort ?? 0} className="felt-inn" />
        </label>
      </div>
      <label className="valg">
        <input type="checkbox" name="active" defaultChecked={t?.active ?? true} />
        Vises i bookingen
      </label>
      <button className="btn btn-primary btn-small">{t ? "Lagre" : "Legg til"}</button>
    </form>
  );
}
