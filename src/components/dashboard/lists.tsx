import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { 
  MetricsConversationsPageV1, 
  MetricsQuotationsPageV1, 
  MetricsReviewQueueV1,
  MetricsOverviewV1 
} from "@/lib/metrics-contract";
import { format, parseISO } from "date-fns";

type ListsProps = {
  conversations: MetricsConversationsPageV1;
  quotations: MetricsQuotationsPageV1;
  reviewQueue: MetricsReviewQueueV1;
  overview: MetricsOverviewV1;
};

export function DashboardLists({ conversations, quotations, reviewQueue, overview }: ListsProps) {
  
  const formatMoney = (money: { amount: number, currency: string } | null) => {
    if (!money) return '-';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: money.currency, maximumFractionDigits: 0 }).format(money.amount);
  };
  
  const formatDate = (isoString: string) => format(parseISO(isoString), 'MMM d, h:mm a');

  return (
    <Card className="col-span-1 border-border">
      <Tabs defaultValue="review" className="w-full">
        <CardHeader className="border-b px-6 py-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Review tasks, conversations, and quotes.</CardDescription>
          </div>
          <TabsList>
            <TabsTrigger value="review" className="relative">
              Review Queue
              {reviewQueue.rows.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full">
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
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Quote #</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Lines</TableHead>
                    <TableHead>Waiting Since</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviewQueue.rows.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">All caught up! No items to review.</TableCell></TableRow>
                  ) : (
                    reviewQueue.rows.map(row => (
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
                            <Badge variant="outline" className="border-emerald-500 text-emerald-500">Ready</Badge>
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
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conversations.rows.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground">No recent conversations.</TableCell></TableRow>
                  ) : (
                    conversations.rows.map(row => (
                      <TableRow key={row.conversationId}>
                        <TableCell className="font-medium">{row.customerEmail}</TableCell>
                        <TableCell>
                          <div className="max-w-[300px] truncate text-sm" title={row.subject || ''}>
                            {row.subject || <span className="text-muted-foreground italic">No Subject</span>}
                          </div>
                          <div className="max-w-[300px] truncate text-xs text-muted-foreground mt-1" title={row.snippet || ''}>
                            {row.snippet}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-mono text-[10px] uppercase tracking-wider">{row.stage.replace('_', ' ')}</Badge>
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
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>Quote #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotations.rows.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No recent quotations.</TableCell></TableRow>
                  ) : (
                    quotations.rows.map(row => (
                      <TableRow key={row.quotationNumber}>
                        <TableCell className="font-medium">{row.quotationNumber}</TableCell>
                        <TableCell>{row.customerEmail}</TableCell>
                        <TableCell>{formatMoney(row.total)}</TableCell>
                        <TableCell>
                          <Badge variant={row.status === 'released' ? 'default' : row.status === 'awaiting_review' ? 'secondary' : 'outline'} className="capitalize">
                            {row.status.replace('_', ' ')}
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
              <h3 className="text-sm font-medium mb-4">Escalation Reasons Breakdown</h3>
              {overview.escalationReasons.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">No escalations in this period. Great job!</div>
              ) : (
                <div className="space-y-4">
                  {overview.escalationReasons.map(r => (
                    <div key={r.reason} className="flex items-center">
                      <div className="w-[150px] font-mono text-sm capitalize">{r.reason.replace(/_/g, ' ')}</div>
                      <div className="flex-1 ml-4 h-4 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-destructive" 
                          style={{ width: `${(r.count / overview.funnel.escalated) * 100}%` }}
                        />
                      </div>
                      <div className="w-12 text-right text-sm text-muted-foreground ml-4">{r.count}</div>
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
