import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { Loader2, MessagesSquare, RotateCcw, Send, TriangleAlert } from "lucide-react";

import { PageHeader } from "@/components/ai/PageHeader";
import { Disclaimer } from "@/components/ai/Disclaimer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chatWithAssistant } from "@/lib/ai.functions";
import { logActivity } from "@/lib/activity";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Workplace AI" },
      {
        name: "description",
        content:
          "Chat with a professional workplace assistant about emails, meetings, planning and research.",
      },
      { property: "og:title", content: "AI Workplace Chatbot" },
      {
        property: "og:description",
        content: "Ask the assistant to draft, summarise, plan or research — in a concise chat.",
      },
    ],
  }),
  component: ChatPage,
});

type Message = { role: "user" | "assistant"; text: string };

const suggestions = [
  "Draft an email",
  "Summarize notes",
  "Plan my tasks",
  "Research a topic",
  "Help me organize my day",
];

function ChatPage() {
  const run = useServerFn(chatWithAssistant);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const nextMessages: Message[] = [...messages, { role: "user", text: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const result = await run({ data: { messages: nextMessages } });
      setMessages([...nextMessages, { role: "assistant", text: result.text }]);
      logActivity("AI Chatbot", trimmed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The assistant could not reply.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          icon={MessagesSquare}
          title="AI Chatbot"
          description="A professional assistant for anything on your workday."
        />
        {messages.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setMessages([]);
              setError(null);
              inputRef.current?.focus();
            }}
          >
            <RotateCcw className="mr-2 size-4" /> New conversation
          </Button>
        )}
      </div>

      <section className="surface-card flex h-[60vh] min-h-[420px] flex-col p-4 sm:p-6">
        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {messages.length === 0 && !loading && (
            <div className="grid h-full place-items-center text-center">
              <div className="max-w-sm">
                <MessagesSquare className="mx-auto mb-3 size-6 text-muted-foreground" />
                <p className="text-sm font-medium">Start a conversation</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ask a question or pick one of the suggestions below.
                </p>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={`${index}-${message.role}`}
              className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap text-sm leading-relaxed sm:max-w-[75%]",
                  message.role === "user"
                    ? "rounded-2xl bg-primary px-4 py-2.5 text-primary-foreground"
                    : "text-foreground",
                )}
              >
                {message.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Thinking…
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm">
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
              <p className="text-muted-foreground">{error}</p>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="mt-4 space-y-3 border-t border-border pt-4">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => send(suggestion)}
                disabled={loading}
                className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2"
          >
            <Textarea
              ref={inputRef}
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask the assistant anything about your work…"
              className="min-h-[56px] flex-1 resize-none"
              aria-label="Message"
            />
            <Button type="submit" size="icon" className="size-11" disabled={loading || !input.trim()}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </section>

      <Disclaimer />
    </div>
  );
}
