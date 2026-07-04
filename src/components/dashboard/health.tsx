import { AlertCircleIcon, MailWarningIcon } from "lucide-react";
import type { MetricsHealthV1 } from "@/lib/metrics-contract";
import { format, parseISO } from "date-fns";

/**
 * Slim system strip at the FOOT of the overview. Shows deliverability only when
 * an email actually bounced and the dead-letter count only when non-zero — a
 * clean strip that surfaces problems, not filler. Last sync always shows.
 */
export function SystemStrip({ health }: { health: MetricsHealthV1 }) {
  const deliverability = `${((1 - health.bounceRate) * 100).toFixed(1)}%`;
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-border/50 bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground">
      {health.bounceRate > 0 && (
        <span className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
          <AlertCircleIcon className="h-3.5 w-3.5" />
          Deliverability <span className="font-medium">{deliverability}</span> — some emails bounced
        </span>
      )}
      {health.deadLetteredCount > 0 && (
        <span className="flex items-center gap-2 text-destructive">
          <AlertCircleIcon className="h-3.5 w-3.5" />
          <span className="font-medium">{health.deadLetteredCount} message(s) failed processing</span>
        </span>
      )}
      <span className="flex-1" />
      <span>Last sync: {health.lastPollAt ? format(parseISO(health.lastPollAt), "MMM d, h:mm a") : "Never"}</span>
    </div>
  );
}

/** Prominent banner when Gmail auth has lapsed — the agent stops receiving mail. */
export function GmailBanner({ health }: { health: MetricsHealthV1 }) {
  if (health.gmailConnected) return null;
  return (
    <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      <MailWarningIcon className="h-5 w-5 shrink-0" />
      <div>
        <span className="font-semibold">Gmail disconnected.</span> The agent can't receive or send mail
        until you reconnect the mailbox. New requests are not being processed.
      </div>
    </div>
  );
}
