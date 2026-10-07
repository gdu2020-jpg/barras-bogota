import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHasHydrated } from "@/lib/hydrate";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const hydrated = useHasHydrated();
  const stored = useAppStore((s) => s.favorites.includes(id));
  const isFavorite = hydrated && stored;
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      className={cn("shrink-0", className)}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(id);
      }}
    >
      <Heart
        className={cn(
          "size-4",
          isFavorite ? "fill-accent text-accent" : "text-muted",
        )}
      />
    </Button>
  );
}
