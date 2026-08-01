import { useInViewOnce } from "@/hooks/use-in-view-once";

const ROWS = [
  { label: "Time to first quote", manual: "1–2 days", agent: "5 min avg" },
  { label: "RFQ visibility", manual: "Manual inbox monitoring", agent: "Every RFQ captured automatically" },
  { label: "Pricing accuracy", manual: "Prone to manual errors", agent: "Catalog-based pricing" },
  {
    label: "Scalability",
    manual: "Each new RFQ adds more manual work",
    agent: "Handle more RFQs without increasing team workload",
  },
];

const fadeUp = (inView: boolean) =>
  `opacity-100 motion-safe:transition-all motion-safe:duration-[600ms] motion-safe:ease-out ${
    inView ? "" : "motion-safe:translate-y-[18px] motion-safe:opacity-0"
  }`;

export function HeroBusinessImpact() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();

  return (
    <div ref={ref} className="mt-7 md:mt-9">
      <div className="mb-[1.9rem]">
        <h2
          className="text-[1.65rem] font-semibold leading-tight tracking-[-0.3px] text-ink"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          Before and after
        </h2>
        <p className="mt-1 text-[0.95rem] text-ink-muted">
          Numbers from suppliers running QuoteAgent on live RFQ traffic.
        </p>
      </div>

      <div className="flex flex-col items-stretch gap-[1.2rem] min-[821px]:flex-row min-[821px]:gap-[1.8rem]">
        <div
          className={`flex flex-1 flex-col rounded-[2px] border-[1.5px] border-ink p-[1.6rem_1.8rem_1.8rem] max-[560px]:p-[1.3rem_1.3rem_1.5rem] ${fadeUp(
            inView
          )}`}
          style={{ backgroundColor: "color-mix(in srgb, hsl(var(--ink)) 2%, hsl(var(--cream)))" }}
        >
          <span className="mb-[1.6rem] text-[11.5px] font-bold uppercase tracking-[2.5px] text-ink">
            Quoting manually
          </span>
          <div className="grid flex-1 gap-[1.5rem] [grid-auto-rows:1fr]">
            {ROWS.map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-[1.2rem] max-[560px]:flex-col max-[560px]:items-start max-[560px]:gap-[0.15rem]"
              >
                <span className="text-[0.9rem] text-ink-muted">{row.label}</span>
                <span className="whitespace-nowrap text-right font-mono text-[1.02rem] font-bold text-ink max-[560px]:text-left">
                  {row.manual}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`flex flex-1 flex-col rounded-[2px] border-[1.5px] border-green p-[1.6rem_1.8rem_1.8rem] max-[560px]:p-[1.3rem_1.3rem_1.5rem] ${fadeUp(
            inView
          )}`}
          style={{
            backgroundColor: "color-mix(in srgb, hsl(var(--green)) 3%, hsl(var(--cream)))",
            transitionDelay: "100ms",
          }}
        >
          <span className="mb-[1.6rem] text-[11.5px] font-bold uppercase tracking-[2.5px] text-green">
            With QuoteHub
          </span>
          <div className="grid flex-1 gap-[1.5rem] [grid-auto-rows:1fr]">
            {ROWS.map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-[1.2rem] max-[560px]:flex-col max-[560px]:items-start max-[560px]:gap-[0.15rem]"
              >
                <span className="text-[0.9rem] text-ink-muted">{row.label}</span>
                <span className="whitespace-nowrap text-right font-mono text-[1.02rem] font-bold text-green max-[560px]:text-left">
                  {row.agent}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
