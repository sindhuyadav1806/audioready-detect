import { API_BASE_URL, USE_MOCK_INFERENCE } from "@/lib/config";
import type {
  AnalysisMetadata,
  CallContext,
  LanguageCode,
  VoiceAnalysisResult,
} from "@/lib/types";
import { classifyRisk, fuseScores, voiceTypeForScore } from "./riskScoringService";

/**
 * Mock AI inference layer.
 *
 * `analyzeVoice()` is the single seam between the UI and voice-integrity
 * inference. Swap the mock branch for the HTTP branch (POST
 * `${API_BASE_URL}/analyze-voice`) once a trained model is available — the
 * returned `VoiceAnalysisResult` contract stays identical.
 *
 * Scores are deterministic: identical audio + metadata always produce the same
 * result. Nothing here is a scientifically validated detector.
 */

/** Stable 32-bit hash, used as the deterministic seed. */
function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededSequence(seed: number) {
  let state = seed || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 4294967296;
  };
}

function clamp(value: number, min = 2, max = 98): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

async function fingerprintAudio(audio: Blob | ArrayBuffer | string): Promise<string> {
  if (typeof audio === "string") return audio;
  const buffer = audio instanceof Blob ? await audio.arrayBuffer() : audio;
  const bytes = new Uint8Array(buffer);
  let sum = 0;
  const step = Math.max(1, Math.floor(bytes.length / 4096));
  for (let i = 0; i < bytes.length; i += step) sum = (sum + bytes[i]! * (i + 1)) % 4294967291;
  return `${bytes.length}:${sum}`;
}

function contextualScore(context?: CallContext): number {
  if (!context) return 28;
  let score = 20;
  if (!context.knownContact) score += 22;
  if (context.transactionAmount >= 500000) score += 20;
  else if (context.transactionAmount >= 100000) score += 12;
  if (context.timeOfDay === "Unusual") score += 12;
  if (context.previousInteraction === "None") score += 10;
  if (context.historicalFraudIndicator === "High") score += 14;
  else if (context.historicalFraudIndicator === "Medium") score += 8;
  return clamp(score);
}

function buildReasons(
  layers: {
    acoustic: number;
    spectral: number;
    prosody: number;
    behavioral: number;
    speakerConsistency: number;
    contextual: number;
  },
  context?: CallContext,
): string[] {
  const reasons: string[] = [];
  if (layers.spectral > 60) reasons.push("Unusual spectral patterns detected in higher frequency bands");
  if (layers.acoustic > 60)
    reasons.push("Speech contains characteristics commonly associated with synthetic generation");
  if (layers.prosody > 60) reasons.push("Pitch variation appears unusually consistent across the sample");
  if (layers.behavioral > 60)
    reasons.push("Pause distribution differs from historical speaker samples");
  if (layers.speakerConsistency > 60)
    reasons.push("Speaker identity consistency across the sample is low");
  if (layers.contextual > 60 && context)
    reasons.push("Call context indicates elevated transaction risk");
  if (reasons.length === 0) {
    reasons.push("Acoustic and spectral features fall inside the expected natural speech profile");
    reasons.push("Prosody variability and pause distribution look organic");
    reasons.push("Speaker identity remained consistent across the sample");
  }
  return reasons;
}

function buildManipulationTypes(score: number, seq: () => number): string[] {
  if (score <= 30) return [];
  const pool = [
    "Text-to-speech synthesis",
    "Voice conversion / cloning",
    "Neural vocoder artefacts",
    "Replay of recorded speech",
    "Spliced / edited audio",
    "Background noise injection",
  ];
  const count = score > 80 ? 3 : score > 60 ? 2 : 1;
  const picked: string[] = [];
  while (picked.length < count) {
    const candidate = pool[Math.floor(seq() * pool.length)]!;
    if (!picked.includes(candidate)) picked.push(candidate);
  }
  return picked;
}

