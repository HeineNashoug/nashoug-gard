const petal = "M12 11.2C9.4 8.6 9.6 4.6 12 2.6c2.4 2 2.6 6 0 8.6z";

/** Potetblomst i strek. */
export function Blomst({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      {[0, 72, 144, 216, 288].map((r) => (
        <path key={r} d={petal} transform={`rotate(${r} 12 12)`} />
      ))}
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Skillelinje mellom seksjoner: potetblomst mellom to messinglinjer. */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`wrap flex items-center gap-5 text-brass-dark ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-brass" />
      <Blomst className="size-6" />
      <span className="h-px flex-1 bg-brass" />
    </div>
  );
}
