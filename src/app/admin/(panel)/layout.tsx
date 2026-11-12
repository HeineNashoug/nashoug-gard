import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { loggUt } from "../actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

const lenker = [
  ["/admin", "Forespørsler"],
  ["/admin/kalender", "Kalender"],
  ["/admin/tillegg", "Tillegg"],
  ["/admin/eksport", "Last ned CSV"],
];

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="wrap py-10 lg:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brass pb-5">
        <nav aria-label="Admin" className="flex flex-wrap gap-x-6 gap-y-2">
          {lenker.map(([href, navn]) => (
            <Link key={href} href={href} prefetch={false} className="label link-draw">
              {navn}
            </Link>
          ))}
        </nav>
        <form action={loggUt}>
          <button className="label link-draw text-stone">Logg ut</button>
        </form>
      </div>
      {/* Hver side sjekker innloggingen selv (krevAdmin) før den henter noe. */}
      <Suspense fallback={<p className="mt-10 text-stone">Henter …</p>}>{children}</Suspense>
    </div>
  );
}
