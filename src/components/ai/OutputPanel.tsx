import { useState } from "react";
import { Check, Copy, Loader2, RefreshCw, TriangleAlert, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type OutputPanelProps = {
  title: string;
  value: string;
  onChange: (value: string) => void;
  loading: boolean;
  error: string | null;
  emptyHint: string;
  onRegenerate?: () => void;
  canRegenerate?: boolean;
  rows?: number;
};

export function OutputPanel({
  title,
  value,
  onChange,
  loading,
  error,
  emptyHint,
  onRegenerate,
  canRegenerate,
  rows = 16,
}: OutputPanelProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not copy. Select the text and copy manually.");
    }
  };

  return (
    <section className="surface-card flex flex-col p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">
            Editable — refine the text before you copy or send it.
          </p>
        </div>
        <div className="flex gap-2">
          {onRegenerate && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              disabled={loading || !canRegenerate}
            >
              <RefreshCw className={cn("mr-2 size-4", loading && "animate-spin")} />
              Regenerate
            </Button>
          )}
          <Button size="sm" onClick={copy} disabled={!value.trim() || loading}>
            {copied ? <Check className="mr-2 size-4" /> : <Copy className="mr-2 size-4" />}
            Copy
          </Button>
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="space-y-3 rounded-xl border border-border bg-muted/40 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Generating your draft…
            </div>
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : error ? (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
            <div>
              <p className="font-medium text-destructive">Something went wrong</p>
              <p className="mt-1 text-muted-foreground">{error}</p>
            </div>
          </div>
        ) : value ? (
          <>
            <Textarea
              value={value}
              rows={rows}
              onChange={(e) => onChange(e.target.value)}
              className="resize-y font-normal leading-relaxed"
              aria-label={title}
            />
            <p className="mt-2 text-xs text-success">Draft ready. Review before using it.</p>
          </>
        ) : (
          <div className="grid place-items-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center">
            <Wand2 className="mb-3 size-6 text-muted-foreground" />
            <p className="text-sm font-medium">Nothing generated yet</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">{emptyHint}</p>
          </div>
        )}
      </div>
    </section>
  );
}
