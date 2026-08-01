import { useInViewOnce } from "@/hooks/use-in-view-once";

const BENEFITS = [
  {
    title: "Capture Every Opportunity",
    description: "Every RFQ is processed as soon as it arrives, so no opportunity goes unnoticed.",
  },
  {
    title: "Handle Higher Volumes",
    description: "Process thousands of products and growing RFQ volumes without adding manual effort.",
  },
  {
    title: "Respond Before Competitors",
    description: "Prepare quotations within minutes to improve response times and win more business.",
  },
  {
    title: "Stay Consistent as You Grow",
    description: "Every quotation follows the same pricing logic, regardless of volume.",
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
          className={`mx-auto mb-14 max-w-[750px] text-center opacity-100 motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out ${
            inView ? "" : "motion-safe:-translate-x-10 motion-safe:opacity-0"
          }`}
        >
          <h2
            className="text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.5px] text-ink md:text-[2.5rem]"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Scale Your Business, Not Your Team.
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
