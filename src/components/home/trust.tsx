const POINTS = [
  {
    title: "You approve every quotation",
    description: "Nothing is emailed to a customer until you click approve. The agent drafts; you decide.",
  },
  {
    title: "Your data stays yours",
    description: "Your catalog and inbox are never shared, sold, or used to train anything outside your account.",
  },
  {
    title: "Full audit trail",
    description: "Every quotation, drafted, edited, or approved, is logged with a timestamp you can review anytime.",
  },
  {
    title: "Read-and-send access only",
    description: "A verified connection to one mailbox. The agent never deletes or moves your mail.",
  },
];

const HEIGHTS = ["md:min-h-[140px]", "md:min-h-[220px]", "md:min-h-[220px]", "md:min-h-[140px]"];

export function Trust() {
  return (
    <section id="trust" className="border-t border-hairline bg-cream py-16 md:py-24" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="container mx-auto px-4">
        <div className="max-w-xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#9A998F]">Why you can trust it</p>
          <h2
            className="mt-3 text-[28px] leading-[1.15] text-ink md:text-[34px]"
            style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 400 }}
          >
            Built for suppliers who can't afford a mistake in a customer's inbox.
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
