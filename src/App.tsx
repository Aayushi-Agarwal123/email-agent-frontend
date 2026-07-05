import { useCallback, useEffect, useState } from "react";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { DashboardCharts } from "@/components/dashboard/charts";
import { DashboardLists } from "@/components/dashboard/lists";
import { SystemStrip, GmailBanner } from "@/components/dashboard/health";
import { TopBar, type View } from "@/components/top-bar";
import { CatalogPage } from "@/components/catalog/catalog-page";
import { SettingsPage } from "@/components/settings/settings-page";
import { Login } from "@/components/login";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { useAuth } from "@/lib/auth";
import { fetchOverview, fetchConversations, fetchQuotations, fetchReviewQueue, fetchOnboarding } from "@/lib/api";
import type {
  MetricsOverviewV1,
  MetricsConversationsPageV1,
  MetricsQuotationsPageV1,
  MetricsReviewQueueV1,
} from "@/lib/metrics-contract";
import { Loader2Icon } from "lucide-react";

export default function App() {
  const { session, live, logout } = useAuth();
  const tenantId = session?.tenantId ?? "kfel";

  const [view, setView] = useState<View>("overview");
  const [overview, setOverview] = useState<MetricsOverviewV1 | null>(null);
  const [conversations, setConversations] = useState<MetricsConversationsPageV1 | null>(null);
  const [quotations, setQuotations] = useState<MetricsQuotationsPageV1 | null>(null);
  const [reviewQueue, setReviewQueue] = useState<MetricsReviewQueueV1 | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [onboarded, setOnboarded] = useState<boolean | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);

  // First-time detection: gate the dashboard behind the onboarding wizard, and
  // pick up the tenant's real display name for the top bar.
  const loadOnboarding = useCallback(async () => {
    try {
      const s = await fetchOnboarding(tenantId);
      setDisplayName(s.displayName);
      setOnboarded(s.onboarded);
    } catch {
      setOnboarded(true); // don't block the dashboard if onboarding isn't enabled
    }
  }, [tenantId]);
  useEffect(() => {
    if (session) loadOnboarding();
  }, [session, loadOnboarding]);

  useEffect(() => {
    if (!session || onboarded !== true) return;
    let alive = true;
    const load = async () => {
      try {
        const [ov, conv, quot, rev] = await Promise.all([
          fetchOverview(tenantId),
          fetchConversations(tenantId),
          fetchQuotations(tenantId),
          fetchReviewQueue(tenantId),
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
    const interval = setInterval(load, 30_000);
    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, [session, tenantId, onboarded]);

  // Live mode requires a real login; fixture/preview mode runs as a demo session.
  if (live && !session) return <Login />;

  if (session && onboarded === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (session && onboarded === false) {
    return <OnboardingWizard tenantId={tenantId} onDone={loadOnboarding} />;
  }

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
        tenantName={displayName ?? tenantId}
        health={overview.health}
        reviewQueueCount={overview.reviewQueueCount}
        view={view}
        onViewChange={setView}
        email={session?.email}
        onSignOut={live ? logout : undefined}
      />

      <main className="container mx-auto space-y-6 px-4 py-8">
        {view === "overview" && (
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
        )}

        {view === "catalog" && (
          <>
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold tracking-tight">Catalog</h2>
              <p className="text-muted-foreground">The products and prices your agent quotes from.</p>
            </div>
            <CatalogPage tenantId={tenantId} />
          </>
        )}

        {view === "settings" && (
          <>
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
              <p className="text-muted-foreground">Manage how your quoting agent behaves.</p>
            </div>
            <SettingsPage tenantId={tenantId} />
          </>
        )}
      </main>
    </div>
  );
}
