import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/vox/AppShell";
import { SecurityAssistant } from "@/components/vox/SecurityAssistant";

export const Route = createFileRoute("/app/assistant")({
  component: AssistantPage,
  head: () => ({
    meta: [
      { title: "Sentinel AI Analyst | VoxShield AI" },
      {
        name: "description",
        content:
          "Chat with Sentinel, the VoxShield AI voice-fraud analyst, to interpret risk scores and choose the safest verification action.",
      },
      { property: "og:title", content: "Sentinel AI Analyst | VoxShield AI" },
      {
        property: "og:description",
        content: "AI assistant that explains voice-cloning risk scores and recommends next actions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function AssistantPage() {
  return (
    <>
      <PageHeader
        title="AI Security Analyst"
        description="Ask Sentinel about any flagged call, detection layer or verification decision. Answers are grounded in this console's latest simulated analysis."
      />
      <SecurityAssistant />
    </>
  );
}
