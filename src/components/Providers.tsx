"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import Lenis from "lenis";

export function Providers({ children }: { children: React.ReactNode }) {
  const lenis = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis.current = new Lenis({ autoRaf: true, anchors: true });
    return () => lenis.current?.destroy();
  }, []);

  // Lenis husker forrige sides posisjon. Ny side skal starte på toppen, eller ved ankeret i adressen.
  useEffect(() => {
    const anker = location.hash ? document.querySelector<HTMLElement>(location.hash) : null;
    const y = anker
      ? anker.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(anker).scrollMarginTop)
      : 0;
    lenis.current?.scrollTo(y, { immediate: true, force: true });
  }, [pathname]);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
