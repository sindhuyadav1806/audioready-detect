import { Check, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function AnalysisTimeline({
  stages,
  currentStage,
  className,
}: {
  stages: readonly string[];
  /** Index of the stage in progress; equal to stages.length when complete. */
  currentStage: number;
  className?: string | undefined;
}) {
  return (
    <ol className={cn("space-y-3", className)}>
      {stages.map((stage, index) => {
        const done = index < currentStage;
        const active = index === currentStage;
        return (
          <li key={stage} className="flex items-center gap-3">
            <span
              className={cn(
                "grid size-7 shrink-0 place-items-center rounded-full border text-xs",
                done && "border-safe/50 bg-safe/15 text-safe",
                active && "border-primary/60 bg-primary/15 text-primary animate-pulse-ring",
                !done && !active && "border-border bg-surface text-muted-foreground",
              )}
            >
              {done ? (
                <Check className="size-3.5" aria-hidden />
              ) : active ? (
                <Loader2 className="size-3.5 animate-spin" aria-hidden />
              ) : (
                index + 1
              )}
            </span>
            <span
              className={cn(
                "text-sm",
                done && "text-foreground",
                active && "font-medium text-primary",
                !done && !active && "text-muted-foreground",
              )}
            >
              {stage}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
