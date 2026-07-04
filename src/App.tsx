import { useEffect, useState } from "react";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { DashboardCharts } from "@/components/dashboard/charts";
import { DashboardLists } from "@/components/dashboard/lists";
import { SystemStrip, GmailBanner } from "@/components/dashboard/health";
import { TopBar, type View } from "@/components/top-bar";
import { CatalogPage } from "@/components/catalog/catalog-page";
import { fetchOverview, fetchConversations, fetchQuotations, fetchReviewQueue } from "@/lib/api";
import type {
  MetricsOverviewV1,
  MetricsConversationsPageV1,
  MetricsQuotationsPageV1,
  MetricsReviewQueueV1,
} from "@/lib/metrics-contract";
import { Loader2Icon } from "lucide-react";

const TENANT_ID = "kfel"; // demo; in production the BFF derives this from the login token
const TENANT_NAME = "K-Fel Valves";

export default function App() {
  const [view, setView] = useState<View>("overview");
  const [overview, setOverview] = useState<MetricsOverviewV1 | null>(null);
  const [conversations, setConversations] = useState<MetricsConversationsPageV1 | null>(null);
  const [quotations, setQuotations] = useState<MetricsQuotationsPageV1 | null>(null);
  const [reviewQueue, setReviewQueue] = useState<MetricsReviewQueueV1 | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const [ov, conv, quot, rev] = await Promise.all([
          fetchOverview(TENANT_ID),
          fetchConversations(TENANT_ID),
          fetchQuotations(TENANT_ID),
          fetchReviewQueue(TENANT_ID),
        ]);
        if (!alive) return;
        setOverview(ov);
        setConversations(conv);
        setQuotations(quot);
        setReviewQueue(rev);
        setError(false);
      } catch (e) {
        console.error("Failed to fetch dashboard data", e);
        if (alive) setError(true);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 30_000); // poll ~30s per the contract
    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, []);

  if (loading && !overview) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg font-medium">Loading dashboard…</span>
      </div>
    );
  }

  if (error && !overview) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-lg font-medium text-destructive">
          Couldn't load the dashboard. Check the API connection and retry.
        </div>
      </div>
    );
  }

  if (!overview || !conversations || !quotations || !reviewQueue) return null;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <TopBar
        tenantName={TENANT_NAME}
        tenantId={TENANT_ID}
        health={overview.health}
        reviewQueueCount={overview.reviewQueueCount}
        view={view}
        onViewChange={setView}
      />

      <main className="container mx-auto space-y-6 px-4 py-8">
        {view === "overview" ? (
          <>
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
              <p className="text-muted-foreground">Here's what your email quoting agent has been up to.</p>
            </div>

            <GmailBanner health={overview.health} />
            <KpiCards data={overview} />
            <DashboardCharts data={overview} />
            <DashboardLists
              conversations={conversations}
              quotations={quotations}
              reviewQueue={reviewQueue}
              overview={overview}
            />
            <SystemStrip health={overview.health} />
          </>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold tracking-tight">Catalog</h2>
              <p className="text-muted-foreground">The products and prices your agent quotes from.</p>
            </div>
            <CatalogPage tenantId={TENANT_ID} />
          </>
        )}
      </main>
    </div>
  );
}
