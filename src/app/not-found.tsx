import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap py-section">
      <p className="eyebrow">404</p>
      <h1 className="mt-5 text-h1">Denne siden finnes ikke</h1>
      <p className="mt-6 max-w-[46ch]">Lenken kan være gammel, eller siden er ikke lagt ut ennå.</p>
      <Link href="/" className="btn btn-primary mt-8">
        Til forsiden
      </Link>
    </section>
  );
}
