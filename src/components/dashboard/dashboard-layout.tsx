import { useCallback, useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { Loader2Icon } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { useAuth } from "@/lib/auth";
import { useMockSession } from "@/lib/mock-session";
import { fetchConversations, fetchOnboarding, fetchOverview, fetchQuotations, fetchReviewQueue } from "@/lib/api";
import type {
  MetricsConversationsPageV1,
  MetricsOverviewV1,
  MetricsQuotationsPageV1,
  MetricsReviewQueueV1,
} from "@/lib/metrics-contract";

export interface DashboardContext {
  tenantId: string;
  overview: MetricsOverviewV1;
  conversations: MetricsConversationsPageV1;
  quotations: MetricsQuotationsPageV1;
  reviewQueue: MetricsReviewQueueV1;
}

/** Data-fetching shell for every /dashboard/* route: resolves the tenant,
 *  gates on onboarding, loads the overview/conversations/quotations/review
 *  data once, and hands it down to the nested route via <Outlet context>. */
export function DashboardLayout() {
  const { session, logout } = useAuth();
  const { signOut: mockSignOut } = useMockSession();
  const navigate = useNavigate();
  const tenantId = session?.tenantId ?? "kfel";

  const [displayName, setDisplayName] = useState<string | null>(null);
  const [onboarded, setOnboarded] = useState<boolean | null>(null);
  const [overview, setOverview] = useState<MetricsOverviewV1 | null>(null);
  const [conversations, setConversations] = useState<MetricsConversationsPageV1 | null>(null);
  const [quotations, setQuotations] = useState<MetricsQuotationsPageV1 | null>(null);
  const [reviewQueue, setReviewQueue] = useState<MetricsReviewQueueV1 | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
    loadOnboarding();
  }, [loadOnboarding]);

  useEffect(() => {
    if (onboarded !== true) return;
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
  }, [tenantId, onboarded]);

  const handleSignOut = () => {
    // Navigate away from the protected route tree first, then clear the
    // session — clearing it first can let RequireMockAuth's guard redirect
    // to /signin before this navigation lands, trapping the user there.
    navigate("/", { replace: true });
    mockSignOut();
    logout();
  };

  if (onboarded === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FCFBF7]">
        <Loader2Icon className="h-8 w-8 animate-spin text-[#1A1A1A]" />
      </div>
    );
  }
  if (onboarded === false) {
    return <Navigate to="/onboarding" replace />;
  }
  if (loading && !overview) {
    return (
      <div
        className="flex h-screen items-center justify-center bg-[#FCFBF7] text-[#1A1A1A]"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        <Loader2Icon className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-[17px] font-medium">Loading dashboard…</span>
      </div>
    );
  }
  if (error && !overview) {
    return (
      <div
        className="flex h-screen items-center justify-center bg-[#FCFBF7]"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        <div className="text-[17px] font-medium text-[#9A3B34]">
          Couldn't load the dashboard. Check the API connection and retry.
        </div>
      </div>
    );
  }
  if (!overview || !conversations || !quotations || !reviewQueue) return null;

  return (
    <div
      className="min-h-screen bg-[#FCFBF7] text-[#1A1A1A]"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <TopBar
        tenantName={displayName ?? tenantId}
        health={overview.health}
        reviewQueueCount={overview.reviewQueueCount}
        email={session?.email}
        onSignOut={handleSignOut}
      />
      <main className="container mx-auto space-y-6 px-4 py-8">
        <Outlet context={{ tenantId, overview, conversations, quotations, reviewQueue } satisfies DashboardContext} />
      </main>
    </div>
  );
}
