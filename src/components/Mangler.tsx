/** Tydelig merket hull i innholdet. Skal ikke være igjen ved lansering. */
export function Mangler({ children }: { children: React.ReactNode }) {
  return (
    <p className="border border-barn px-4 py-3 text-small text-barn">
      <span className="label mr-2">Mangler</span>
      {children}
    </p>
  );
}
