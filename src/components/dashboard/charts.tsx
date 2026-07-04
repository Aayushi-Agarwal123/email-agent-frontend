import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { MetricsOverviewV1 } from "@/lib/metrics-contract";

type MetricKey = "received" | "released" | "valueReleased" | "medianTimeToQuoteMinutes";

const METRICS: { key: MetricKey; label: string; color: string; kind: "count" | "money" | "rate" | "minutes" }[] = [
  { key: "received", label: "Requests received", color: "#3b82f6", kind: "count" },
  { key: "released", label: "Quotes released", color: "#10b981", kind: "count" },
  { key: "valueReleased", label: "Value released", color: "#8b5cf6", kind: "money" },
  { key: "medianTimeToQuoteMinutes", label: "Time to quote", color: "#f59e0b", kind: "minutes" },
];

export function DashboardCharts({ data }: { data: MetricsOverviewV1 }) {
  const { activity, funnel } = data;
  const [metricKey, setMetricKey] = useState<MetricKey>("received");
  const metric = METRICS.find((m) => m.key === metricKey)!;
  const currency = data.kpis.valueReleased.value.currency;

  const fmt = (v: number | null | undefined): string => {
    if (v == null) return "—";
    switch (metric.kind) {
      case "money":
        return new Intl.NumberFormat("en-IN", { style: "currency", currency, notation: "compact", maximumFractionDigits: 1 }).format(v);
      case "rate":
        return `${Math.round(v * 100)}%`;
      case "minutes":
        return v >= 120 ? `${(v / 60).toFixed(1)}h` : `${Math.round(v)}m`;
      default:
        return String(v);
    }
  };

  const funnelData = [
    { name: "Released", value: funnel.released, fill: "#10b981" },
    { name: "Awaiting Review", value: funnel.awaitingReview, fill: "#f59e0b" },
    { name: "Clarifying", value: funnel.clarifying, fill: "#3b82f6" },
    { name: "In Progress", value: funnel.inProgress, fill: "#8b5cf6" },
    { name: "Escalated", value: funnel.escalated, fill: "#ef4444" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
          <div>
            <CardTitle>Activity</CardTitle>
            <CardDescription>{metric.label} over time</CardDescription>
          </div>
          <select
            value={metricKey}
            onChange={(e) => setMetricKey(e.target.value as MetricKey)}
            aria-label="Choose metric"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {METRICS.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activity} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="metricFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={metric.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={metric.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} opacity={0.7} />
                <YAxis tickLine={false} axisLine={false} width={54} fontSize={12} opacity={0.7} tickFormatter={(v) => fmt(v as number)} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", background: "var(--background)" }}
                  formatter={(value) => [fmt(value as number | null), metric.label]}
                />
                <Area
                  type="monotone"
                  dataKey={metric.key}
                  name={metric.label}
                  stroke={metric.color}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#metricFill)"
                  connectNulls
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Outcome Funnel</CardTitle>
          <CardDescription>Current disposition of {funnel.total} total requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative h-[240px] w-[200px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={funnelData} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={2} dataKey="value" stroke="none">
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{funnel.total}</span>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">RFQs</span>
              </div>
            </div>

            <div className="flex-1 space-y-2.5">
              {funnelData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.fill }} />
                    {d.name}
                  </span>
                  <span className="font-semibold tabular-nums">{d.value}</span>
                </div>
              ))}
              <div className="mt-2 flex items-center justify-between border-t pt-2 text-xs text-muted-foreground">
                <span>Ignored (non-RFQ)</span>
                <span className="tabular-nums">{funnel.ignored}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
