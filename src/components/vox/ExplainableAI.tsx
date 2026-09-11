import { Lightbulb, ListChecks } from "lucide-react";

import type { VoiceAnalysisResult } from "@/lib/types";
import { Disclaimer } from "./Disclaimer";
import { Pill } from "./RiskBadge";

export function ExplainableAI({ result }: { result: VoiceAnalysisResult }) {
  return (
    <section className="glass rounded-2xl p-5">
      <h3 className="flex items-center gap-2 font-display text-base font-semibold">
        <ListChecks className="size-4 text-primary" aria-hidden />
        Why was this call flagged?
      </h3>
      <ul className="mt-4 space-y-2.5">
        {result.reasons.map((reason) => (
          <li key={reason} className="flex gap-2.5 text-sm">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
            <span className="text-muted-foreground">{reason}</span>
          </li>
        ))}
      </ul>

      {result.possibleManipulationTypes.length > 0 ? (
        <div className="mt-5">
          <p className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
            Possible manipulation types
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {result.possibleManipulationTypes.map((type) => (
              <Pill key={type} tone="suspicious">
                {type}
              </Pill>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-5 rounded-xl border border-primary/30 bg-primary/8 p-4">
        <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase text-primary">
          <Lightbulb className="size-3.5" aria-hidden /> AI explanation
        </p>
        <p className="mt-2 text-sm leading-relaxed">{result.explanation}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Model confidence: {(result.confidence * 100).toFixed(0)}% · Detection layers weighted by the
          prototype scoring policy.
        </p>
      </div>

      <Disclaimer compact className="mt-4" />
    </section>
  );
}
