import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const adminEposter = () =>
  (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

/** Supabase-klient som leser og skriver innloggingen i informasjonskapsler. */
export async function supabase() {
  const kapsler = await cookies();
  return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => kapsler.getAll(),
      setAll: (liste) => {
        try {
          for (const { name, value, options } of liste) kapsler.set(name, value, options);
        } catch {
          // Kalt fra en side som ikke kan skrive kapsler. proxy.ts fornyer innloggingen.
        }
      },
    },
  });
}

/** E-posten til den innloggede, hvis den står på listen i ADMIN_EMAILS. Ellers null. */
export async function hentAdmin(): Promise<string | null> {
  // Bare under lokal utvikling (`npm run dev`): hopp over innlogging når ADMIN_DEV_EMAIL er satt.
  if (process.env.NODE_ENV === "development" && process.env.ADMIN_DEV_EMAIL) return process.env.ADMIN_DEV_EMAIL;
  const { data } = await (await supabase()).auth.getUser();
  const epost = data.user?.email?.toLowerCase();
  return epost && adminEposter().includes(epost) ? epost : null;
}

export async function krevAdmin() {
  const admin = await hentAdmin();
  if (!admin) redirect("/admin/logg-inn");
  return admin;
}
