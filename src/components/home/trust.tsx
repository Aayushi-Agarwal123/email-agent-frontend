const POINTS = [
  {
    title: "Human Approval",
    description: "Every quotation is reviewed before it's sent. The AI drafts, you approve.",
  },
  {
    title: "Private by Default",
    description: "Your catalog, inbox, and customer data stay within your workspace.",
  },
  {
    title: "Complete Audit Trail",
    description: "Every quotation, approval, edit, and customer interaction is logged with a searchable timestamp.",
  },
  {
    title: "Controlled Email Access",
    description:
      "The AI works within a defined RFQ workflow, accessing only the conversations required to understand requests and prepare quotations.",
  },
];

const HEIGHTS = ["md:min-h-[140px]", "md:min-h-[220px]", "md:min-h-[220px]", "md:min-h-[140px]"];

export function Trust() {
  return (
    <section id="trust" className="border-t border-hairline bg-cream py-16 md:py-24" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="container mx-auto px-4">
        <div className="max-w-xl">
          <h2
            className="text-[2rem] font-semibold leading-[1.15] tracking-[-0.5px] text-ink md:text-[3rem]"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Built for Enterprise Reliability
          </h2>
        </div>

        <div className="relative mx-auto mt-16 max-w-[1000px]">
          <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
            <div
              className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
              style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--hairline)), transparent)" }}
            />
            <div
              className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2"
              style={{ background: "linear-gradient(to right, transparent, hsl(var(--hairline)), transparent)" }}
            />
          </div>

          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
            {POINTS.map((p, idx) => (
              <div
                key={p.title}
                className={`flex flex-col border-2 border-ink bg-cream p-6 transition-all duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-[1.02] hover:bg-[color-mix(in_srgb,hsl(var(--ink))_2%,hsl(var(--cream)))] hover:shadow-[0_10px_30px_rgba(26,26,26,0.07)] ${HEIGHTS[idx]}`}
              >
                <h3 className="mb-3 text-[19px] font-medium text-ink" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                  {p.title}
                </h3>
                <p className="text-[14.5px] leading-[1.7] text-ink-muted">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
