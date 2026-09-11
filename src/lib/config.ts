/**
 * Runtime configuration.
 *
 * The prototype ships with a mock inference layer. Point VITE_API_BASE_URL at a
 * real FastAPI / ML service and set VITE_USE_MOCK_INFERENCE=false to swap the
 * mock analysis for live HTTP calls (see services/voiceAnalysisService.ts).
 */
export const API_BASE_URL: string =
  (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ?? "/api/v1";

export const USE_MOCK_INFERENCE: boolean =
  (import.meta.env["VITE_USE_MOCK_INFERENCE"] as string | undefined) !== "false";

export const PRODUCT_DISCLAIMER =
  "VoxShield AI is a prototype demonstrating an architecture for AI-powered voice integrity analysis. Detection results are risk indicators and should not be treated as definitive proof of synthetic speech. Production deployment requires validated ML models, security testing, privacy review and integration with trusted verification systems.";
