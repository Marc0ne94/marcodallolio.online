import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AssetCard } from "@/components/asset-card";
import { PHOTOS, assetsInPhoto, type PhotoId } from "@/data/catalog";

export const Route = createFileRoute("/foto/$id")({ component: FotoDetail });

function FotoDetail() {
  const { id } = Route.useParams();
  const photo = PHOTOS.find((p) => p.id === id);
  if (!photo) {
    return (
      <div className="space-y-4">
        <Link to="/foto" className="text-sm text-muted hover:text-fg">
          Torna all’archivio
        </Link>
        <h1 className="font-display text-3xl">Lastra non in archivio.</h1>
      </div>
    );
  }
  const assets = assetsInPhoto(photo.id as PhotoId);

  return (
    <div className="space-y-8">
      <Link
        to="/foto"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg"
      >
        <ArrowLeft className="size-4" />
        Archivio
      </Link>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-subtle">{photo.title}</p>
          <h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">{photo.angle}</h1>
          <p className="mt-2 max-w-xl text-muted">{photo.caption}</p>
        </div>
        <p className="font-mono text-xs text-subtle">file originale {photo.original}</p>
      </header>

      <figure className="overflow-hidden rounded-[var(--radius-xl)] bg-raised shadow-[var(--shadow-border)]">
        <img
          src={photo.file}
          alt={photo.caption}
          className="plate mx-auto max-h-[72vh] w-full object-contain"
        />
      </figure>

      <section className="space-y-4">
        <h2 className="font-display text-2xl tracking-tight">
          Asset in lastra
          <span className="ml-3 font-sans text-base text-muted">{assets.length}</span>
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      </section>
    </div>
  );
}
