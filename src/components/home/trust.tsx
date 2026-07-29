import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheckIcon, LockIcon, HistoryIcon, MailIcon } from "lucide-react";

const POINTS = [
  {
    icon: ShieldCheckIcon,
    title: "You approve every quotation",
    description: "Nothing is emailed to a customer until you click approve. The agent drafts; you decide.",
  },
  {
    icon: LockIcon,
    title: "Your data stays yours",
    description: "Your catalog and inbox are never shared, sold, or used to train anything outside your account.",
  },
  {
    icon: HistoryIcon,
    title: "Full audit trail",
    description: "Every quotation — drafted, edited, or approved — is logged with a timestamp you can review anytime.",
  },
  {
    icon: MailIcon,
    title: "Read-and-send Gmail access only",
    description: "A Google-verified connection to one mailbox. The agent never deletes or moves your mail.",
  },
];

export function Trust() {
  return (
    <section id="trust" className="border-t border-border bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Why you can trust it</h2>
          <p className="mt-2 text-muted-foreground">Built for suppliers who can't afford a mistake in a customer's inbox.</p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {POINTS.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="border-border">
              <CardContent className="flex gap-4 p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
