import { useOutletContext } from "react-router-dom";
import { KpiCards } from "./kpi-cards";
import { DashboardCharts } from "./charts";
import { DashboardLists } from "./lists";
import { GmailBanner, SystemStrip } from "./health";
import { CatalogPage } from "@/components/catalog/catalog-page";
import { SettingsPage } from "@/components/settings/settings-page";
import type { DashboardContext } from "./dashboard-layout";

export function OverviewRoute() {
  const { overview, conversations, quotations, reviewQueue } = useOutletContext<DashboardContext>();
  return (
    <>
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">Here's what your email quoting agent has been up to.</p>
      </div>
      <GmailBanner health={overview.health} />
      <KpiCards data={overview} />
      <DashboardCharts data={overview} />
      <DashboardLists conversations={conversations} quotations={quotations} reviewQueue={reviewQueue} overview={overview} />
      <SystemStrip health={overview.health} />
    </>
  );
}

// Reuses the existing tabbed DashboardLists (already defaults to the Review
// Queue tab) rather than a brand-new standalone table — keeps this route
// real and functional without inventing a second review-queue component.
export function ReviewQueueRoute() {
  const { conversations, quotations, reviewQueue, overview } = useOutletContext<DashboardContext>();
  return (
    <>
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">Review Queue</h2>
        <p className="text-muted-foreground">Quotes the agent has prepared — nothing sends until you approve it.</p>
      </div>
      <DashboardLists conversations={conversations} quotations={quotations} reviewQueue={reviewQueue} overview={overview} />
    </>
  );
}

export function CatalogRoute() {
  const { tenantId } = useOutletContext<DashboardContext>();
  return (
    <>
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">Catalog</h2>
        <p className="text-muted-foreground">The products and prices your agent quotes from.</p>
      </div>
      <CatalogPage tenantId={tenantId} />
    </>
  );
}

export function SettingsRoute() {
  const { tenantId } = useOutletContext<DashboardContext>();
  return (
    <>
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage how your quoting agent behaves.</p>
      </div>
      <SettingsPage tenantId={tenantId} />
    </>
  );
}
