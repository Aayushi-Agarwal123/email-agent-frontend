import type { ComponentType } from "react";
import { Link, useLocation } from "react-router-dom";
import { BellIcon, ServerIcon, LayoutDashboardIcon, ListChecksIcon, PackageIcon, SettingsIcon, LogOutIcon } from "lucide-react";
import type { MetricsHealthV1 } from "@/lib/metrics-contract";
import { cn } from "@/lib/utils";

type IconType = ComponentType<{ className?: string }>;

function NavItem({ to, icon: Icon, label, active }: {
  to: string;
  icon: IconType;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium transition-colors",
        active ? "text-[#1A1A1A]" : "text-[#71716A] hover:text-[#1A1A1A]",
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}

function StatusPill({ ok, okLabel, badLabel, pulseBad }: {
  ok: boolean;
  okLabel: string;
  badLabel: string;
  icon: IconType;
  pulseBad?: boolean;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[12px] font-semibold"
      style={{ color: ok ? "#1D7A46" : "#9A3B34" }}
      title={ok ? okLabel : badLabel}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", !ok && pulseBad && "animate-pulse")}
        style={{ background: ok ? "#1D7A46" : "#9A3B34" }}
      />
      {ok ? okLabel : badLabel}
    </span>
  );
}

export function TopBar({ tenantName, health, reviewQueueCount, email, onSignOut }: {
  tenantName: string;
  health: MetricsHealthV1;
  reviewQueueCount: number;
  email?: string;
  onSignOut?: () => void;
}) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <header
      className="sticky top-0 z-30 border-b border-[#DAD5C8] bg-[#FCFBF7]"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-[2px] border-[1.5px] border-[#1A1A1A] font-semibold uppercase text-[#1A1A1A]">
              {tenantName.trim().charAt(0) || "•"}
            </div>
            <span
              className="hidden text-[16px] tracking-tight text-[#1A1A1A] sm:inline"
              style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 500 }}
            >
              {tenantName}
            </span>
          </div>
          <nav className="flex items-center gap-1">
            <NavItem to="/dashboard" icon={LayoutDashboardIcon} label="Overview" active={location.pathname === "/dashboard"} />
            <NavItem to="/dashboard/review-queue" icon={ListChecksIcon} label="Review Queue" active={isActive("/dashboard/review-queue")} />
            <NavItem to="/dashboard/catalog" icon={PackageIcon} label="Catalog" active={isActive("/dashboard/catalog")} />
            <NavItem to="/dashboard/settings" icon={SettingsIcon} label="Settings" active={isActive("/dashboard/settings")} />
          </nav>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <StatusPill ok={health.live} okLabel="Live" badLabel="Offline" icon={ServerIcon} pulseBad />
          <Link
            to="/dashboard/review-queue"
            className="relative p-2 text-[#71716A] hover:text-[#1A1A1A]"
            aria-label={`${reviewQueueCount} awaiting review`}
            title={reviewQueueCount > 0 ? `${reviewQueueCount} awaiting your review` : "Nothing awaiting review"}
          >
            <BellIcon className="h-5 w-5" />
            {reviewQueueCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-[2px] bg-[#9A3B34] px-1 text-[10px] font-medium text-[#FCFBF7]">
                {reviewQueueCount}
              </span>
            )}
          </Link>
          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              title={email ? `Sign out (${email})` : "Sign out"}
              className="inline-flex items-center gap-1.5 px-2 py-1.5 text-[13px] text-[#71716A] hover:text-[#1A1A1A]"
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
