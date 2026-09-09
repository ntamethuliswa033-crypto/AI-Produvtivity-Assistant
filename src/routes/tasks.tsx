import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ListChecks, Loader2, Wand2 } from "lucide-react";

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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { planTasks } from "@/lib/ai.functions";
import { logActivity } from "@/lib/activity";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workplace AI" },
      {
        name: "description",
        content:
          "Turn a task list into a prioritised plan and realistic daily or weekly schedule that fits your available hours.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "Prioritise your workload and get a schedule that fits the hours you actually have.",
      },
    ],
  }),
  component: TaskPlannerPage,
});

type Priority = "Low" | "Medium" | "High" | "Urgent";
type Mode = "Daily" | "Weekly";

function TaskPlannerPage() {
  const run = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [dueDates, setDueDates] = useState("");
  const [hours, setHours] = useState("6");
  const [mode, setMode] = useState<Mode>("Daily");

  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!tasks.trim()) {
      setError("Add at least one task to plan.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await run({ data: { tasks, priority, dueDates, hours, mode } });
      setOutput(result.text);
      logActivity("AI Task Planner", `${mode} plan — ${tasks.split("\n")[0] ?? ""}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not build the plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ListChecks}
        title="AI Task Planner"
        description="Prioritise your tasks and get a schedule that respects your available hours."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-card space-y-5 p-5 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="tasks">Task list</Label>
            <Textarea
              id="tasks"
              rows={7}
              placeholder={"One task per line:\nFinish client proposal\nReview budget sheet\nPrep Monday stand-up"}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Priority level</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours">Available work hours</Label>
              <Input
                id="hours"
                type="number"
                min={1}
                max={80}
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="due">Due dates</Label>
            <Textarea
              id="due"
              rows={3}
              placeholder="Client proposal — Friday; Budget sheet — 30 Sep"
              value={dueDates}
              onChange={(e) => setDueDates(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Planning mode</Label>
            <ToggleGroup
              type="single"
              value={mode}
              onValueChange={(v) => v && setMode(v as Mode)}
              className="w-full"
              variant="outline"
            >
              <ToggleGroupItem value="Daily" className="flex-1">
                Daily
              </ToggleGroupItem>
              <ToggleGroupItem value="Weekly" className="flex-1">
                Weekly
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <Button onClick={submit} disabled={loading} className="w-full sm:w-auto">
            {loading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 size-4" />
            )}
            Build my plan
          </Button>
        </section>

        <OutputPanel
          title="Prioritised plan"
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          emptyHint="Add your tasks and hours, and the assistant will rank the work and schedule it."
          onRegenerate={submit}
          canRegenerate={Boolean(tasks.trim())}
          rows={20}
        />
      </div>

      <Disclaimer />
    </div>
  );
}
