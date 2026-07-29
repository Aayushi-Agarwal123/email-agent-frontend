import { HomeNav } from "./nav";
import { Hero } from "./hero";
import { HowItWorks } from "./how-it-works";
import { ProductPreview } from "./product-preview";
import { Trust } from "./trust";
import { Benefits } from "./benefits";
import { Comparison } from "./comparison";
import { FinalCta } from "./cta";

export function HomePage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <HomeNav />
      <Hero />
      <HowItWorks />
      <ProductPreview />
      <Trust />
      <Benefits />
      <Comparison />
      <FinalCta />
    </div>
  );
}