function buildActions(score: number): string[] {
  if (score > 80)
    return [
      "Do not approve the transaction",
      "Call back using the saved trusted number",
      "Request MFA / OTP verification",
      "Escalate to a supervisor for approval",
      "Log the event to the tamper-evident audit ledger",
    ];
  if (score > 60)
    return [
      "Hold the request pending secondary verification",
      "Request MFA / OTP verification",
      "Ask a predefined knowledge-based security question",
    ];
  if (score > 30)
    return [
      "Continue with standard verification procedures",
      "Confirm transaction details on a second channel",
    ];
  return ["Continue normal verification procedures"];
}

function explanationFor(score: number): string {
  if (score > 80)
    return "Multiple voice characteristics were inconsistent with the expected natural speech profile. The system therefore classified this call as potentially synthetic or impersonated.";
  if (score > 60)
    return "Some voice characteristics deviate from the expected natural speech profile. The sample is not conclusive, so secondary verification is recommended before acting on the request.";
  if (score > 30)
    return "Most voice characteristics look natural, with minor deviations that may be caused by channel quality, compression or background noise.";
  return "Voice characteristics are consistent with natural human speech across every detection layer analysed by the prototype.";
}

/** Rough language guess from metadata; production would use an ASR/LID model. */
function detectLanguage(metadata: AnalysisMetadata, seq: () => number): LanguageCode {
  if (metadata.language) return metadata.language;
  const pool: LanguageCode[] = ["en", "hi", "te", "ta", "kn", "ml", "bn", "mr"];
  return pool[Math.floor(seq() * pool.length)]!;
}

export interface AnalyzeVoiceOptions {
  /** Bias the deterministic layers towards a scenario target (demo scenarios). */
  targetRisk?: number;
}

export async function analyzeVoice(
  audioData: Blob | ArrayBuffer | string,
  metadata: AnalysisMetadata,
  options: AnalyzeVoiceOptions = {},
): Promise<VoiceAnalysisResult> {
  if (!USE_MOCK_INFERENCE) {
    const form = new FormData();
    if (audioData instanceof Blob) form.append("audio", audioData, metadata.fileName ?? "audio.webm");
    form.append("metadata", JSON.stringify(metadata));
    const response = await fetch(`${API_BASE_URL}/analyze-voice`, { method: "POST", body: form });
    if (!response.ok) throw new Error(`Inference service returned ${response.status}`);
    return (await response.json()) as VoiceAnalysisResult;
  }

  const fingerprint = await fingerprintAudio(audioData);
  const seed = hashString(`${fingerprint}|${metadata.source}|${metadata.fileName ?? ""}|${metadata.scenarioId ?? ""}`);
  const seq = seededSequence(seed);

  const contextual = contextualScore(metadata.context);
  const base = options.targetRisk ?? clamp(18 + seq() * 74);

  const spread = (offset: number) => clamp(base + (seq() - 0.5) * 18 + offset);
  const layers = {
    acoustic: spread(3),
    spectral: spread(5),
    prosody: spread(-6),
    behavioral: spread(-2),
    speakerConsistency: spread(6),
    contextual,
  };

  const overallRiskScore = options.targetRisk ?? fuseScores(layers);
  const classification = classifyRisk(overallRiskScore);
  const confidence = Number((0.72 + Math.abs(overallRiskScore - 50) / 250).toFixed(2));

  await new Promise((resolve) => setTimeout(resolve, 350));

  return {
    id: `VA-${seed.toString(16).slice(0, 6).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    overallRiskScore,
    classification,
    voiceType: voiceTypeForScore(overallRiskScore),
    confidence,
    acousticScore: layers.acoustic,
    spectralScore: layers.spectral,
    prosodyScore: layers.prosody,
    behavioralScore: layers.behavioral,
    speakerConsistencyScore: layers.speakerConsistency,
    contextualRiskScore: layers.contextual,
    detectedLanguage: detectLanguage(metadata, seq),
    possibleManipulationTypes: buildManipulationTypes(overallRiskScore, seq),
    explanation: explanationFor(overallRiskScore),
    reasons: buildReasons(layers, metadata.context),
    recommendedActions: buildActions(overallRiskScore),
    metadata,
  };
}

export const ANALYSIS_STAGES = [
  "Audio preprocessing",
  "Acoustic feature extraction",
  "Spectral analysis",
  "Prosody analysis",
  "Speaker consistency check",
  "Contextual analysis",
  "Risk calculation",
] as const;
