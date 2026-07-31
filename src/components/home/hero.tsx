import { useNavigate } from "react-router-dom";
import { HeroWorkflowTimeline } from "./hero-workflow-timeline";
import { HeroBusinessImpact } from "./hero-business-impact";

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="bg-[#FCFBF7] px-4 py-11 md:py-[4.75rem]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="container mx-auto">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#71716A]">
          For industrial suppliers who quote by email
        </p>
        <h1
          className="mt-5 max-w-[19ch] text-[2.25rem] leading-[1.03] tracking-[-0.018em] text-[#1A1A1A] md:text-[3.5rem]"
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
            className="inline-flex items-center gap-2.5 rounded-[2px] border-[1.5px] border-[#1A1A1A] bg-[#1A1A1A] px-6 py-3.5 text-[15px] font-medium text-[#FCFBF7] transition-transform hover:-translate-y-px"
          >
            Get started<span aria-hidden="true">→</span>
          </button>
          <span className="flex items-baseline gap-2 text-[13.5px] text-[#71716A]">
            <span className="h-[5px] w-[5px] -translate-y-0.5 rounded-full bg-[#1D7A46]" />
            Every quotation stays under your control. Nothing is sent without your approval.
          </span>
        </div>

        <HeroWorkflowTimeline />
        <HeroBusinessImpact />
      </div>
    </section>
  );
}
