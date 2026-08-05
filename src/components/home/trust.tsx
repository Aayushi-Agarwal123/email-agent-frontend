import { useInViewOnce } from "@/hooks/use-in-view-once";
import {
  ShieldCheck,
  Lock,
  ClipboardCheck,
  MailCheck,
} from "lucide-react";

const POINTS = [
  {
    title: "Human Approval",
    description:
      "Every quotation is reviewed before sending. AI prepares the draft while your team approves every response.",
    icon: ShieldCheck,
  },
  {
    title: "Private by Default",
    description:
      "Your catalog, inbox, and customer data remain secure within your workspace at every stage of processing.",
    icon: Lock,
  },
  {
    title: "Complete Audit Trail",
    description:
      "Every quotation, approval, edit, and customer interaction is logged with a searchable history for accountability.",
    icon: ClipboardCheck,
  },
  {
    title: "Controlled Email Access",
    description:
      "The AI operates within a defined RFQ workflow, accessing only the emails required to understand customer requests.",
    icon: MailCheck,
  },
];

export function Trust() {
  const { ref, inView } = useInViewOnce<HTMLElement>();

  return (
    <section
      ref={ref}
      id="trust"
      className="relative overflow-hidden border-t border-white/10 bg-[#0B1120] py-20 md:py-28"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Background Glow */}
      <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[140px]" />
      <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-blue-500/10 blur-[140px]" />

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
            Enterprise Security
          </span>

          <h2
            className="mt-6 bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-4xl font-semibold text-transparent md:text-5xl"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Built for Enterprise Reliability
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            FastQuote is designed with enterprise-grade security,
            transparency, and complete control over every quotation.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {POINTS.map((p, idx) => {
            const Icon = p.icon;

            return (
              <div
                key={p.title}
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

                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-cyan-500/60">
                  <Icon size={26} />
                </div>

                {/* Title */}
                <h3
                  className="mt-7 text-2xl font-semibold text-white transition-colors duration-300 group-hover:text-cyan-300"
                  style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                  }}
                >
                  {p.title}
                </h3>

                {/* Description */}
                <p className="mt-4 leading-7 text-slate-400 transition-colors duration-300 group-hover:text-slate-300">
                  {p.description}
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