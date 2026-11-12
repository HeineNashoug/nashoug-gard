/** Toppen av undersidene. Overskriften tones ikke inn, så den er det første som tegnes. */
export function PageHeader({ eyebrow, title, lede }: { eyebrow: string; title: string; lede: string }) {
  return (
    <header className="wrap pt-14 pb-12 lg:pt-24 lg:pb-16">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-5 max-w-[16ch] text-h1">{title}</h1>
      <p className="mt-6 max-w-[38ch] font-serif text-lede">{lede}</p>
    </header>
  );
}
