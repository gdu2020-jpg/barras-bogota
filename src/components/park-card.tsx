import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { FavoriteButton } from "@/components/favorite-button";
import { ScoreMark } from "@/components/score-mark";
import { Badge } from "@/components/ui/badge";
import { EQUIPMENT_LABEL, KIND_LABEL, type Park } from "@/lib/parks";
import { cn } from "@/lib/utils";

export function ParkCard({
  park,
  distanceLabel,
  compact = false,
  selected = false,
  onSelect,
}: {
  park: Park;
  distanceLabel?: string;
  compact?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <article
      className={cn(
        "min-w-0 overflow-hidden rounded-xl border bg-surface transition-[border-color,transform] duration-150",
        selected ? "border-accent" : "border-border hover:border-muted",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex w-full text-left"
      >
        <img
          src={park.image}
          alt=""
          className={cn(
            "shrink-0 object-cover",
            compact ? "h-24 w-24" : "h-28 w-32 sm:h-32 sm:w-40",
          )}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2 p-3 sm:p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={park.kind === "calistenia" ? "accent" : "outline"}
                >
                  {KIND_LABEL[park.kind]}
                </Badge>
                {park.source === "community" && (
                  <Badge variant="good">Aporte</Badge>
                )}
                <span className="text-xs text-muted">
                  {park.city === "Bogotá" ? park.localidad : park.city}
                </span>
              </div>
              <h2 className="mt-1 truncate font-display text-base font-semibold tracking-tight">
                {park.shortName}
              </h2>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-subtle">
                <MapPin className="size-3 shrink-0" />
                <span className="truncate">
                  {distanceLabel ? `${distanceLabel} · ` : ""}
                  {park.address}
                </span>
              </p>
            </div>
            <ScoreMark score={park.score} size="sm" />
          </div>
          {!compact && (
            <p className="hidden text-xs text-muted sm:line-clamp-2">
              {park.equipment
                .slice(0, 4)
                .map((e) => EQUIPMENT_LABEL[e])
                .join(" · ")}
            </p>
          )}
        </div>
      </button>
      <div className="flex items-center justify-between border-t border-border px-3 py-2">
        <Link
          to="/parque/$id"
          params={{ id: park.id }}
          className="text-xs font-medium text-accent hover:underline"
        >
          Ver estación
        </Link>
        <FavoriteButton id={park.id} className="size-9" />
      </div>
    </article>
  );
}
