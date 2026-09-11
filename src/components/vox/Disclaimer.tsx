import { Info } from "lucide-react";

import { PRODUCT_DISCLAIMER } from "@/lib/config";
import { cn } from "@/lib/utils";

export function Disclaimer({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border border-border bg-surface/50 p-4 text-xs leading-relaxed text-muted-foreground",
        className,
      )}
      role="note"
    >
      <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
      <p>
        {compact
          ? "Prototype analysis. Results should be treated as risk indicators and verified through independent authentication."
          : PRODUCT_DISCLAIMER}
      </p>
    </div>
  );
}
