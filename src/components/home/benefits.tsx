import { useInViewOnce } from "@/hooks/use-in-view-once";

const BENEFITS = [
  {
    title: "Never miss an RFQ",
    description: "Every email is read the moment it lands, even during your busiest hours.",
  },
  {
    title: "Built for large catalogs",
    description: "Price thousands of SKUs without a manual lookup for every line.",
  },
  {
    title: "Faster than manual quoting",
    description: "Cut average response time from 1–2 days to under an hour.",
  },
  {
    title: "Consistent pricing, every time",
    description: "The same catalog and logic price every quote, no variation by who typed it.",
  },
];

export function Benefits() {
  const { ref, inView } = useInViewOnce<HTMLElement>();

  return (
    <section
      ref={ref}
      className="border-t border-hairline bg-cream"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className="mx-auto max-w-[1200px] px-6 py-12 md:px-8 md:py-20">
        <div
          className={`mb-14 max-w-[750px] opacity-100 motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out ${
            inView ? "" : "motion-safe:-translate-x-10 motion-safe:opacity-0"
          }`}
        >
          <p className="font-mono text-[11px] font-medium uppercase tracking-[2.8px] text-gold">
            Built for industrial suppliers
          </p>
          <h2
            className="mt-3 text-[2rem] font-semibold leading-[1.15] tracking-[-0.5px] text-ink md:text-[3rem]"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Quoted the way your business actually runs.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {BENEFITS.map((b, idx) => (
            <div
              key={b.title}
              className={`h-full opacity-100 motion-safe:transition-all motion-safe:ease-out motion-safe:[transition-duration:800ms] ${
                inView ? "" : "motion-safe:translate-y-10 motion-safe:opacity-0"
              }`}
              style={{ transitionDelay: `${(idx + 1) * 100}ms` }}
            >
              <div className="flex h-full flex-col border-2 border-ink bg-cream p-[1.8rem] transition-all duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-[1.02] hover:bg-[color-mix(in_srgb,hsl(var(--ink))_2%,hsl(var(--cream)))] hover:shadow-[0_10px_30px_rgba(26,26,26,0.07)] md:p-8">
                <h3 className="mb-[0.9rem] text-[1.05rem] font-bold text-ink">{b.title}</h3>
                <p className="flex-1 text-[0.93rem] leading-[1.75] text-ink-muted">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
