import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  const navigate = useNavigate();

  return (
    <section className="border-t border-border py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 rounded-xl bg-primary px-8 py-10 text-center text-primary-foreground sm:flex-row sm:text-left">
          <div>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              Your next RFQ could be quoted within the hour.
            </h2>
            <p className="mt-2 text-sm text-primary-foreground/80">
              Connect Gmail, upload your price list, and you're live. No card required for the first 20 quotations.
            </p>
          </div>
          <Button size="lg" variant="secondary" className="shrink-0" onClick={() => navigate("/register")}>
            Start setup
          </Button>
        </div>
      </div>
    </section>
  );
}
