import type { ComponentType } from "react";
import { BellIcon, ServerIcon, LayoutDashboardIcon, PackageIcon, SettingsIcon, LogOutIcon } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import type { MetricsHealthV1 } from "@/lib/metrics-contract";
import { cn } from "@/lib/utils";

export type View = "overview" | "catalog" | "settings";

type IconType = ComponentType<{ className?: string }>;

function NavButton({ icon: Icon, label, active, onClick }: {
  icon: IconType;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function StatusPill({ ok, okLabel, badLabel, icon: Icon, pulseBad }: {
  ok: boolean;
  okLabel: string;
  badLabel: string;
  icon: IconType;
  pulseBad?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        ok
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "border-destructive/20 bg-destructive/10 text-destructive",
        !ok && pulseBad && "animate-pulse",
      )}
      title={ok ? okLabel : badLabel}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", ok ? "bg-emerald-500" : "bg-destructive")} />
      <Icon className="hidden h-3.5 w-3.5 sm:inline" />
      {ok ? okLabel : badLabel}
    </span>
  );
}

export function TopBar({ tenantName, health, reviewQueueCount, view, onViewChange, email, onSignOut }: {
  tenantName: string;
  health: MetricsHealthV1;
  reviewQueueCount: number;
  view: View;
  onViewChange: (v: View) => void;
  email?: string;
  onSignOut?: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary font-bold uppercase text-primary-foreground">
              {tenantName.trim().charAt(0) || "•"}
            </div>
            <span className="hidden text-lg font-bold tracking-tight sm:inline">{tenantName}</span>
          </div>
          <nav className="flex items-center gap-1">
            <NavButton icon={LayoutDashboardIcon} label="Overview" active={view === "overview"} onClick={() => onViewChange("overview")} />
            <NavButton icon={PackageIcon} label="Catalog" active={view === "catalog"} onClick={() => onViewChange("catalog")} />
            <NavButton icon={SettingsIcon} label="Settings" active={view === "settings"} onClick={() => onViewChange("settings")} />
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <StatusPill ok={health.live} okLabel="Live" badLabel="Offline" icon={ServerIcon} />
          <button
            type="button"
            className="relative rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={`${reviewQueueCount} awaiting review`}
            title={reviewQueueCount > 0 ? `${reviewQueueCount} awaiting your review` : "Nothing awaiting review"}
          >
            <BellIcon className="h-5 w-5" />
            {reviewQueueCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
                {reviewQueueCount}
              </span>
            )}
          </button>
          <ModeToggle />
          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              title={email ? `Sign out (${email})` : "Sign out"}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <LogOutIcon className="h-4 w-4" />
              <span className="hidden md:inline">Sign out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
