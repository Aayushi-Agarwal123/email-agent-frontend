import { MailIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function FinalCta() {
  const navigate = useNavigate();

  return (
    <section className="border-t border-[#DAD5C8] bg-[#FCFBF7] py-20 md:py-28" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="container mx-auto px-4">
        <div className="group mx-auto grid max-w-4xl grid-cols-1 items-center gap-6 border border-[#DAD5C8] border-l-[6px] border-l-[#1A1A1A] bg-[#FCFBF7] px-6 py-8 shadow-[0_12px_32px_rgba(26,26,26,0.04)] transition-shadow duration-300 ease-out hover:shadow-[0_16px_48px_rgba(26,26,26,0.08)] sm:grid-cols-[60px_1fr_auto] sm:gap-10 sm:px-10 sm:py-12">
          <div className="hidden h-[60px] w-[60px] items-center justify-center rounded-[2px] bg-[#F5F3EC] transition-transform duration-300 ease-out group-hover:scale-105 sm:flex">
            <MailIcon className="h-8 w-8 text-[#1A1A1A]" strokeWidth={1.5} />
          </div>

          <div>
            <h2
              className="text-[24px] leading-[1.25] tracking-[-0.01em] text-[#1A1A1A] md:text-[28px]"
              style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 500 }}
            >
              See It Work With Your Own RFQs.
            </h2>
            <p className="mt-3 max-w-md text-[14.5px] leading-[1.6] text-[#71716A] transition-colors duration-300 ease-out group-hover:text-[#5C5C55]">
              Connect your inbox and upload your catalog. We'll prepare your first 20 quotations at no cost.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="inline-flex items-center justify-center gap-2.5 rounded-[2px] border-[1.5px] border-[#1A1A1A] bg-[#1A1A1A] px-7 py-3.5 text-[15px] font-medium text-[#FCFBF7] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#FCFBF7] hover:text-[#1A1A1A] hover:shadow-[0_12px_32px_rgba(26,26,26,0.15)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1A1A1A] active:translate-y-0 active:shadow-none sm:w-auto"
          >
            Start setup<span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
