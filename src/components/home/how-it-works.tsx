import { Card, CardContent } from "@/components/ui/card";
import { MailIcon, PackageIcon, CheckCircle2Icon } from "lucide-react";

const STEPS = [
  {
    icon: MailIcon,
    step: "01",
    title: "An RFQ arrives",
    description:
      "The agent watches your Gmail for requests for quotation and reads every line — items, quantities, delivery terms, and special conditions.",
  },
  {
    icon: PackageIcon,
    step: "02",
    title: "It prices from your catalog",
    description:
      "Every line item is matched against the price data you uploaded — pipes, valves, fittings, and fasteners included. Anything it can't price is flagged for you, never guessed.",
  },
  {
    icon: CheckCircle2Icon,
    step: "03",
    title: "You approve, quotation sent",
    description:
      "A finished quotation lands in your review queue. One click to approve, and it's emailed to the buyer with a full audit trail.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">How it works</h2>
          <p className="mt-2 text-muted-foreground">Three steps. Your catalog stays yours; your inbox stays yours.</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, step, title, description }) => (
            <Card key={step} className="border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{step}</span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
