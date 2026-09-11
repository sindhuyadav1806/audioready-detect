import type { RiskClassification, VoiceType } from "@/lib/types";

export const DEFAULT_THRESHOLDS = {
  suspicious: 70,
  highRisk: 80,
};

/** Deterministic classification bands (0-30 / 31-60 / 61-80 / 81-100). */
export function classifyRisk(score: number): RiskClassification {
  if (score <= 30) return "LOW_RISK";
  if (score <= 60) return "MEDIUM_RISK";
  if (score <= 80) return "SUSPICIOUS";
  return "HIGH_RISK";
}

export function classificationLabel(classification: RiskClassification): string {
  switch (classification) {
    case "LOW_RISK":
      return "LOW RISK";
    case "MEDIUM_RISK":
      return "MEDIUM RISK";
    case "SUSPICIOUS":
      return "SUSPICIOUS";
    case "HIGH_RISK":
      return "HIGH RISK";
  }
}

/** Semantic token name used for badges, gauges and charts. */
export function riskTone(
  classification: RiskClassification,
): "safe" | "medium" | "suspicious" | "critical" {
  switch (classification) {
    case "LOW_RISK":
      return "safe";
    case "MEDIUM_RISK":
      return "medium";
    case "SUSPICIOUS":
      return "suspicious";
    case "HIGH_RISK":
      return "critical";
  }
}

export function toneVar(tone: "safe" | "medium" | "suspicious" | "critical"): string {
  return `var(--${tone})`;
}

export function voiceTypeForScore(score: number): VoiceType {
  if (score <= 30) return "HUMAN";
  if (score <= 60) return "HUMAN";
  if (score <= 80) return "POSSIBLE_CLONE";
  return "POSSIBLE_SYNTHETIC";
}

export function voiceTypeLabel(voiceType: VoiceType): string {
  switch (voiceType) {
    case "HUMAN":
      return "Human";
    case "POSSIBLE_CLONE":
      return "Possible Clone";
    case "AI_SUSPECTED":
      return "AI Suspected";
    case "POSSIBLE_SYNTHETIC":
      return "Possible Synthetic";
  }
}

/**
 * Weighted fusion of the individual detection layers plus contextual risk.
 * Weights are the documented prototype policy; a trained model would replace
 * this with a calibrated ensemble output.
 */
export const LAYER_WEIGHTS = {
  acoustic: 0.2,
  spectral: 0.22,
  prosody: 0.16,
  behavioral: 0.12,
  speakerConsistency: 0.2,
  contextual: 0.1,
} as const;

export function fuseScores(layers: {
  acoustic: number;
  spectral: number;
  prosody: number;
  behavioral: number;
  speakerConsistency: number;
  contextual: number;
}): number {
  const total =
    layers.acoustic * LAYER_WEIGHTS.acoustic +
    layers.spectral * LAYER_WEIGHTS.spectral +
    layers.prosody * LAYER_WEIGHTS.prosody +
    layers.behavioral * LAYER_WEIGHTS.behavioral +
    layers.speakerConsistency * LAYER_WEIGHTS.speakerConsistency +
    layers.contextual * LAYER_WEIGHTS.contextual;
  return Math.max(0, Math.min(100, Math.round(total)));
}
