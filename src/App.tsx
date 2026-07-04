import { useEffect, useState } from "react";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { DashboardCharts } from "@/components/dashboard/charts";
import { DashboardLists } from "@/components/dashboard/lists";
import { DashboardHealth } from "@/components/dashboard/health";
import { 
  fetchOverview, 
  fetchConversations, 
  fetchQuotations, 
  fetchReviewQueue 
} from "@/lib/api";
import type { 
  MetricsOverviewV1, 
  MetricsConversationsPageV1, 
  MetricsQuotationsPageV1, 
  MetricsReviewQueueV1 
} from "@/lib/metrics-contract";
import { Loader2Icon, SettingsIcon, UserIcon } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function App() {
  const tenantId = "kfel"; // Hardcoded for demo, normally from token
  
  const [overview, setOverview] = useState<MetricsOverviewV1 | null>(null);
  const [conversations, setConversations] = useState<MetricsConversationsPageV1 | null>(null);
  const [quotations, setQuotations] = useState<MetricsQuotationsPageV1 | null>(null);
  const [reviewQueue, setReviewQueue] = useState<MetricsReviewQueueV1 | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [ov, conv, quot, rev] = await Promise.all([
          fetchOverview(tenantId),
          fetchConversations(tenantId),
          fetchQuotations(tenantId),
          fetchReviewQueue(tenantId)
        ]);
        setOverview(ov);
        setConversations(conv);
        setQuotations(quot);
        setReviewQueue(rev);
      } catch (e) {
        console.error("Failed to fetch dashboard data", e);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    // Poll every 30s as per PRD
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !overview) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg font-medium">Loading Dashboard...</span>
      </div>
    );
  }

  if (!overview || !conversations || !quotations || !reviewQueue) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-destructive text-lg font-medium">Failed to load dashboard data.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center h-8 w-8 rounded bg-primary text-primary-foreground font-bold">
              K
            </div>
            <h1 className="text-xl font-bold tracking-tight">K-Fel Valves</h1>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="text-sm px-3 py-1 bg-muted rounded-full">
              Window: 14 Days
            </div>
            <ModeToggle />
            <SettingsIcon className="h-5 w-5 hover:text-foreground cursor-pointer transition-colors" />
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border">
              <UserIcon className="h-5 w-5" />
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground">
            Here's what your email quoting agent has been up to.
          </p>
        </div>
        
        <DashboardHealth health={overview.health} />
        
        <KpiCards data={overview} />
        
        <DashboardCharts data={overview} />
        
        <div className="grid gap-4 md:grid-cols-1">
          <DashboardLists 
            conversations={conversations} 
            quotations={quotations} 
            reviewQueue={reviewQueue} 
            overview={overview}
          />
        </div>
      </main>
    </div>
  );
}
