/** Kvittering etter en handling i adminpanelet. */
export function Melding({ tekst }: { tekst?: string | string[] }) {
  if (typeof tekst !== "string") return null;
  return (
    <p role="status" className="mt-8 border border-brass bg-parchment px-4 py-3">
      {tekst}
    </p>
  );
}
