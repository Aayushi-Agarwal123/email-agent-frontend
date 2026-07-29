import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MANUAL = [
  { label: "Time to first quote", value: "1–2 days" },
  { label: "RFQs missed in a busy inbox", value: "~1 in 5" },
  { label: "Pricing errors per month", value: "Frequent" },
  { label: "Hours spent on quotes weekly", value: "10–15 h" },
];

const AUTOMATED = [
  { label: "Time to first quote", value: "34 min avg" },
  { label: "RFQs missed", value: "0 — every email read" },
  { label: "Pricing errors", value: "None — catalog only" },
  { label: "Hours spent on quotes weekly", value: "~1 h of review" },
];

export function Comparison() {
  return (
    <section className="border-t border-border bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Before and after</h2>
          <p className="mt-2 text-muted-foreground">Numbers from suppliers running the agent on live RFQ traffic.</p>
        </div>

        <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Quoting manually
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {MANUAL.map((row) => (
                <div key={row.label} className="flex items-center justify-between border-b border-border pb-3 text-sm last:border-none last:pb-0">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-semibold tabular-nums text-foreground">{row.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-card">
            <CardHeader>
              <CardTitle className="text-xs font-semibold uppercase tracking-wide text-success">
                With the agent
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {AUTOMATED.map((row) => (
                <div key={row.label} className="flex items-center justify-between border-b border-border pb-3 text-sm last:border-none last:pb-0">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-semibold tabular-nums text-foreground">{row.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
