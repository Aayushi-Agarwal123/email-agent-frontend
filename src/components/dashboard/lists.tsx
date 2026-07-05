import { useMemo, useState, type ComponentType } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon } from "lucide-react";
import type {
  MetricsConversationsPageV1,
  MetricsQuotationsPageV1,
  MetricsReviewQueueV1,
  MetricsReviewRowV1,
  MetricsOverviewV1,
} from "@/lib/metrics-contract";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

const PAGE = 10; // default rows shown per tab

type ListsProps = {
  conversations: MetricsConversationsPageV1;
  quotations: MetricsQuotationsPageV1;
  reviewQueue: MetricsReviewQueueV1;
  overview: MetricsOverviewV1;
};

const formatMoney = (money: { amount: number; currency: string } | null) =>
  money ? new Intl.NumberFormat("en-IN", { style: "currency", currency: money.currency, maximumFractionDigits: 0 }).format(money.amount) : "-";
const formatDate = (iso: string) => format(parseISO(iso), "MMM d, h:mm a");

// ── Review-queue sorting ──────────────────────────────────────────────────────

type SortKey = "customer" | "quote" | "total" | "lines" | "waiting" | "status";
type Sort = { key: SortKey; dir: "asc" | "desc" };

function compare(a: MetricsReviewRowV1, b: MetricsReviewRowV1, key: SortKey): number {
  switch (key) {
    case "customer":
      return a.customerEmail.localeCompare(b.customerEmail);
    case "quote":
      return a.quotationNumber.localeCompare(b.quotationNumber);
    case "total":
      return (a.total?.amount ?? -1) - (b.total?.amount ?? -1);
    case "lines":
      return a.lineCount - b.lineCount;
    case "waiting":
      return new Date(a.waitingSinceAt).getTime() - new Date(b.waitingSinceAt).getTime();
    case "status":
      return Number(a.hasMissingPrices) - Number(b.hasMissingPrices);
  }
}

function SortableHead({ label, col, sort, onSort, className }: {
  label: string;
  col: SortKey;
  sort: Sort;
  onSort: (k: SortKey) => void;
  className?: string;
}) {
  const active = sort.key === col;
  const Icon: ComponentType<{ className?: string }> = active
    ? sort.dir === "asc"
      ? ChevronUpIcon
      : ChevronDownIcon
    : ChevronsUpDownIcon;
  return (
    <TableHead className={className}>
      <button type="button" onClick={() => onSort(col)} className="inline-flex items-center gap-1 hover:text-foreground">
        {label}
        <Icon className={cn("h-3.5 w-3.5", active ? "text-foreground" : "opacity-40")} />
      </button>
    </TableHead>
  );
}

export function DashboardLists({ conversations, quotations, reviewQueue, overview }: ListsProps) {
  const [sort, setSort] = useState<Sort>({ key: "waiting", dir: "asc" });
  const onSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  const reviewRows = useMemo(() => {
    const rows = [...reviewQueue.rows].sort((a, b) => compare(a, b, sort.key));
    if (sort.dir === "desc") rows.reverse();
    return rows.slice(0, PAGE);
  }, [reviewQueue.rows, sort]);

  const conversationRows = conversations.rows.slice(0, PAGE);
  const quotationRows = quotations.rows.slice(0, PAGE);
  const escalationReasons = overview.escalationReasons.slice(0, PAGE);

  return (
    <Card className="col-span-1 border-border">
      <Tabs defaultValue="review" className="w-full">
        <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
          <div>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Review tasks, conversations, and quotes (up to {PAGE}).</CardDescription>
          </div>
          <TabsList>
            <TabsTrigger value="review" className="relative">
              Review Queue
              {reviewQueue.rows.length > 0 && (
                <Badge variant="destructive" className="ml-2 flex h-5 w-5 items-center justify-center rounded-full p-0">
                  {reviewQueue.rows.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="quotations">Quotations</TabsTrigger>
            <TabsTrigger value="escalations">Escalations</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="p-0">
          <TabsContent value="review" className="m-0 border-none p-0 outline-none">
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-background">
                  <TableRow>
                    <SortableHead label="Customer" col="customer" sort={sort} onSort={onSort} />
                    <SortableHead label="Quote #" col="quote" sort={sort} onSort={onSort} />
                    <SortableHead label="Total Value" col="total" sort={sort} onSort={onSort} />
                    <SortableHead label="Lines" col="lines" sort={sort} onSort={onSort} />
                    <SortableHead label="Waiting Since" col="waiting" sort={sort} onSort={onSort} />
                    <SortableHead label="Status" col="status" sort={sort} onSort={onSort} />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviewRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                        All caught up! No items to review.
                      </TableCell>
                    </TableRow>
                  ) : (
                    reviewRows.map((row) => (
                      <TableRow key={row.conversationId}>
                        <TableCell className="font-medium">{row.customerEmail}</TableCell>
                        <TableCell>{row.quotationNumber}</TableCell>
                        <TableCell>{formatMoney(row.total)}</TableCell>
                        <TableCell>{row.lineCount}</TableCell>
                        <TableCell>{formatDate(row.waitingSinceAt)}</TableCell>
                        <TableCell>
                          {row.hasMissingPrices ? (
                            <Badge variant="destructive">Needs Price</Badge>
                          ) : (
                            <Badge variant="outline" className="border-emerald-500 text-emerald-500">
                              Ready
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="conversations" className="m-0 border-none p-0 outline-none">
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-background">
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conversationRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                        No recent conversations.
                      </TableCell>
                    </TableRow>
                  ) : (
                    conversationRows.map((row) => (
                      <TableRow key={row.conversationId}>
                        <TableCell className="font-medium">{row.customerEmail}</TableCell>
                        <TableCell>
                          <div className="max-w-[300px] truncate text-sm" title={row.subject || ""}>
                            {row.subject || <span className="italic text-muted-foreground">No Subject</span>}
                          </div>
                          <div className="mt-1 max-w-[300px] truncate text-xs text-muted-foreground" title={row.snippet || ""}>
                            {row.snippet}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-mono text-[10px] uppercase tracking-wider">
                            {row.stage.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{formatDate(row.lastActivityAt)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="quotations" className="m-0 border-none p-0 outline-none">
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-background">
                  <TableRow>
                    <TableHead>Quote #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotationRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                        No recent quotations.
                      </TableCell>
                    </TableRow>
                  ) : (
                    quotationRows.map((row) => (
                      <TableRow key={row.quotationNumber}>
                        <TableCell className="font-medium">{row.quotationNumber}</TableCell>
                        <TableCell>{row.customerEmail}</TableCell>
                        <TableCell>{formatMoney(row.total)}</TableCell>
                        <TableCell>
                          <Badge variant={row.status === "released" ? "default" : row.status === "awaiting_review" ? "secondary" : "outline"} className="capitalize">
                            {row.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{formatDate(row.updatedAt)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="escalations" className="m-0 border-none p-0 outline-none">
            <div className="p-6">
              <h3 className="mb-4 text-sm font-medium">Escalation Reasons Breakdown</h3>
              {escalationReasons.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground">No escalations in this period. Great job!</div>
              ) : (
                <div className="space-y-4">
                  {escalationReasons.map((r) => (
                    <div key={r.reason} className="flex items-center">
                      <div className="w-[150px] font-mono text-sm capitalize">{r.reason.replace(/_/g, " ")}</div>
                      <div className="ml-4 h-4 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-destructive" style={{ width: `${(r.count / Math.max(1, overview.funnel.escalated)) * 100}%` }} />
                      </div>
                      <div className="ml-4 w-12 text-right text-sm text-muted-foreground">{r.count}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
