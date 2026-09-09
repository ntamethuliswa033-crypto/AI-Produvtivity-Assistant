import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { FileText, Loader2, Wand2 } from "lucide-react";

import { PageHeader } from "@/components/ai/PageHeader";
import { OutputPanel } from "@/components/ai/OutputPanel";
import { Disclaimer } from "@/components/ai/Disclaimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeMeeting } from "@/lib/ai.functions";
import { logActivity } from "@/lib/activity";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workplace AI" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into a summary with key decisions, action items, deadlines and open questions.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Structured meeting records from messy notes, editable before you share them.",
      },
    ],
  }),
  component: MeetingNotesPage,
});

function MeetingNotesPage() {
  const run = useServerFn(summarizeMeeting);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!notes.trim()) {
      setError("Paste your meeting notes first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await run({ data: { title, notes } });
      setOutput(result.text);
      logActivity("Meeting Notes Summarizer", title || notes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not summarise the notes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileText}
        title="Meeting Notes Summarizer"
        description="Paste raw notes and get decisions, actions, deadlines and open questions."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-card space-y-5 p-5 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="title">Meeting title</Label>
            <Input
              id="title"
              placeholder="e.g. Q3 planning sync"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Raw meeting notes</Label>
            <Textarea
              id="notes"
              rows={16}
              placeholder="Paste everything you captured — bullet points, half sentences, names, dates…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button onClick={submit} disabled={loading} className="w-full sm:w-auto">
            {loading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 size-4" />
            )}
            Summarise notes
          </Button>
        </section>

        <OutputPanel
          title="Structured summary"
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          emptyHint="Paste your notes to get a summary, decisions, action items, deadlines and open questions."
          onRegenerate={submit}
          canRegenerate={Boolean(notes.trim())}
          rows={20}
        />
      </div>

      <Disclaimer />
    </div>
  );
}
