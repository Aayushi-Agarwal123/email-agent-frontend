import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon, InfoIcon } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import type { MetricsOverviewV1 } from "@/lib/metrics-contract";

const HINTS = {
  quotesReleased: "Quotations approved by your reviewer and emailed to customers during the selected period. Value pending is the total of drafts still awaiting your approval.",
  valueReleased: "Total value of the quotations released to customers in the period, in your currency. Approval time is how long, on median, you take to approve a draft.",
  timeToQuote: "Median time from the customer's first email to the quote being released. Escalation rate is the share of requests that fell out to a human.",
} as const;

function InfoHint({ text }: { text: string }) {
  return (
    <Tooltip
      label={text}
      side="bottom"
      className="rounded-[2px] border-[#DAD5C8] bg-[#FCFBF7] text-[#1A1A1A] shadow-none"
    >
      <span
        tabIndex={0}
        className="cursor-help text-[#9A998F] outline-none hover:text-[#1A1A1A] focus-visible:ring-1 focus-visible:ring-[#1A1A1A]"
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
    
    const colorClass = isGood ? 'text-[#1D7A46]' : isBad ? 'text-[#9A3B34]' : 'text-[#71716A]';
    const Icon = isPositive ? ArrowUpIcon : isNegative ? ArrowDownIcon : MinusIcon;
    const symbol = isPoints ? 'pts' : '%';

    return (
      <span className={`text-[13px] flex items-center font-medium ${colorClass}`}>
        <Icon className="h-4 w-4 mr-1" />
        {Math.abs(delta)}{symbol} vs last period
      </span>
    );
  };

  const cardCls = "rounded-none border-0 border-t-[1.5px] border-t-[#1A1A1A] bg-transparent shadow-none";
  const headerCls = "flex flex-row items-center justify-between space-y-0 p-0 px-0.5 pb-2 pt-3.5";
  const titleCls = "text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#71716A]";
  const contentCls = "p-0 px-0.5 pb-3.5";
  const valueStyle = { fontFamily: "'Fraunces', Georgia, serif", fontWeight: 500 } as const;

  return (
    <div className="grid gap-4 md:grid-cols-3" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Card className={cardCls}>
        <CardHeader className={headerCls}>
          <CardTitle className={titleCls}>Quotes Released</CardTitle>
          <InfoHint text={HINTS.quotesReleased} />
        </CardHeader>
        <CardContent className={contentCls}>
          <div className="text-[26px] tracking-[-0.02em] tabular-nums text-[#1A1A1A]" style={valueStyle}>{kpis.quotesReleased.value}</div>
          <div className="mt-1">{renderDelta(kpis.quotesReleased.deltaPct)}</div>
          <div className="text-[11px] text-[#71716A] mt-3 flex items-center justify-between">
            <span>Value pending:</span>
            <span className="font-medium tabular-nums text-[#1A1A1A]">{formatMoney(data.secondary.valueAwaitingApproval)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className={cardCls}>
        <CardHeader className={headerCls}>
          <CardTitle className={titleCls}>Value Released</CardTitle>
          <InfoHint text={HINTS.valueReleased} />
        </CardHeader>
        <CardContent className={contentCls}>
          <div className="text-[26px] tracking-[-0.02em] tabular-nums text-[#1D7A46]" style={valueStyle}>{formatMoney(kpis.valueReleased.value)}</div>
          <div className="mt-1">{renderDelta(kpis.valueReleased.deltaPct)}</div>
          <div className="text-[11px] text-[#71716A] mt-3 flex items-center justify-between">
            <span>Approval time:</span>
            <span className="font-medium tabular-nums text-[#1A1A1A]">{data.secondary.medianApprovalTimeMinutes ? `${data.secondary.medianApprovalTimeMinutes}m` : 'N/A'}</span>
          </div>
        </CardContent>
      </Card>

      <Card className={cardCls}>
        <CardHeader className={headerCls}>
          <CardTitle className={titleCls}>Time to Quote</CardTitle>
          <InfoHint text={HINTS.timeToQuote} />
        </CardHeader>
        <CardContent className={contentCls}>
          <div className="text-[26px] tracking-[-0.02em] tabular-nums text-[#1A1A1A]" style={valueStyle}>{kpis.medianTimeToQuoteMinutes.value ? `${kpis.medianTimeToQuoteMinutes.value}m` : 'N/A'}</div>
          <div className="mt-1">{renderDelta(kpis.medianTimeToQuoteMinutes.deltaPct, false, true)}</div>
          <div className="text-[11px] text-[#71716A] mt-3 flex items-center justify-between">
            <span>Escalation rate:</span>
            <span className="font-medium tabular-nums text-[#1A1A1A]">{(data.secondary.escalationRate * 100).toFixed(1)}%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
