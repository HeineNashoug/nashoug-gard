export function Monogram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 88" className={className} aria-hidden="true">
      <ellipse cx="36" cy="44" rx="34" ry="42" fill="none" stroke="currentColor" strokeWidth="1" pathLength={1} />
      <ellipse cx="36" cy="44" rx="30" ry="38" fill="none" stroke="currentColor" strokeWidth="0.6" pathLength={1} />
      <text x="36" y="54" textAnchor="middle" fontSize="31" letterSpacing="-0.5" fill="currentColor" className="font-serif">
        NG
      </text>
    </svg>
  );
}
