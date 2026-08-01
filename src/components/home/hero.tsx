import { useNavigate } from "react-router-dom";
import { HeroWorkflowTimeline } from "./hero-workflow-timeline";
import { HeroBusinessImpact } from "./hero-business-impact";
import { useInViewOnce } from "@/hooks/use-in-view-once";

export function Hero() {
  const navigate = useNavigate();
  const { ref, inView } = useInViewOnce<HTMLDivElement>();

  return (
    <section className="bg-[#FCFBF7] px-4 py-11 md:py-[4.75rem]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="container mx-auto">
        <div
          ref={ref}
          className={`opacity-100 motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out ${
            inView ? "" : "motion-safe:-translate-x-10 motion-safe:opacity-0"
          }`}
        >
          <h1
            className="max-w-[19ch] text-[2.25rem] leading-[1.03] tracking-[-0.018em] text-[#1A1A1A] md:text-[3.5rem]"
            style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 400 }}
          >
            Enterprise Quoting. Automated.
          </h1>
          <p
            className="mt-5 max-w-[44ch] text-[17px] italic leading-[1.5] text-[#43433E] md:text-[20px]"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            FastQuote prepares complete quotations from incoming RFQs using your
            catalog, pricing, and branding.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="inline-flex items-center gap-2.5 rounded-[2px] border-[1.5px] border-[#1A1A1A] bg-[#1A1A1A] px-6 py-3.5 text-[15px] font-medium text-[#FCFBF7] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#FCFBF7] hover:text-[#1A1A1A] hover:shadow-[0_12px_32px_rgba(26,26,26,0.15)]"
            >
              Get started<span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <HeroWorkflowTimeline />
        <HeroBusinessImpact />
      </div>
    </section>
  );
}
