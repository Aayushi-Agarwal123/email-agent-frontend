import { useNavigate } from "react-router-dom";
import { HeroWorkflowTimeline } from "./hero-workflow-timeline";
import { HeroBusinessImpact } from "./hero-business-impact";
import { useInViewOnce } from "@/hooks/use-in-view-once";

export function Hero() {
  const navigate = useNavigate();
  const { ref, inView } = useInViewOnce<HTMLDivElement>();

  return (
    <section
      className="relative overflow-hidden bg-[#0B1120] px-6 py-16 md:py-24"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl">
        <div
          ref={ref}
          className={`transition-all duration-700 ${
            inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          }`}
        >
          {/* Badge */}
          <div className="mb-6 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300">
            ⚡ AI Powered Quotation Platform
          </div>

          {/* Heading */}
          <h1
            className="max-w-3xl text-5xl leading-tight tracking-tight text-white md:text-7xl"
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 500,
            }}
            
          >
            Enterprise Quoting. Automated.
          </h1>

          {/* Description */}
          <p
            className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            FastQuote prepares complete quotations from incoming RFQs using your
            catalog, pricing, and branding.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3.5 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_0_35px_rgba(34,211,238,0.45)]"            >
              Get Started
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Existing Components */}
        <div className="mt-20">
          <HeroWorkflowTimeline />
        </div>

        <div className="mt-16">
          <HeroBusinessImpact />
        </div>
      </div>
    </section>
  );
}