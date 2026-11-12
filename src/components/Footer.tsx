import Link from "next/link";
import { nav, site } from "@/lib/site";
import { Monogram } from "./Monogram";

export function Footer() {
  return (
    <footer className="on-dark bg-forest-deep text-cream">
      <div className="wrap grid gap-12 py-16 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-5">
          <Monogram className="h-28 text-brass-light" />
          <p className="mt-6 max-w-[22ch] font-serif text-h3">
            Festlokalet Potetbua på {site.name}, like utenfor Hamar.
          </p>
        </div>

        <div className="lg:col-span-3">
          <h2 className="eyebrow">Besøk og kontakt</h2>
          <address className="mt-5 space-y-1 not-italic">
            <p>{site.street}</p>
            <p>{site.postal}</p>
            <p className="pt-3">
              <a href={site.phoneHref} className="link-draw">
                {site.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${site.email}`} className="link-draw break-all">
                {site.email}
              </a>
            </p>
          </address>
        </div>

        <nav aria-label="Bunnmeny" className="lg:col-span-2">
          <h2 className="eyebrow">Sider</h2>
          <ul className="mt-5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-draw">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-2">
          <Link href="/book" className="btn btn-light w-full">
            Book Potetbua
          </Link>
        </div>
      </div>
      <div className="border-t border-cream/15">
        <p className="wrap py-6 text-small text-brass-light">© {site.name}</p>
      </div>
    </footer>
  );
}
