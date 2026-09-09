import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2, Mail, Wand2 } from "lucide-react";

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
import { generateEmail } from "@/lib/ai.functions";
import { logActivity } from "@/lib/activity";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      {
        name: "description",
        content:
          "Generate professional emails with a chosen tone, key points and length, then edit and copy the draft.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Draft formal, friendly or persuasive workplace emails in seconds.",
      },
    ],
  }),
  component: EmailPage,
});

type Tone = "Formal" | "Friendly" | "Persuasive";
type Length = "Short" | "Medium" | "Long";

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [keyPoints, setKeyPoints] = useState("");
  const [length, setLength] = useState<Length>("Medium");

  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!purpose.trim()) {
      setError("Add the purpose of the email so the assistant knows what to write.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await run({ data: { recipient, purpose, tone, keyPoints, length } });
      setOutput(result.text);
      logActivity("Smart Email Generator", purpose);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate the email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Describe the situation and get a well-structured, ready-to-edit email."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-card space-y-5 p-5 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient name</Label>
            <Input
              id="recipient"
              placeholder="e.g. Ms. Dlamini, Hiring Manager"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose of email</Label>
            <Textarea
              id="purpose"
              rows={3}
              placeholder="e.g. Request a two-day extension on the Q3 report"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Desired length</Label>
              <Select value={length} onValueChange={(v) => setLength(v as Length)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Short">Short</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="points">Key points</Label>
            <Textarea
              id="points"
              rows={5}
              placeholder="One point per line: deadline moved, reason, new date proposed…"
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
            />
          </div>

          <Button onClick={submit} disabled={loading} className="w-full sm:w-auto">
            {loading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 size-4" />
            )}
            Generate email
          </Button>
        </section>

        <OutputPanel
          title="Generated email"
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          emptyHint="Fill in the purpose and key points, then generate your draft."
          onRegenerate={submit}
          canRegenerate={Boolean(purpose.trim())}
        />
      </div>

      <Disclaimer />
    </div>
  );
}
