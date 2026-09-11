import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { DEMO_ALERTS, DEMO_CALLS, DASHBOARD_METRICS } from "./demoData";
import type {
  AuditEvent,
  CallRecord,
  LanguageCode,
  SecurityAlert,
  VerificationRequest,
  VoiceAnalysisResult,
} from "./types";
import { alertFromAnalysis } from "@/services/alertService";
import { createAuditEvent, seedAuditChain, type AuditInput } from "@/services/auditService";
import { classifyRisk, voiceTypeForScore } from "@/services/riskScoringService";

export type UserRole = "Security Analyst" | "Bank Employee" | "Administrator" | "Enterprise User";

export interface SessionUser {
  name: string;
  email: string;
  organization: string;
  role: UserRole;
  isDemo: boolean;
}

export interface AppSettings {
  riskThreshold: number;
  highRiskThreshold: number;
  alertSms: boolean;
  alertEmail: boolean;
  alertInApp: boolean;
  requireMfaHighRisk: boolean;
  requireCallbackHighValue: boolean;
  escalateExecutiveImpersonation: boolean;
  organizationName: string;
  industry: string;
  defaultLanguage: LanguageCode;
  minimalRetention: boolean;
  featureOnlyLogging: boolean;
  edgeProcessing: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  riskThreshold: 70,
  highRiskThreshold: 80,
  alertSms: true,
  alertEmail: true,
  alertInApp: true,
  requireMfaHighRisk: true,
  requireCallbackHighValue: true,
  escalateExecutiveImpersonation: true,
  organizationName: "Meridian National Bank",
  industry: "Banking & Financial Services",
  defaultLanguage: "en",
  minimalRetention: true,
  featureOnlyLogging: true,
  edgeProcessing: true,
};

interface AppState {
  hydrated: boolean;
  user: SessionUser | null;
  calls: CallRecord[];
  alerts: SecurityAlert[];
  audit: AuditEvent[];
  verifications: VerificationRequest[];
  settings: AppSettings;
  latestResult: VoiceAnalysisResult | null;
  results: VoiceAnalysisResult[];
  metrics: typeof DASHBOARD_METRICS;
  apiKey: string | null;
  signIn: (user: SessionUser) => void;
  signOut: () => void;
  recordAnalysis: (result: VoiceAnalysisResult, callerName?: string) => CallRecord;
  addAudit: (input: AuditInput) => AuditEvent;
  addVerification: (request: VerificationRequest) => void;
  updateVerification: (request: VerificationRequest) => void;
  markAlertRead: (id: string) => void;
  markAllAlertsRead: () => void;
  setAlertState: (id: string, state: SecurityAlert["state"]) => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
  setApiKey: (key: string) => void;
  resultForCall: (callId: string) => VoiceAnalysisResult | undefined;
}

const AppContext = createContext<AppState | null>(null);

const STORAGE_KEY = "voxshield.state.v1";

interface Persisted {
  user: SessionUser | null;
  calls: CallRecord[];
  alerts: SecurityAlert[];
  audit: AuditEvent[];
  verifications: VerificationRequest[];
  settings: AppSettings;
  results: VoiceAnalysisResult[];
  apiKey: string | null;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [calls, setCalls] = useState<CallRecord[]>(DEMO_CALLS);
  const [alerts, setAlerts] = useState<SecurityAlert[]>(DEMO_ALERTS);
  const [audit, setAudit] = useState<AuditEvent[]>([]);
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [results, setResults] = useState<VoiceAnalysisResult[]>([]);
  const [apiKey, setApiKeyState] = useState<string | null>(null);

