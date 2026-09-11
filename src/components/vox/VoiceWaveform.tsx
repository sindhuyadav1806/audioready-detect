import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Canvas waveform. When `analyser` is provided it renders real microphone
 * amplitude; otherwise it renders a synthetic (simulated call) waveform.
 */
export function VoiceWaveform({
  analyser,
  active = true,
  tone = "primary",
  height = 120,
  className,
}: {
  analyser?: AnalyserNode | null | undefined;
  active?: boolean | undefined;
  tone?: "primary" | "safe" | "medium" | "suspicious" | "critical" | undefined;
  height?: number | undefined;
  className?: string | undefined;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const data = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;
    const color = getComputedStyle(canvas).getPropertyValue(`--${tone}`).trim() || "#22d3ee";
    let t = 0;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const bars = Math.max(32, Math.floor(width / 6));
      const barWidth = width / bars;
      if (analyser && data) analyser.getByteFrequencyData(data);
      t += 0.06;

      for (let i = 0; i < bars; i++) {
        let amplitude: number;
        if (analyser && data) {
          const index = Math.floor((i / bars) * data.length * 0.7);
          amplitude = (data[index] ?? 0) / 255;
        } else {
          amplitude =
            active
              ? (Math.sin(t + i * 0.35) * 0.32 +
                  Math.sin(t * 1.7 + i * 0.11) * 0.26 +
                  Math.sin(t * 0.6 + i) * 0.18 +
                  0.42) *
                (0.55 + 0.45 * Math.sin(t * 0.4 + i * 0.02))
              : 0.04;
        }
        if (!active) amplitude *= 0.15;
        const barHeight = Math.max(2, Math.abs(amplitude) * height * 0.86);
        const x = i * barWidth;
        const y = (height - barHeight) / 2;
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.roundRect(x + barWidth * 0.2, y, barWidth * 0.6, barHeight, barWidth);
        ctx.fill();
      }
      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [analyser, active, tone, height]);

  return (
    <div className={cn("relative w-full overflow-hidden rounded-xl bg-surface/60", className)}>
      <canvas ref={canvasRef} className="w-full" style={{ height }} aria-hidden />
      {active ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-10 animate-scanline bg-gradient-to-b from-primary/25 to-transparent" />
      ) : null}
    </div>
  );
}
