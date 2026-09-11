export type RiskClassification = "LOW_RISK" | "MEDIUM_RISK" | "SUSPICIOUS" | "HIGH_RISK";

export type VoiceType = "HUMAN" | "POSSIBLE_CLONE" | "AI_SUSPECTED" | "POSSIBLE_SYNTHETIC";

export type LanguageCode = "en" | "hi" | "te" | "ta" | "kn" | "ml" | "bn" | "mr";

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  native: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "mr", label: "Marathi", native: "मराठी" },
];

export interface CallContext {
  caller: string;
  callerId: string;
  knownContact: boolean;
  transactionAmount: number;
  transactionType: string;
  previousInteraction: string;
  timeOfDay: "Business hours" | "Unusual";
  historicalFraudIndicator: "Low" | "Medium" | "High";
}

export interface AnalysisMetadata {
  source: "microphone" | "upload" | "simulated-call" | "demo";
  durationSeconds: number;
  fileName?: string;
  language?: LanguageCode;
  context?: CallContext;
  scenarioId?: string;
}

export interface VoiceAnalysisResult {
  id: string;
  createdAt: string;
  overallRiskScore: number;
  classification: RiskClassification;
  voiceType: VoiceType;
  confidence: number;
  acousticScore: number;
  spectralScore: number;
  prosodyScore: number;
  behavioralScore: number;
  speakerConsistencyScore: number;
  contextualRiskScore: number;
  detectedLanguage: LanguageCode;
  possibleManipulationTypes: string[];
  explanation: string;
  reasons: string[];
  recommendedActions: string[];
  metadata: AnalysisMetadata;
}

export interface CallRecord {
  id: string;
  caller: string;
  callerId: string;
  timestamp: string;
  language: LanguageCode;
  durationSeconds: number;
  riskScore: number;
  classification: RiskClassification;
  voiceType: VoiceType;
  detection: string;
  action: string;
  status: "Safe" | "Suspicious" | "High Risk" | "Verified" | "Blocked";
}

export type AlertSeverity = "HIGH" | "SUSPICIOUS" | "VERIFICATION";

export interface SecurityAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  callId: string;
  createdAt: string;
  read: boolean;
  state: "open" | "resolved" | "escalated";
}

export type VerificationMethod = "callback" | "mfa" | "supervisor" | "knowledge";

export interface VerificationRequest {
  id: string;
  callId: string;
  method: VerificationMethod;
  status: "sent" | "completed" | "failed";
  createdAt: string;
  detail: string;
}

export interface AuditEvent {
  eventId: string;
  callId: string;
  timestamp: string;
  eventType: string;
  riskScore: number | null;
  action: string;
  hash: string;
  previousHash: string;
  status: "Verified" | "Pending";
}

export interface AttackScenario {
  id: string;
  title: string;
  summary: string;
  caller: string;
  callerId: string;
  transcript: string;
  language: LanguageCode;
  expectedRisk: number;
  context: CallContext;
}
