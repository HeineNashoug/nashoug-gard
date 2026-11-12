import type { Metadata } from "next";
import { Suspense } from "react";
import { loggInn } from "../actions";

export const metadata: Metadata = { title: "Logg inn", robots: { index: false } };

export default function LoggInn({ searchParams }: PageProps<"/admin/logg-inn">) {
  return (
    <section className="wrap max-w-md py-section">
      <p className="eyebrow">Admin</p>
      <h1 className="mt-5 text-h2">Logg inn</h1>
      <form action={loggInn} className="mt-8 space-y-6">
        <Suspense>
          <Feil searchParams={searchParams} />
        </Suspense>
        <div>
          <label htmlFor="epost" className="felt-navn">
            E-post
          </label>
          <input id="epost" name="epost" type="email" autoComplete="username" required className="felt-inn" />
        </div>
        <div>
          <label htmlFor="passord" className="felt-navn">
            Passord
          </label>
          <input id="passord" name="passord" type="password" autoComplete="current-password" required className="felt-inn" />
        </div>
        <button className="btn btn-primary">Logg inn</button>
      </form>
    </section>
  );
}

async function Feil({ searchParams }: Pick<PageProps<"/admin/logg-inn">, "searchParams">) {
  if (!(await searchParams).feil) return null;
  return (
    <p role="alert" className="border border-barn px-4 py-3 text-barn">
      Feil e-post eller passord.
    </p>
  );
}
