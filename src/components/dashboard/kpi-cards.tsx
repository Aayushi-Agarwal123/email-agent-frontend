import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon, InfoIcon } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import type { MetricsOverviewV1 } from "@/lib/metrics-contract";

const HINTS = {
  quotesReleased: "Quotations approved by your reviewer and emailed to customers during the selected period. Value pending is the total of drafts still awaiting your approval.",
  valueReleased: "Total value of the quotations released to customers in the period, in your currency. Approval time is how long, on median, you take to approve a draft.",
  straightThrough: "Share of requests the agent handled end-to-end — extracted, priced and ready — with NO clarification round-trip and NO escalation, leaving only your approval.",
  timeToQuote: "Median time from the customer's first email to the quote being released. Escalation rate is the share of requests that fell out to a human.",
} as const;

function InfoHint({ text }: { text: string }) {
  return (
    <Tooltip label={text} side="bottom">
      <span
        tabIndex={0}
        className="cursor-help rounded text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <InfoIcon className="h-3.5 w-3.5" />
      </span>
    </Tooltip>
  );
}

export function KpiCards({ data }: { data: MetricsOverviewV1 }) {
  const kpis = data.kpis;
  
  const formatMoney = (money: { amount: number, currency: string }) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: money.currency, maximumFractionDigits: 0 }).format(money.amount);
  };

  const renderDelta = (delta: number | null, isPoints = false, invertGood = false) => {
    if (delta === null) return <span className="text-muted-foreground text-sm flex items-center"><MinusIcon className="h-4 w-4 mr-1"/> N/A</span>;
    const isPositive = delta > 0;
    const isNegative = delta < 0;
    
    // Some metrics are better when negative (e.g. median time to quote)
    const isGood = invertGood ? isNegative : isPositive;
    const isBad = invertGood ? isPositive : isNegative;
    
    const colorClass = isGood ? 'text-emerald-500' : isBad ? 'text-rose-500' : 'text-muted-foreground';
    const Icon = isPositive ? ArrowUpIcon : isNegative ? ArrowDownIcon : MinusIcon;
    const symbol = isPoints ? 'pts' : '%';
    
    return (
      <span className={`text-sm flex items-center font-medium ${colorClass}`}>
        <Icon className="h-4 w-4 mr-1" />
        {Math.abs(delta)}{symbol} vs last period
      </span>
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Quotes Released</CardTitle>
          <InfoHint text={HINTS.quotesReleased} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.quotesReleased.value}</div>
          <div className="mt-1">{renderDelta(kpis.quotesReleased.deltaPct)}</div>
          <div className="text-xs text-muted-foreground mt-3 flex items-center justify-between">
            <span>Value pending:</span>
            <span className="font-medium text-foreground">{formatMoney(data.secondary.valueAwaitingApproval)}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Value Released</CardTitle>
          <InfoHint text={HINTS.valueReleased} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMoney(kpis.valueReleased.value)}</div>
          <div className="mt-1">{renderDelta(kpis.valueReleased.deltaPct)}</div>
          <div className="text-xs text-muted-foreground mt-3 flex items-center justify-between">
            <span>Approval time:</span>
            <span className="font-medium text-foreground">{data.secondary.medianApprovalTimeMinutes ? `${data.secondary.medianApprovalTimeMinutes}m` : 'N/A'}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Straight-Through Rate</CardTitle>
          <InfoHint text={HINTS.straightThrough} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(kpis.straightThroughRate.value * 100).toFixed(1)}%</div>
          <div className="mt-1">{renderDelta(kpis.straightThroughRate.deltaPts, true)}</div>
          <div className="text-xs text-muted-foreground mt-3 flex items-center justify-between">
            <span>Clarification rate:</span>
            <span className="font-medium text-foreground">{(data.secondary.clarificationRate * 100).toFixed(1)}%</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Time to Quote</CardTitle>
          <InfoHint text={HINTS.timeToQuote} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.medianTimeToQuoteMinutes.value ? `${kpis.medianTimeToQuoteMinutes.value}m` : 'N/A'}</div>
          <div className="mt-1">{renderDelta(kpis.medianTimeToQuoteMinutes.deltaPct, false, true)}</div>
          <div className="text-xs text-muted-foreground mt-3 flex items-center justify-between">
            <span>Escalation rate:</span>
            <span className="font-medium text-foreground">{(data.secondary.escalationRate * 100).toFixed(1)}%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
