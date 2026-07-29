import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMockSession } from "@/lib/mock-session";

const KPIS = [
  { label: "Quotations sent", value: "128", note: "this month" },
  { label: "Value quoted", value: "₹1.42 Cr", note: "this month" },
  { label: "Avg time to quote", value: "41m", note: "↓ 22% vs last month" },
];

type Status = "ready" | "needs-price" | "sent";

const ROWS: { customer: string; quote: string; product: string; value: string; status: Status }[] = [
  { customer: "procurement@bharatsteelworks.com", quote: "QUO-1042", product: "SS316 Ball Valve DN50 — 40 units", value: "₹3,84,000", status: "ready" },
  { customer: "purchasing@deltavalves.co.in", quote: "QUO-1041", product: "Gate Valve 150# — 12 units", value: "—", status: "needs-price" },
  { customer: "buyer@apexpipelines.com", quote: "QUO-1039", product: 'MS Pipe Sch 40, 6" — 200 m', value: "₹6,10,500", status: "sent" },
  { customer: "sourcing@vertexfittings.com", quote: "QUO-1038", product: "Butterfly Valve Wafer DN100 — 25 units", value: "₹2,25,000", status: "sent" },
];

const STATUS_STYLE: Record<Status, string> = {
  ready: "bg-success-bg text-success",
  "needs-price": "bg-attention-bg text-foreground",
  sent: "bg-secondary text-secondary-foreground",
};

const STATUS_LABEL: Record<Status, string> = {
  ready: "Ready to send",
  "needs-price": "Needs price",
  sent: "Sent",
};

export function ProductPreview() {
  const navigate = useNavigate();
  const { session } = useMockSession();
  const goToDashboard = () => navigate(session ? "/dashboard" : "/register");

  return (
    <section className="border-t border-border py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">See it in action</h2>
          <p className="mt-2 text-muted-foreground">A real look at the dashboard you'll use every day.</p>
        </div>

        <Card className="mx-auto mt-10 max-w-4xl border-border shadow-sm">
          <CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {KPIS.map((k) => (
                <div key={k.label} className="rounded-lg border border-border p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{k.label}</p>
                  <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">{k.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{k.note}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <CardHeader className="px-0 pb-4 pt-0">
                <CardTitle className="text-base">Review queue</CardTitle>
                <CardDescription>Quotations the agent has prepared — nothing sends until you approve it.</CardDescription>
              </CardHeader>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Quote #</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ROWS.map((r) => (
                      <TableRow key={r.quote}>
                        <TableCell className="font-medium">{r.customer}</TableCell>
                        <TableCell className="font-mono text-xs">{r.quote}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{r.product}</TableCell>
                        <TableCell className="tabular-nums">{r.value}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`border-transparent ${STATUS_STYLE[r.status]}`}>
                            {STATUS_LABEL[r.status]}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-center">
          <Button onClick={goToDashboard}>
            {session ? "Go to your dashboard" : "See the full dashboard — get started free"}
          </Button>
        </div>
      </div>
    </section>
  );
}
