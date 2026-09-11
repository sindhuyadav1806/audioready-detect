import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { toast } from "sonner";
import { RotateCcw, ShieldQuestion } from "lucide-react";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { classificationLabel } from "@/services/riskScoringService";
import { useApp } from "@/lib/store";

const STORAGE_KEY = "voxshield.assistant.v1";

const SUGGESTIONS = [
  "Explain the latest analysed call to me.",
  "A call scored 84 — what do I do next?",
  "How does speaker consistency detection work?",
  "How do I spot a CEO voice-cloning attempt?",
];

function loadMessages(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as UIMessage[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function SecurityAssistant() {
  const { calls, latestResult, metrics } = useApp();
  const [initialMessages] = useState<UIMessage[]>(() => loadMessages());
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    id: "voxshield-assistant",
    messages: initialMessages,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (error) =>
      toast.error("The assistant could not respond", { description: error.message }),
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (!busy) textareaRef.current?.focus();
  }, [busy]);

  function buildContext(): string {
    const lines: string[] = [
      `Calls analysed: ${metrics.callsAnalyzed}; threats detected: ${metrics.threatsDetected}; high risk calls: ${metrics.highRiskCalls}.`,
    ];
    if (latestResult) {
      lines.push(
        `Latest analysis ${latestResult.id}: overall risk ${latestResult.overallRiskScore}/100 (${classificationLabel(latestResult.classification)}), voice type ${latestResult.voiceType}, confidence ${latestResult.confidence}. Layers — acoustic ${latestResult.acousticScore}, spectral ${latestResult.spectralScore}, prosody ${latestResult.prosodyScore}, behavioural ${latestResult.behavioralScore}, speaker consistency ${latestResult.speakerConsistencyScore}, contextual ${latestResult.contextualRiskScore}. Language: ${latestResult.detectedLanguage}. Reasons: ${latestResult.reasons.join("; ")}.`,
      );
    }
    const recent = calls.slice(0, 5);
    if (recent.length > 0) {
      lines.push(
        `Recent calls: ${recent
          .map((call) => `${call.id} ${call.caller} risk ${call.riskScore} (${call.status})`)
          .join(" | ")}.`,
      );
    }
    return lines.join("\n");
  }

  function submit(text: string) {
    const value = text.trim();
    if (!value || busy) return;
    setInput("");
    void sendMessage({ text: value }, { body: { context: buildContext() } });
  }

  function reset() {
    setMessages([]);
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <div className="glass flex h-[calc(100vh-14rem)] min-h-[520px] flex-col rounded-2xl">
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-3">
        <div>
          <h2 className="font-display text-sm font-semibold">Sentinel — voice fraud analyst</h2>
          <p className="text-xs text-muted-foreground">
            Grounded in the latest analysis in this console. Guidance only, not legal advice.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={reset} disabled={messages.length === 0}>
          <RotateCcw className="size-4" aria-hidden /> Clear
        </Button>
      </div>

      <Conversation className="flex-1">
        <ConversationContent className="gap-4">
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<ShieldQuestion className="size-6 text-primary" aria-hidden />}
              title="Ask about any flagged call"
              description="Sentinel explains risk scores, detection layers and the safest next step."
            >
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="glass"
                    size="sm"
                    onClick={() => submit(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </ConversationEmptyState>
          ) : (
            messages.map((message) => {
              const text = message.parts
                .map((part) => (part.type === "text" ? part.text : ""))
                .join("");
              return (
                <Message key={message.id} from={message.role}>
                  <MessageContent>
                    {message.role === "assistant" ? (
                      <MessageResponse>{text}</MessageResponse>
                    ) : (
                      <span className="whitespace-pre-wrap">{text}</span>
                    )}
                  </MessageContent>
                </Message>
              );
            })
          )}
          {status === "submitted" ? (
            <Shimmer className="text-sm">Analysing...</Shimmer>
          ) : null}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border/60 p-4">
        <PromptInput
          onSubmit={(_message, event) => {
            event.preventDefault();
            submit(input);
          }}
        >
          <PromptInputTextarea
            ref={textareaRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about a risk score, a detection layer or the next action..."
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} disabled={!input.trim() || busy} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
