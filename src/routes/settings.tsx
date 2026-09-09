import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/ai/PageHeader";
import { Disclaimer } from "@/components/ai/Disclaimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Workplace AI" },
      {
        name: "description",
        content:
          "Manage your profile, default tone, planning preferences and responsible AI settings.",
      },
      { property: "og:title", content: "Settings — Workplace AI" },
      {
        property: "og:description",
        content: "Profile, defaults and responsible AI preferences for your workspace.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [name, setName] = useState("Thuliswa Ntame");
  const [email, setEmail] = useState("thuliswa@company.com");
  const [tone, setTone] = useState("Formal");
  const [mode, setMode] = useState("Daily");
  const [notify, setNotify] = useState(true);
  const [reminder, setReminder] = useState(true);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={SettingsIcon}
        title="Settings"
        description="Set your profile details and the defaults used across every assistant."
      />

      <section className="surface-card space-y-5 p-5 sm:p-6">
        <h2 className="text-base font-semibold">Profile</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <Separator />

        <h2 className="text-base font-semibold">Assistant defaults</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Default email tone</Label>
            <Select value={tone} onValueChange={setTone}>
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
            <Label>Default planning mode</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <h2 className="text-base font-semibold">Notifications & safety</h2>
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border p-4">
          <div>
            <p className="text-sm font-medium">Weekly usage summary</p>
            <p className="text-sm text-muted-foreground">A short recap of your AI activity.</p>
          </div>
          <Switch checked={notify} onCheckedChange={setNotify} aria-label="Weekly usage summary" />
        </div>
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border p-4">
          <div>
            <p className="text-sm font-medium">Review reminder before copying</p>
            <p className="text-sm text-muted-foreground">
              Reminds you to check AI output for accuracy.
            </p>
          </div>
          <Switch checked={reminder} onCheckedChange={setReminder} aria-label="Review reminder" />
        </div>

        <Button onClick={() => toast.success("Settings saved")} className="w-full sm:w-auto">
          Save changes
        </Button>
      </section>

      <Disclaimer />
    </div>
  );
}
