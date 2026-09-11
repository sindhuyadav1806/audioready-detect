import { Activity, AudioLines, BrainCircuit, Fingerprint, Radar, Waves } from "lucide-react";

import type { VoiceAnalysisResult } from "@/lib/types";

const LAYERS = [
  { key: "acousticScore", label: "Acoustic Analysis", icon: AudioLines },
  { key: "spectralScore", label: "Spectral Analysis", icon: Waves },
  { key: "prosodyScore", label: "Prosody Analysis", icon: Activity },
  { key: "behavioralScore", label: "Behavioral Analysis", icon: BrainCircuit },
  { key: "speakerConsistencyScore", label: "Speaker Consistency", icon: Fingerprint },
  { key: "contextualRiskScore", label: "Contextual Risk", icon: Radar },
] as const;

function tone(value: number): string {
  if (value <= 30) return "var(--safe)";
  if (value <= 60) return "var(--medium)";
  if (value <= 80) return "var(--suspicious)";
  return "var(--critical)";
}

export function DetectionBreakdown({ result }: { result: VoiceAnalysisResult }) {
  return (
    <div className="space-y-4">
      {LAYERS.map(({ key, label, icon: Icon }) => {
        const value = result[key];
        return (
          <div key={key}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 font-medium">
                <Icon className="size-4 text-muted-foreground" aria-hidden />
                {label}
              </span>
              <span className="tabular-nums text-muted-foreground">
                <span className="font-semibold" style={{ color: tone(value) }}>
                  {value}%
                </span>{" "}
                {value > 60 ? "suspicious" : value > 30 ? "inconclusive" : "consistent"}
              </span>
            </div>
            <div
              className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={value}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={label}
            >
              <div
                className="h-full rounded-full transition-[width] duration-700 ease-out"
                style={{ width: `${value}%`, backgroundColor: tone(value) }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
