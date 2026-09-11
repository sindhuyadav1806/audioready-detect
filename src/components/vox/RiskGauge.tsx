import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { classificationLabel, classifyRisk, riskTone } from "@/services/riskScoringService";

export function RiskGauge({
  score,
  size = 220,
  label = "Impersonation risk",
  className,
}: {
  score: number;
  size?: number | undefined;
  label?: string | undefined;
  className?: string | undefined;
}) {
  const [animated, setAnimated] = useState(0);
  const tone = riskTone(classifyRisk(score));

  useEffect(() => {
    const start = performance.now();
    const from = animated;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimated(Math.round(from + (score - from) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  const stroke = Math.max(10, size * 0.055);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - (animated / 100) * 0.75);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label}: ${score} percent, ${classificationLabel(classifyRisk(score))}`}
    >
      <svg width={size} height={size} className="-rotate-[225deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.75} ${circumference}`}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`var(--${tone})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.75} ${circumference}`}
          strokeDashoffset={offset - circumference * 0.25}
          style={{ filter: `drop-shadow(0 0 10px var(--${tone}))`, transition: "stroke 0.4s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span
          className="font-display font-bold tabular-nums"
          style={{ fontSize: size * 0.24, color: `var(--${tone})` }}
        >
          {animated}%
        </span>
        <span className="mt-1 text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
          {classificationLabel(classifyRisk(score))}
        </span>
      </div>
    </div>
  );
}
