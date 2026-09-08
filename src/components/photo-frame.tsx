import { Link } from "@tanstack/react-router";
import type { Photo } from "@/data/catalog";
import { cn } from "@/lib/cn";

export function PhotoFrame({
  photo,
  className,
  priority,
}: {
  photo: Photo;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link
      to="/foto/$id"
      params={{ id: photo.id }}
      className={cn(
        "group block overflow-hidden rounded-[var(--radius-lg)] bg-raised shadow-[var(--shadow-border)]",
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          photo.aspect === "portrait" ? "aspect-[3/4]" : "aspect-[4/3]",
        )}
      >
        <img
          src={photo.file}
          alt={photo.caption}
          className="plate h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          loading={priority ? "eager" : "lazy"}
        />
      </div>
      <div className="flex items-end justify-between gap-3 px-4 py-3">
        <div>
          <p className="font-mono text-[11px] tracking-[0.16em] text-subtle">{photo.title}</p>
          <p className="mt-1 text-sm text-fg">{photo.angle}</p>
        </div>
        <p className="max-w-[50%] text-right text-xs text-muted">{photo.original}</p>
      </div>
    </Link>
  );
}
