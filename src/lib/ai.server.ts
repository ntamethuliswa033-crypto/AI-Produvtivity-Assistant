const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/responses";
const MODEL = "openai/gpt-6-astra";

export type GatewayMessage = { role: "user" | "assistant"; text: string };

export class AiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function friendly(status: number, message: string): string {
  if (status === 402) return message || "AI credits are exhausted. Please add credits to continue.";
  if (status === 403) return message || "AI access is currently blocked for this workspace.";
  if (status === 429) return "The assistant is busy right now. Please try again in a moment.";
  if (status >= 500) return "The assistant is temporarily unavailable. Please try again.";
  return message || "The assistant could not complete this request.";
}

/**
 * Calls the Lovable AI Gateway (Responses API) with streaming enabled and
 * accumulates the final text server-side.
 */
export async function generateText({
  system,
  messages,
}: {
  system: string;
  messages: GatewayMessage[];
}): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new AiError("AI is not configured for this app.", 500);

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: MODEL,
      instructions: system,
      input: messages.map((m) => ({
        role: m.role,
        content: [{ type: m.role === "assistant" ? "output_text" : "input_text", text: m.text }],
      })),
      stream: true,
      reasoning: { effort: "low", summary: "auto" },
    }),
  });

  if (!res.ok || !res.body) {
    let message = "";
    try {
      const data = (await res.json()) as { error?: { message?: string }; message?: string };
      message = data?.error?.message ?? data?.message ?? "";
    } catch {
      /* ignore */
    }
    throw new AiError(friendly(res.status, message), res.status);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const event = JSON.parse(payload) as {
          type?: string;
          delta?: string;
          response?: { output_text?: string };
        };
        if (event.type === "response.output_text.delta" && typeof event.delta === "string") {
          text += event.delta;
        } else if (event.type === "response.completed" && !text) {
          text = event.response?.output_text ?? "";
        }
      } catch {
        /* ignore malformed chunk */
      }
    }
  }

  if (!text.trim()) {
    throw new AiError("The assistant returned an empty response. Please try again.", 502);
  }
  return text.trim();
}
