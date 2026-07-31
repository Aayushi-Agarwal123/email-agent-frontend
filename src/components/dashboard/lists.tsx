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
    <TableHead className={cn("h-9 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#71716A]", className)}>
      <button type="button" onClick={() => onSort(col)} className="inline-flex items-center gap-1 hover:text-[#1A1A1A]">
        {label}
        <Icon className={cn("h-3.5 w-3.5", active ? "text-[#1A1A1A]" : "text-[#9A998F]")} />
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

  const tabTriggerCls =
    "rounded-none text-[#71716A] hover:text-[#1A1A1A] data-[state=active]:border-[#1A1A1A] data-[state=active]:text-[#1A1A1A]";

  return (
    <Card
      className="col-span-1 rounded-[2px] border-[#DAD5C8] bg-[#FCFBF7] shadow-none"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <Tabs defaultValue="review" className="w-full">
        <CardHeader className="flex flex-row items-center justify-between border-b border-[#DAD5C8] px-6 py-4">
          <div>
            <CardTitle
              className="text-[16px] font-normal text-[#1A1A1A]"
              style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 500 }}
            >
              Recent Activity
            </CardTitle>
            <CardDescription className="text-[11.5px] text-[#71716A]">Review tasks, conversations, and quotes (up to {PAGE}).</CardDescription>
          </div>
          <TabsList className="text-[#71716A]">
            <TabsTrigger value="review" className={cn(tabTriggerCls, "relative")}>
              Review Queue
              {reviewQueue.rows.length > 0 && (
                <Badge
                  variant="outline"
                  className="ml-2 flex h-5 w-5 items-center justify-center rounded-full border-[1.5px] border-[#9A3B34] bg-transparent p-0 text-[10px] text-[#9A3B34]"
                >
                  {reviewQueue.rows.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="conversations" className={tabTriggerCls}>Conversations</TabsTrigger>
            <TabsTrigger value="quotations" className={tabTriggerCls}>Quotations</TabsTrigger>
            <TabsTrigger value="escalations" className={tabTriggerCls}>Escalations</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="p-0">
          <TabsContent value="review" className="m-0 border-none p-0 outline-none">
            <ScrollArea className="h-[400px]">
              <Table className="text-[13px] text-[#1A1A1A]">
                <TableHeader className="sticky top-0 z-10 bg-[#FCFBF7]">
                  <TableRow className="border-[#DAD5C8] hover:bg-transparent">
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
                    <TableRow className="border-[#DAD5C8] hover:bg-transparent">
                      <TableCell colSpan={6} className="py-10 text-center text-[#71716A]">
                        All caught up! No items to review.
                      </TableCell>
                    </TableRow>
                  ) : (
                    reviewRows.map((row) => (
                      <TableRow key={row.conversationId} className="border-[#DAD5C8] hover:bg-[#F9F7F1]">
                        <TableCell className="font-medium">{row.customerEmail}</TableCell>
                        <TableCell className="tabular-nums">{row.quotationNumber}</TableCell>
                        <TableCell className="tabular-nums">{formatMoney(row.total)}</TableCell>
                        <TableCell className="tabular-nums">{row.lineCount}</TableCell>
                        <TableCell className="tabular-nums">{formatDate(row.waitingSinceAt)}</TableCell>
                        <TableCell>
                          {row.hasMissingPrices ? (
                            <Badge variant="outline" className="rounded-[2px] border-[1.5px] border-[#9A3B34] bg-transparent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#9A3B34]">
                              Needs Price
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="rounded-[2px] border-[1.5px] border-[#1D7A46] bg-transparent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#1D7A46]">
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
              <Table className="text-[13px] text-[#1A1A1A]">
                <TableHeader className="sticky top-0 z-10 bg-[#FCFBF7]">
                  <TableRow className="border-[#DAD5C8] hover:bg-transparent">
                    <TableHead className="h-9 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#71716A]">Customer</TableHead>
                    <TableHead className="h-9 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#71716A]">Subject</TableHead>
                    <TableHead className="h-9 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#71716A]">Stage</TableHead>
                    <TableHead className="h-9 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#71716A]">Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conversationRows.length === 0 ? (
                    <TableRow className="border-[#DAD5C8] hover:bg-transparent">
                      <TableCell colSpan={4} className="py-10 text-center text-[#71716A]">
                        No recent conversations.
                      </TableCell>
                    </TableRow>
                  ) : (
                    conversationRows.map((row) => (
                      <TableRow key={row.conversationId} className="border-[#DAD5C8] hover:bg-[#F9F7F1]">
                        <TableCell className="font-medium">{row.customerEmail}</TableCell>
                        <TableCell>
                          <div className="max-w-[300px] truncate text-[13px]" title={row.subject || ""}>
                            {row.subject || <span className="italic text-[#71716A]">No Subject</span>}
                          </div>
                          <div className="mt-1 max-w-[300px] truncate text-[11px] text-[#71716A]" title={row.snippet || ""}>
                            {row.snippet}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="rounded-[2px] border-[1.5px] border-[#DAD5C8] bg-transparent px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[#71716A]">
                            {row.stage.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[13px] tabular-nums">{formatDate(row.lastActivityAt)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="quotations" className="m-0 border-none p-0 outline-none">
            <ScrollArea className="h-[400px]">
              <Table className="text-[13px] text-[#1A1A1A]">
                <TableHeader className="sticky top-0 z-10 bg-[#FCFBF7]">
                  <TableRow className="border-[#DAD5C8] hover:bg-transparent">
                    <TableHead className="h-9 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#71716A]">Quote #</TableHead>
                    <TableHead className="h-9 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#71716A]">Customer</TableHead>
                    <TableHead className="h-9 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#71716A]">Total Value</TableHead>
                    <TableHead className="h-9 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#71716A]">Status</TableHead>
                    <TableHead className="h-9 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#71716A]">Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotationRows.length === 0 ? (
                    <TableRow className="border-[#DAD5C8] hover:bg-transparent">
                      <TableCell colSpan={5} className="py-10 text-center text-[#71716A]">
                        No recent quotations.
                      </TableCell>
                    </TableRow>
                  ) : (
                    quotationRows.map((row) => {
                      const statusCls =
                        row.status === "released"
                          ? "border-[#1D7A46] text-[#1D7A46]"
                          : row.status === "awaiting_review"
                            ? "border-[#9A3B34] text-[#9A3B34]"
                            : "border-[#DAD5C8] text-[#71716A]";
                      return (
                        <TableRow key={row.quotationNumber} className="border-[#DAD5C8] hover:bg-[#F9F7F1]">
                          <TableCell className="font-medium tabular-nums">{row.quotationNumber}</TableCell>
                          <TableCell>{row.customerEmail}</TableCell>
                          <TableCell className="tabular-nums">{formatMoney(row.total)}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn("rounded-[2px] border-[1.5px] bg-transparent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide", statusCls)}
                            >
                              {row.status.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-[13px] tabular-nums">{formatDate(row.updatedAt)}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="escalations" className="m-0 border-none p-0 outline-none">
            <div className="p-6">
              <h3 className="mb-4 text-[13px] font-medium text-[#1A1A1A]">Escalation Reasons Breakdown</h3>
              {escalationReasons.length === 0 ? (
                <div className="py-10 text-center text-[#71716A]">No escalations in this period. Great job!</div>
              ) : (
                <div className="space-y-4">
                  {escalationReasons.map((r) => (
                    <div key={r.reason} className="flex items-center">
                      <div className="w-[150px] font-mono text-[12px] text-[#1A1A1A]">{r.reason.replace(/_/g, " ")}</div>
                      <div className="ml-4 h-1.5 flex-1 overflow-hidden rounded-[2px] bg-[#DAD5C8]">
                        <div className="h-full bg-[#9A3B34]" style={{ width: `${(r.count / Math.max(1, overview.funnel.escalated)) * 100}%` }} />
                      </div>
                      <div className="ml-4 w-12 text-right text-[13px] tabular-nums text-[#71716A]">{r.count}</div>
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
