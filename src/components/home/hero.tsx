import { useNavigate } from "react-router-dom";
import { HeroWorkflowTimeline } from "./hero-workflow-timeline";
import { HeroBusinessImpact } from "./hero-business-impact";

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="bg-[#FCFBF7] px-4 py-11 md:py-[4.75rem]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="container mx-auto">
        <h1
          className="max-w-[19ch] text-[2.25rem] leading-[1.03] tracking-[-0.018em] text-[#1A1A1A] md:text-[3.5rem]"
          style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 400 }}
        >
          Turn incoming RFQs into ready-to-send quotations, automatically.
        </h1>
        <p
          className="mt-5 max-w-[44ch] text-[17px] italic leading-[1.5] text-[#43433E] md:text-[20px]"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          Reads RFQ emails in your inbox, prices every line from your own catalog, and
          drafts the quotation. You review, approve, and it goes out, on your
          letterhead, from your address.
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

        <HeroWorkflowTimeline />
        <HeroBusinessImpact />
      </div>
    </section>
  );
}
