import { useInViewOnce } from "@/hooks/use-in-view-once";

const STEPS = [
  {
    n: "01",
    title: "RFQ Processing",
    description:
      "Monitors your inbox, understands complex requests, extracts requirements from unstructured data with high accuracy.",
  },
  {
    n: "02",
    title: "Intelligent Pricing",
    description:
      "Understands requirements, matches products across complex catalogs, asks clarifying questions, and generates accurate pricing.",
  },
  {
    n: "03",
    title: "Review & Approval",
    description:
      "Review generated quotations, verify products and pricing, approve with confidence, then send with complete audit trails.",
  },
];

export function HowItWorks() {
  const { ref, inView } = useInViewOnce<HTMLElement>();

  return (
    <section
      ref={ref}
      id="how-it-works"
      className="relative overflow-hidden border-t border-white/10 bg-[#0B1120] py-20 md:py-28"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Background Glow */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[140px]" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-blue-500/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div
          className={`mx-auto max-w-3xl text-center transition-all duration-1000 ${
            inView
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <span className="inline-flex animate-pulse rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 shadow-lg shadow-cyan-500/20">
            Workflow
          </span>

          <h2
            className="mt-6 bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-4xl font-semibold text-transparent md:text-5xl"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            How FastQuote Works
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            A streamlined AI workflow that transforms incoming RFQs into
            professional quotations in just a few minutes.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {STEPS.map((s, idx) => (
            <div
              key={s.n}
              className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-4 hover:scale-[1.03] hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-500/20 ${
                inView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-12 opacity-0"
              }`}
              style={{
                transitionDelay: `${idx * 180}ms`,
              }}
            >

              {/* Shine Animation */}
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute -left-28 top-0 h-full w-24 rotate-12 bg-white/10 blur-xl transition-all duration-700 group-hover:left-full"></div>
              </div>

              {/* Step Number */}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-lg font-bold text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-cyan-500/60">
                {s.n}
              </div>

              {/* Title */}
              <h3
                className="mt-8 text-2xl font-semibold text-white transition-colors duration-300 group-hover:text-cyan-300"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                {s.title}
              </h3>

              {/* Description */}
              <p className="mt-5 leading-7 text-slate-400 transition-colors duration-300 group-hover:text-slate-300">
                {s.description}
              </p>

              {/* Bottom Accent */}
              <div className="mt-8 h-[3px] w-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 transition-all duration-500 group-hover:w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}