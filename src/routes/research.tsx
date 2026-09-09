import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { BookOpen, Info, Loader2, Wand2 } from "lucide-react";

import { PageHeader } from "@/components/ai/PageHeader";
import { OutputPanel } from "@/components/ai/OutputPanel";
import { Disclaimer } from "@/components/ai/Disclaimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { researchTopic } from "@/lib/ai.functions";
import { logActivity } from "@/lib/activity";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workplace AI" },
      {
        name: "description",
        content:
          "Get a briefing on any workplace topic with a summary, key insights and recommendations at your chosen depth.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      {
        property: "og:description",
        content: "Short, medium or detailed briefings on workplace topics, with facts to verify.",
      },
    ],
  }),
  component: ResearchPage,
});

type Depth = "Short" | "Medium" | "Detailed";

function ResearchPage() {
  const run = useServerFn(researchTopic);
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [depth, setDepth] = useState<Depth>("Medium");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!topic.trim()) {
      setError("Enter a research topic to get started.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await run({ data: { topic, notes, depth } });
      setOutput(result.text);
      logActivity("AI Research Assistant", topic);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not complete the research brief.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={BookOpen}
        title="AI Research Assistant"
        description="Brief yourself on a work topic with insights and practical recommendations."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-card space-y-5 p-5 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Research topic</Label>
            <Input
              id="topic"
              placeholder="e.g. Hybrid work policies for small teams"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Output depth</Label>
            <Select value={depth} onValueChange={(v) => setDepth(v as Depth)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Short">Short</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Detailed">Detailed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="context">Notes or article text (optional)</Label>
            <Textarea
              id="context"
              rows={10}
              placeholder="Paste an article, report extract or your own notes to ground the research."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0" />
            Verify important facts, figures and quotes with a trusted source before sharing.
          </div>

          <Button onClick={submit} disabled={loading} className="w-full sm:w-auto">
            {loading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 size-4" />
            )}
            Research topic
          </Button>
        </section>

        <OutputPanel
          title="Research brief"
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          emptyHint="Enter a topic and depth to receive a summary, insights and recommendations."
          onRegenerate={submit}
          canRegenerate={Boolean(topic.trim())}
          rows={20}
        />
      </div>

      <Disclaimer />
    </div>
  );
}
