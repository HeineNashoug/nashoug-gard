"use client";

import * as m from "motion/react-m";

const ease = [0.22, 1, 0.36, 1] as const;

/** Toner inn og løfter innholdet når det kommer inn i bildet. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <m.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </m.div>
  );
}
