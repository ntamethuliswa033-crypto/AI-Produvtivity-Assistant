import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Clock3, FileText, Mail, Sparkles, TrendingUp, Zap } from "lucide-react";

import { Disclaimer } from "@/components/ai/Disclaimer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { navItems } from "@/components/layout/nav-items";
import { readActivity, relativeTime, type ActivityEntry } from "@/lib/activity";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "One dashboard for AI-assisted emails, meeting summaries, task plans, research briefs and workplace chat.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Automate everyday workplace tasks: emails, meeting notes, task planning, research and chat in one dashboard.",
      },
    ],
  }),
  component: DashboardPage,
});

const usage = [
  { label: "AI actions this month", value: "128", change: "+18% vs last month", icon: Zap },
  { label: "Emails drafted", value: "42", change: "9 this week", icon: Mail },
  { label: "Meetings summarised", value: "27", change: "6 this week", icon: FileText },
  { label: "Hours saved (est.)", value: "19.5", change: "Based on average task time", icon: Clock3 },
];

const quickActions = navItems.filter((item) => item.to !== "/" && item.to !== "/settings");

function DashboardPage() {
  const [activity, setActivity] = useState<ActivityEntry[]>([]);

  useEffect(() => {
    const sync = () => setActivity(readActivity());
    sync();
    window.addEventListener("wai-activity", sync);
    return () => window.removeEventListener("wai-activity", sync);
  }, []);

  return (
    <div className="space-y-8">
      <section className="surface-card relative overflow-hidden p-6 sm:p-8">
        <Badge variant="secondary" className="mb-4 gap-1">
          <Sparkles className="size-3" /> Workspace overview
        </Badge>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Welcome back, Thuliswa
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Your assistant is ready. Draft emails, summarise meetings, plan your week and research
          topics — all in one place, with every output editable before you use it.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/email">
              Draft an email <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/chat">Open AI chatbot</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {usage.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="surface-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <Icon className="size-4 text-primary" aria-hidden="true" />
              </div>
              <p className="mt-3 text-2xl font-semibold">{stat.value}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="size-3" /> {stat.change}
              </p>
            </div>
          );
        })}
      </section>

      <section>
        <h2 className="text-base font-semibold">Quick actions</h2>
        <p className="text-sm text-muted-foreground">Jump straight into any assistant.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="surface-card group flex flex-col gap-3 p-5 transition-shadow hover:shadow-[var(--shadow-raised)]"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {item.description}
                  </span>
                </span>
                <span className="mt-auto inline-flex items-center text-sm font-medium text-primary">
                  Open <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="surface-card p-5 sm:p-6">
        <h2 className="text-base font-semibold">Recent activity</h2>
        {activity.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center">
            <p className="text-sm font-medium">No activity yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Generated drafts, summaries and plans will appear here.
            </p>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {activity.map((entry) => (
              <li key={entry.at} className="flex items-start justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{entry.tool}</p>
                  <p className="truncate text-sm text-muted-foreground">{entry.detail}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {relativeTime(entry.at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Disclaimer />
    </div>
  );
}
