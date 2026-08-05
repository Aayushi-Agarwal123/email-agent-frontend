import { useInViewOnce } from "@/hooks/use-in-view-once";
import {
  TrendingUp,
  Layers3,
  Zap,
  BarChart3,
} from "lucide-react";

const BENEFITS = [
  {
    title: "Capture Every Opportunity",
    description:
      "Every RFQ is processed the moment it arrives, ensuring no business opportunity is missed.",
    icon: TrendingUp,
  },
  {
    title: "Handle Higher Volumes",
    description:
      "Scale effortlessly with thousands of products and increasing RFQ requests without expanding your team.",
    icon: Layers3,
  },
  {
    title: "Respond Before Competitors",
    description:
      "Generate quotations within minutes, helping your business respond faster and close more deals.",
    icon: Zap,
  },
  {
    title: "Stay Consistent as You Grow",
    description:
      "Maintain accurate pricing and professional quotations with AI-driven consistency across every response.",
    icon: BarChart3,
  },
];

export function Benefits() {
  const { ref, inView } = useInViewOnce<HTMLElement>();

  return (
    <section
      ref={ref}
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
            Business Benefits
          </span>

          <h2
            className="mt-6 bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-4xl font-semibold text-transparent md:text-5xl"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Scale Your Business, Not Your Team
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            FastQuote empowers your sales process with AI automation,
            enabling faster quotations, greater efficiency,
            and sustainable business growth.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {BENEFITS.map((b, idx) => {
            const Icon = b.icon;

            return (
              <div
                key={b.title}
                className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-4 hover:scale-[1.03] hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-500/20 ${
                  inView
                    ? "translate-y-0 opacity-100"
                    : "translate-y-12 opacity-0"
                }`}
                style={{
                  transitionDelay: `${idx * 180}ms`,
                }}
              >

                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute -left-28 top-0 h-full w-24 rotate-12 bg-white/10 blur-xl transition-all duration-700 group-hover:left-full"></div>
                </div>

                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-cyan-500/60">
                  <Icon size={26} />
                </div>

                {/* Title */}
                <h3
                  className="mt-7 text-2xl font-semibold text-white transition-colors duration-300 group-hover:text-cyan-300"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  {b.title}
                </h3>

                {/* Description */}
                <p className="mt-4 leading-7 text-slate-400 transition-colors duration-300 group-hover:text-slate-300">
                  {b.description}
                </p>

                {/* Bottom Accent */}
                <div className="mt-8 h-[3px] w-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 transition-all duration-500 group-hover:w-full"></div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}