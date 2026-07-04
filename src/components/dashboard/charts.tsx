import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import type { MetricsOverviewV1 } from "@/lib/metrics-contract";

export function DashboardCharts({ data }: { data: MetricsOverviewV1 }) {
  const { activity, funnel } = data;

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
        <CardHeader>
          <CardTitle>Daily Activity</CardTitle>
          <CardDescription>
            Requests received vs Quotes released over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activity} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReleased" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} opacity={0.7} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)' }}
                />
                <Area type="monotone" dataKey="received" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorReceived)" name="Received" />
                <Area type="monotone" dataKey="released" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorReleased)" name="Released" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Outcome Funnel</CardTitle>
          <CardDescription>
            Current disposition of {funnel.total} total requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={funnelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-[36px]">
              <span className="text-3xl font-bold">{funnel.total}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">RFQs</span>
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-muted-foreground">
            + {funnel.ignored} non-RFQ messages ignored
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
