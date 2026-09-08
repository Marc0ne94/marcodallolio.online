import { createFileRoute } from "@tanstack/react-router";
import { PhotoFrame } from "@/components/photo-frame";
import { PHOTOS, assetsInPhoto } from "@/data/catalog";

export const Route = createFileRoute("/foto/")({ component: FotoIndex });

function FotoIndex() {
  return (
    <div className="space-y-8">
      <header className="max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          Archivio fotografico
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight">Nove lastre.</h1>
        <p className="mt-3 text-muted">
          Salvate e rinominate. L’originale resta in calce a ogni scheda. Clicca una
          lastra per vedere quali asset ci appaiono.
        </p>
      </header>
      <div className="grid gap-5 sm:grid-cols-2">
        {PHOTOS.map((photo) => (
          <div key={photo.id} className="space-y-3">
            <PhotoFrame photo={photo} />
            <p className="px-1 text-sm text-muted">
              {photo.caption}{" "}
              <span className="text-subtle">· {assetsInPhoto(photo.id).length} asset</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
