const KEY = "wai.activity.v1";

export type ActivityEntry = {
  tool: string;
  detail: string;
  at: number;
};

export function readActivity(): ActivityEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ActivityEntry[];
    return Array.isArray(parsed) ? parsed.slice(0, 12) : [];
  } catch {
    return [];
  }
}

export function logActivity(tool: string, detail: string) {
  if (typeof window === "undefined") return;
  const entry: ActivityEntry = { tool, detail: detail.slice(0, 120), at: Date.now() };
  const next = [entry, ...readActivity()].slice(0, 12);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("wai-activity"));
  } catch {
    /* storage unavailable */
  }
}

export function relativeTime(at: number): string {
  const diff = Date.now() - at;
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return `${days} d ago`;
}