  useEffect(() => {
    let restored = false;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Persisted>;
        if (parsed.user) setUser(parsed.user);
        if (parsed.calls?.length) setCalls(parsed.calls);
        if (parsed.alerts?.length) setAlerts(parsed.alerts);
        if (parsed.audit?.length) setAudit(parsed.audit);
        if (parsed.verifications) setVerifications(parsed.verifications);
        if (parsed.settings) setSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
        if (parsed.results) setResults(parsed.results);
        if (parsed.apiKey) setApiKeyState(parsed.apiKey);
        restored = Boolean(parsed.audit?.length);
      }
    } catch {
      /* corrupted storage is ignored; demo data is used instead */
    }
    if (!restored) setAudit(seedAuditChain());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const payload: Persisted = {
      user,
      calls,
      alerts,
      audit,
      verifications,
      settings,
      results: results.slice(0, 30),
      apiKey,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* storage full or unavailable — the prototype keeps working in memory */
    }
  }, [hydrated, user, calls, alerts, audit, verifications, settings, results, apiKey]);

  const addAudit = useCallback((input: AuditInput) => {
    let created: AuditEvent | null = null;
    setAudit((prev) => {
      created = createAuditEvent(input, prev);
      return [...prev, created];
    });
    return (
      created ?? {
        ...createAuditEvent(input, []),
      }
    );
  }, []);

  const recordAnalysis = useCallback(
    (result: VoiceAnalysisResult, callerName?: string) => {
      const caller = callerName ?? result.metadata.context?.caller ?? "Unknown Caller";
      const call: CallRecord = {
        id: `CALL-${Math.floor(90500 + Math.random() * 400)}`,
        caller,
        callerId: result.metadata.context?.callerId ?? "Not provided",
        timestamp: result.createdAt,
        language: result.detectedLanguage,
        durationSeconds: Math.round(result.metadata.durationSeconds),
        riskScore: result.overallRiskScore,
        classification: classifyRisk(result.overallRiskScore),
        voiceType: voiceTypeForScore(result.overallRiskScore),
        detection:
          result.possibleManipulationTypes[0] ?? "No manipulation indicators",
        action: result.overallRiskScore > 80 ? "Blocked" : result.overallRiskScore > 60 ? "Secondary verification" : "Allowed",
        status:
          result.overallRiskScore > 80
            ? "High Risk"
            : result.overallRiskScore > 60
              ? "Suspicious"
              : "Safe",
      };

      setCalls((prev) => [call, ...prev]);
      setResults((prev) => [{ ...result, id: call.id }, ...prev]);

      const alert = alertFromAnalysis(result, call.id);
      if (alert) setAlerts((prev) => [alert, ...prev]);

      setAudit((prev) => {
        const next = [...prev];
        next.push(
          createAuditEvent(
            {
              callId: call.id,
              eventType: "VOICE_ANALYSIS_COMPLETED",
              action: call.action,
              riskScore: call.riskScore,
            },
            next,
          ),
        );
        if (call.riskScore > 80) {
          next.push(
            createAuditEvent(
              {
                callId: call.id,
                eventType: "HIGH_RISK_DETECTED",
                action: "Transaction blocked",
                riskScore: call.riskScore,
              },
              next,
            ),
          );
        }
        return next;
      });

      return call;
    },
    [],
  );

  const value = useMemo<AppState>(
    () => ({
      hydrated,
      user,
      calls,
      alerts,
      audit,
      verifications,
      settings,
      results,
      latestResult: results[0] ?? null,
      metrics: DASHBOARD_METRICS,
      apiKey,
      signIn: (nextUser) => setUser(nextUser),
      signOut: () => setUser(null),
      recordAnalysis,
      addAudit,
      addVerification: (request) => setVerifications((prev) => [request, ...prev]),
      updateVerification: (request) =>
        setVerifications((prev) => prev.map((item) => (item.id === request.id ? request : item))),
      markAlertRead: (id) =>
        setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a))),
      markAllAlertsRead: () => setAlerts((prev) => prev.map((a) => ({ ...a, read: true }))),
      setAlertState: (id, state) =>
        setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, state, read: true } : a))),
      updateSettings: (patch) => setSettings((prev) => ({ ...prev, ...patch })),
      setApiKey: (key) => setApiKeyState(key),
      resultForCall: (callId) => results.find((r) => r.id === callId),
    }),
    [hydrated, user, calls, alerts, audit, verifications, settings, results, apiKey, recordAnalysis, addAudit],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside <AppProvider>");
  return context;
}

export const DEMO_USER: SessionUser = {
  name: "Ananya Sharma",
  email: "analyst@voxshield.ai",
  organization: "Meridian National Bank",
  role: "Security Analyst",
  isDemo: true,
};
