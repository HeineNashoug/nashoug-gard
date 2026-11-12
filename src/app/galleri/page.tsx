import type { Metadata } from "next";
import { BookCta } from "@/components/BookCta";
import { Galleri } from "@/components/Galleri";
import { PageHeader } from "@/components/PageHeader";
import { galleriBilder, kategorier } from "@/lib/bilder";

export const metadata: Metadata = {
  alternates: { canonical: "/galleri" },
  title: "Galleri – bilder fra Potetbua og gården",
  description: "Bilder fra selskap i Potetbua og fra Nashoug Gård i Ridabu ved Hamar.",
};

export default function GalleriSide() {
  const bilder = galleriBilder();
  // Bare kategorier som faktisk har bilder, vises som filter.
  const filtre = Object.entries(kategorier)
    .filter(([id]) => bilder.some((b) => b.kategori === id))
    .map(([id, navn]) => ({ id, navn }));

  return (
    <>
      <PageHeader eyebrow="Galleri" title="Bilder fra bua og gården" lede="Trykk på et bilde for å se det større." />
      <div className="wrap pb-section">
        <Galleri bilder={bilder} filtre={filtre} />
      </div>
      <BookCta />
    </>
  );
}
