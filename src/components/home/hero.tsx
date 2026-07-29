import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  const navigate = useNavigate();
  const scrollToHowItWorks = () =>
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="container mx-auto grid gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:py-24">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          For industrial suppliers who quote by email
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Turn incoming RFQs into ready-to-send quotations, automatically.
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted-foreground">
          Reads RFQ emails in your inbox, prices every line from your own catalog, and
          drafts the quotation. You review, approve, and it goes out — on your
          letterhead, from your address.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={() => navigate("/register")}>Get started</Button>
          <Button size="lg" variant="outline" onClick={scrollToHowItWorks}>See how it works</Button>
        </div>

        <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          Every quotation stays under your control. Nothing is sent without your approval.
        </div>
      </div>

      <Card className="border-border shadow-sm">
        <CardContent className="p-5">
          <p className="text-sm font-semibold text-foreground">Review queue</p>
          <p className="mb-4 text-xs text-muted-foreground">2 quotations waiting for your approval</p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">buyer@acme.test</span>
              <Badge variant="outline" className="border-transparent bg-attention-bg text-foreground">
                Needs price
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">purchasing@initech.test</span>
              <Badge variant="outline" className="border-transparent bg-success-bg text-success">
                Ready to send
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
