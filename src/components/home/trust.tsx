import { useInViewOnce } from "@/hooks/use-in-view-once";

const POINTS = [
  {
    title: "Human Approval",
    description:
      "Every quotation is reviewed before sending. AI prepares the draft, while your team approves every response.",
  },
  {
    title: "Private by Default",
    description:
      "Your catalog, inbox, and customer data remain secure within your workspace at every stage of processing.",
  },
  {
    title: "Complete Audit Trail",
    description:
      "Every quotation, approval, edit, and customer interaction is logged with a searchable history for accountability.",
  },
  {
    title: "Controlled Email Access",
    description:
      "The AI operates within a defined RFQ workflow, accessing only the emails required to understand requests and prepare quotations.",
  },
];

export function Trust() {
  const { ref, inView } = useInViewOnce<HTMLElement>();

  return (
    <section
      ref={ref}
      id="trust"
      className="border-t border-hairline bg-cream py-16 md:py-24"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className="container mx-auto px-4">
        <div
          className={`mx-auto max-w-xl text-center opacity-100 motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out ${
            inView ? "" : "motion-safe:-translate-x-10 motion-safe:opacity-0"
          }`}
        >
          <h2
            className="text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.5px] text-ink md:text-[2.5rem]"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Built for Enterprise Reliability
          </h2>
        </div>

        <div className="relative mx-auto mt-16 max-w-[1000px]">
          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
            {POINTS.map((p, idx) => (
              <div
                key={p.title}
                className={`opacity-100 motion-safe:transition-all motion-safe:ease-out motion-safe:[transition-duration:800ms] ${
                  inView ? "" : "motion-safe:translate-y-10 motion-safe:opacity-0"
                }`}
                style={{ transitionDelay: `${(idx + 1) * 100}ms` }}
              >
                <div
                  className="flex h-full min-h-[180px] flex-col border-2 border-ink bg-cream p-6 transition-all duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-[1.02] hover:bg-[color-mix(in_srgb,hsl(var(--ink))_2%,hsl(var(--cream)))] hover:shadow-[0_10px_30px_rgba(26,26,26,0.07)]"
                >
                  <h3 className="mb-3 text-[19px] font-medium text-ink" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                    {p.title}
                  </h3>
                  <p className="text-[14.5px] leading-[1.7] text-ink-muted">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
