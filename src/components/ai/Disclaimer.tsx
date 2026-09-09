import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export const DISCLAIMER_TEXT =
  "AI may make mistakes. Users should review all outputs before using them. Do not enter confidential, sensitive, or personal information unless allowed.";

export function Disclaimer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border border-border bg-accent/50 px-4 py-3 text-sm text-accent-foreground",
        className,
      )}
    >
      <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p className="leading-relaxed">
        <span className="font-semibold">Responsible AI:</span> {DISCLAIMER_TEXT}
      </p>
    </div>
  );
}
