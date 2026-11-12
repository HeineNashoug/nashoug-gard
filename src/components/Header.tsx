"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, site } from "@/lib/site";
import { Monogram } from "./Monogram";

export function Header() {
  const pathname = usePathname();
  const menu = useRef<HTMLDialogElement>(null);
  const close = () => menu.current?.close();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream">
      <div className="wrap flex h-16 items-center justify-between gap-3 lg:h-20 lg:gap-6">
        <Link href="/" className="flex items-center gap-3">
          <Monogram className="h-12 text-brass-dark lg:h-16" />
          <span className="font-serif text-[1.25rem] leading-none whitespace-nowrap lg:text-[1.375rem]">{site.name}</span>
        </Link>

        <nav aria-label="Hovedmeny" className="hidden lg:block">
          <ul className="flex gap-8">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="label link-draw"
                  aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/book" className="btn btn-primary btn-small">
            Book
          </Link>
          <button
            type="button"
            className="label min-h-11 px-2 lg:hidden"
            aria-haspopup="dialog"
            onClick={() => menu.current?.showModal()}
          >
            Meny
          </button>
        </div>
      </div>

      <dialog ref={menu} className="menu on-dark" aria-label="Meny" data-lenis-prevent>
        <div className="flex h-full flex-col px-5 pb-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" onClick={close} aria-label={`${site.name}, forsiden`}>
              <Monogram className="h-12 text-brass-light" />
            </Link>
            <button type="button" className="label min-h-11 px-3" onClick={close}>
              Lukk
            </button>
          </div>
          <nav aria-label="Mobilmeny" className="my-auto">
            <ul className="space-y-3">
              {nav.map((item, i) => (
                <li key={item.href} style={{ "--i": i } as React.CSSProperties}>
                  <Link href={item.href} onClick={close} className="font-serif text-[2.5rem] leading-tight">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link href="/book" onClick={close} className="btn btn-light">
            Book Potetbua
          </Link>
          <p className="mt-6 text-small text-brass-light">
            <a href={site.phoneHref}>{site.phone}</a> · {site.street}, {site.postal}
          </p>
        </div>
      </dialog>
    </header>
  );
}
