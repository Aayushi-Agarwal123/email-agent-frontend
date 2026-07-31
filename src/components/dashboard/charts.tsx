import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { MetricsOverviewV1 } from "@/lib/metrics-contract";

type MetricKey = "received" | "released" | "valueReleased" | "medianTimeToQuoteMinutes";

// One restrained accent color for the whole chart, regardless of metric — color carries
// meaning elsewhere (status/health), not which line is plotted here.
const CHART_COLOR = "#1D7A46";

const METRICS: { key: MetricKey; label: string; kind: "count" | "money" | "rate" | "minutes" }[] = [
  { key: "received", label: "Requests received", kind: "count" },
  { key: "released", label: "Quotes released", kind: "count" },
  { key: "valueReleased", label: "Value released", kind: "money" },
  { key: "medianTimeToQuoteMinutes", label: "Time to quote", kind: "minutes" },
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

  // A restrained, meaning-carrying palette instead of a rainbow: green for done,
  // the bad color for what's awaiting you, ink for escalated, greys for in-between.
  const funnelData = [
    { name: "Released", value: funnel.released, fill: "#1D7A46" },
    { name: "Awaiting Review", value: funnel.awaitingReview, fill: "#9A3B34" },
    { name: "Clarifying", value: funnel.clarifying, fill: "#71716A" },
    { name: "In Progress", value: funnel.inProgress, fill: "#9A998F" },
    { name: "Escalated", value: funnel.escalated, fill: "#1A1A1A" },
  ];

  const fraunces = { fontFamily: "'Fraunces', Georgia, serif", fontWeight: 500 } as const;

  return (
    <div className="grid gap-4 md:grid-cols-7" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Card className="col-span-4 rounded-[2px] border-[#DAD5C8] bg-[#FCFBF7] shadow-none">
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
          <div>
            <CardTitle className="text-[13px] font-normal text-[#1A1A1A]" style={fraunces}>Activity</CardTitle>
            <CardDescription className="text-[11.5px] text-[#71716A]">{metric.label} over time</CardDescription>
          </div>
          <select
            value={metricKey}
            onChange={(e) => setMetricKey(e.target.value as MetricKey)}
            aria-label="Choose metric"
            className="h-9 rounded-[2px] border border-[#DAD5C8] bg-white px-3 text-[13px] text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]"
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
                    <stop offset="5%" stopColor={CHART_COLOR} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={CHART_COLOR} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DAD5C8" opacity={0.6} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} stroke="#71716A" opacity={0.8} />
                <YAxis tickLine={false} axisLine={false} width={54} fontSize={11} stroke="#71716A" opacity={0.8} tickFormatter={(v) => fmt(v as number)} />
                <Tooltip
                  contentStyle={{ borderRadius: "2px", border: "1px solid #DAD5C8", background: "#FCFBF7", fontSize: "13px" }}
                  formatter={(value) => [fmt(value as number | null), metric.label]}
                />
                <Area
                  type="monotone"
                  dataKey={metric.key}
                  name={metric.label}
                  stroke={CHART_COLOR}
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

      <Card className="col-span-3 rounded-[2px] border-[#DAD5C8] bg-[#FCFBF7] shadow-none">
        <CardHeader>
          <CardTitle className="text-[13px] font-normal text-[#1A1A1A]" style={fraunces}>Outcome Funnel</CardTitle>
          <CardDescription className="text-[11.5px] text-[#71716A]">Current disposition of {funnel.total} total requests</CardDescription>
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
                <span className="text-[26px] tracking-[-0.02em] tabular-nums text-[#1A1A1A]" style={fraunces}>{funnel.total}</span>
                <span className="text-[10.5px] uppercase tracking-[0.08em] text-[#71716A]">RFQs</span>
              </div>
            </div>

            <div className="flex-1 space-y-2.5">
              {funnelData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-[13px]">
                  <span className="flex items-center gap-2 text-[#71716A]">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.fill }} />
                    {d.name}
                  </span>
                  <span className="font-semibold tabular-nums text-[#1A1A1A]">{d.value}</span>
                </div>
              ))}
              <div className="mt-2 flex items-center justify-between border-t border-[#DAD5C8] pt-2 text-[11px] text-[#71716A]">
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
