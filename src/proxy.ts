import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Fornyer Supabase-innloggingen for adminsidene, og sender ikke-innloggede til innloggingen.
 * Sidene og handlingene sjekker i tillegg selv at e-posten står på adminlisten (krevAdmin).
 */
export async function proxy(request: NextRequest) {
  let svar = NextResponse.next({ request });
  const klient = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (liste) => {
        for (const { name, value } of liste) request.cookies.set(name, value);
        svar = NextResponse.next({ request });
        for (const { name, value, options } of liste) svar.cookies.set(name, value, options);
      },
    },
  });
  const { data } = await klient.auth.getUser();

  // Ikke innlogget: send rett til innloggingen, før noe av adminpanelet vises.
  const utvikling = process.env.NODE_ENV === "development" && process.env.ADMIN_DEV_EMAIL;
  const sti = request.nextUrl.pathname;
  if (!data.user && !utvikling && sti.startsWith("/admin") && sti !== "/admin/logg-inn" && sti !== "/admin/eksport")
    return NextResponse.redirect(new URL("/admin/logg-inn", request.url));
  return svar;
}

export const config = { matcher: "/admin/:path*" };
