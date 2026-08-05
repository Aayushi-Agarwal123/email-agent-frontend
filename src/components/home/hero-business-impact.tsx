import { useInViewOnce } from "@/hooks/use-in-view-once";

const ROWS = [
  { label: "Time to First Quote", manual: "1–2 days to respond", agent: "5 minutes to respond" },
  { label: "RFQ Visibility", manual: "Manual inbox tracking", agent: "Automatic RFQ tracking" },
  { label: "Pricing Accuracy", manual: "Manual pricing process", agent: "Catalog-driven pricing" },
  { label: "Scalability", manual: "Team grows with demand", agent: "Business scales effortlessly" },
];

const fadeUp = (inView: boolean) =>
  `transition-all duration-700 ${
    inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
  }`;

export function HeroBusinessImpact() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();

  return (
    <section ref={ref} className="mt-24">

      {/* Heading */}
      <div
        className={`mb-14 text-center ${fadeUp(inView)}`}
      >
        <span className="mb-4 inline-block rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300">
          Why Businesses Choose FastQuote
        </span>

        <h2
          className="mt-4 text-4xl font-semibold text-white md:text-5xl"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          Work Faster. Quote Smarter.
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
          Compare the traditional quotation workflow with an AI-powered
          automation experience.
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-8 lg:grid-cols-2">

        {/* Manual */}
        <div
          className={`rounded-3xl border border-red-500/20 bg-white/5 p-8 backdrop-blur-xl ${fadeUp(
            inView
          )}`}
        >
          <div className="mb-8 flex items-center justify-between">

            <div>
              <p className="text-sm uppercase tracking-[3px] text-red-400">
                Traditional Process
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-white">
                Manual Quoting
              </h3>
            </div>

            <div className="rounded-xl bg-red-500/10 px-4 py-2 text-red-400">
              Slow
            </div>

          </div>

          <div className="space-y-6">
            {ROWS.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between border-b border-white/10 pb-4"
              >
                <span className="text-slate-400">
                  {row.label}
                </span>

                <span className="font-semibold text-red-300">
                  {row.manual}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FastQuote */}
        <div
          className={`rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-8 backdrop-blur-xl shadow-xl shadow-cyan-500/10 ${fadeUp(
            inView
          )}`}
        >
          <div className="mb-8 flex items-center justify-between">

            <div>
              <p className="text-sm uppercase tracking-[3px] text-cyan-400">
                AI Powered
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-white">
                FastQuote
              </h3>
            </div>

            <div className="rounded-xl bg-cyan-500/10 px-4 py-2 text-cyan-300">
              Fast
            </div>

          </div>

          <div className="space-y-6">
            {ROWS.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between border-b border-white/10 pb-4"
              >
                <span className="text-slate-300">
                  {row.label}
                </span>

                <span className="font-semibold text-cyan-300">
                  {row.agent}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
}