import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/stormo")({ component: StormoArchive });

function StormoArchive() {
  return (
    <div className="mx-auto max-w-xl space-y-6 py-16">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
        Archivio · non in produzione
      </p>
      <h1 className="font-display text-4xl tracking-tight">Stormo</h1>
      <p className="text-base leading-relaxed text-muted">
        Separazione, allineamento, coesione. I sei ragazzi restano. Non si
        butta. In fondo i corpi diventano insetti e il banco si anima. Non ora.
      </p>
      <p className="text-sm text-subtle">Sorgente in archive/stormo. Stesso repo.</p>
      <Link to="/" className="inline-block text-sm text-fg underline-offset-4 hover:underline">
        Torna al banco
      </Link>
    </div>
  );
}
