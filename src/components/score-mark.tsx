import { scoreTone } from "@/lib/parks";
import { cn } from "@/lib/utils";

export function ScoreMark({
  score,
  size = "md",
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  const tone = scoreTone(score);
  return (
    <div
      className={cn(
        "flex flex-col items-end leading-none tabular-nums",
        size === "sm" && "gap-0.5",
        size === "md" && "gap-1",
        size === "lg" && "gap-1.5",
      )}
    >
      <span
        className={cn(
          "font-display font-semibold tracking-tight",
          size === "sm" && "text-lg",
          size === "md" && "text-2xl",
          size === "lg" && "text-4xl",
          tone === "good" && "text-good",
          tone === "warn" && "text-warn",
          tone === "muted" && "text-muted",
        )}
      >
        {score.toFixed(1)}
      </span>
      <span className="text-xs uppercase tracking-widest text-subtle">
        Índice
      </span>
    </div>
  );
}
