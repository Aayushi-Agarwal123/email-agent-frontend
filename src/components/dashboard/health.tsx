import { Badge } from "@/components/ui/badge";
import { ServerIcon, MailIcon, ActivityIcon, AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import type { MetricsHealthV1 } from "@/lib/metrics-contract";
import { format, parseISO } from "date-fns";

export function DashboardHealth({ health }: { health: MetricsHealthV1 }) {
  
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm bg-muted/50 rounded-lg p-3 border border-border/50">
      <div className="flex items-center text-muted-foreground mr-4">
        <ActivityIcon className="h-4 w-4 mr-2" />
        <span className="font-semibold text-foreground">Agent Health</span>
      </div>

      <div className="flex items-center gap-2">
        <ServerIcon className="h-4 w-4 text-muted-foreground" />
        <span>Status:</span>
        {health.live ? (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">Online</Badge>
        ) : (
          <Badge variant="destructive">Offline</Badge>
        )}
      </div>

      <div className="flex items-center gap-2 border-l pl-4 border-border">
        <MailIcon className="h-4 w-4 text-muted-foreground" />
        <span>Gmail:</span>
        {health.gmailConnected ? (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">Connected</Badge>
        ) : (
          <Badge variant="destructive" className="animate-pulse">Disconnected - Reconnect Required</Badge>
        )}
      </div>

      <div className="flex items-center gap-2 border-l pl-4 border-border">
        <CheckCircle2Icon className="h-4 w-4 text-muted-foreground" />
        <span>Deliverability:</span>
        <span className="font-medium">
          {health.bounceRate === 0 ? '100%' : `${((1 - health.bounceRate) * 100).toFixed(1)}%`}
        </span>
      </div>

      {health.deadLetteredCount > 0 && (
        <div className="flex items-center gap-2 border-l pl-4 border-border text-destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <span className="font-medium">{health.deadLetteredCount} dead letters</span>
        </div>
      )}

      <div className="flex-1" />

      <div className="text-xs text-muted-foreground">
        Last sync: {health.lastPollAt ? format(parseISO(health.lastPollAt), 'h:mm a') : 'Never'}
      </div>
    </div>
  );
}
