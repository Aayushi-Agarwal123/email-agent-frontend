import { Card, CardContent } from "@/components/ui/card";
import { ClockIcon, LayersIcon, TrendingUpIcon, BadgeCheckIcon } from "lucide-react";

const BENEFITS = [
  {
    icon: ClockIcon,
    title: "Never miss an RFQ",
    description: "Every email is read the moment it lands, even during your busiest hours — nothing sits unopened in a shared inbox.",
  },
  {
    icon: LayersIcon,
    title: "Built for large catalogs",
    description: "Price thousands of SKUs — pipes, valves, fittings, and fasteners — without a manual lookup for every line.",
  },
  {
    icon: TrendingUpIcon,
    title: "Faster than manual quoting",
    description: "Cut average response time from 1–2 days to under an hour — a real edge when buyers are comparing suppliers.",
  },
  {
    icon: BadgeCheckIcon,
    title: "Consistent pricing, every time",
    description: "The same catalog and the same logic price every quote — no variation because a different person typed it.",
  },
];

export function Benefits() {
  return (
    <section className="border-t border-border py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Built for industrial suppliers</h2>
          <p className="mt-2 text-muted-foreground">Steel, pipes, valves, and fittings — quoted the way your business actually runs.</p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="border-border">
              <CardContent className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
