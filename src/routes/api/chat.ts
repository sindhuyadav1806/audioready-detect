import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

import {
  createLovableResponsesProvider,
  getLovableAiGatewayResponseHeaders,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are Sentinel, the voice-fraud security analyst inside VoxShield AI — a prototype platform that detects AI voice cloning and impersonation attacks on calls (Smart India Hackathon problem statement SIH26104).

Your job:
- Explain risk scores, the six detection layers (acoustic, spectral, prosody, behavioural, speaker consistency, contextual) and what a given score implies.
- Recommend concrete next actions for flagged calls: trusted callback, MFA/OTP, supervisor dual authorisation, knowledge-based questions, blocking a transaction, escalating, logging to the audit ledger.
- Coach fraud/contact-centre agents on voice-cloning attack patterns (CEO fraud, bank KYC clones, fake government officials) and multilingual Indian-language cases.

Risk bands: 0-30 LOW RISK, 31-60 MEDIUM RISK, 61-80 SUSPICIOUS, 81-100 HIGH RISK.

Rules:
- Be concise and operational: short paragraphs or tight bullet lists, no filler.
- When call context is supplied below, ground your answer in those exact numbers.
- Never claim a detection result is definitive proof of synthetic speech; scores are risk indicators from a prototype model.
- Never invent customer data, policies, or regulator rulings. If something is unknown, say so and state what to verify.
- Refuse to help create, improve, or evade detection of cloned/spoofed voices; redirect to defence.`;

type ChatRequestBody = { messages?: unknown; context?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(body.messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const initialRunId = getLovableAiGatewayRunId(request);
        const { provider, runIdFetch } = createLovableResponsesProvider(key, initialRunId);

        const context =
          typeof body.context === "string" && body.context.trim().length > 0
            ? `\n\nCurrent console context (simulated demo data):\n${body.context.slice(0, 4000)}`
            : "";

        const result = streamText({
          model: provider.responses("openai/gpt-6-astra"),
          system: `${SYSTEM_PROMPT}${context}`,
          messages: await convertToModelMessages(body.messages as UIMessage[]),
          abortSignal: request.signal,
          providerOptions: {
            openai: {
              forceReasoning: true,
              reasoningEffort: "low",
              reasoningSummary: "auto",
              store: false,
              include: ["reasoning.encrypted_content"],
            },
          },
        });

        const response = result.toUIMessageStreamResponse({
          originalMessages: body.messages as UIMessage[],
          headers: getLovableAiGatewayResponseHeaders(undefined, {
            ...(initialRunId ? { "X-Lovable-AIG-Run-ID": initialRunId } : {}),
          }),
        });

        return withLovableAiGatewayRunIdHeader(response, runIdFetch);
      },
    },
  },
});
