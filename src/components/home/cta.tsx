import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInViewOnce } from "@/hooks/use-in-view-once";

export function FinalCta() {
  const navigate = useNavigate();
  const { ref, inView } = useInViewOnce<HTMLElement>();

  return (
    <section
      ref={ref}
      className="border-t border-white/10 bg-[#0B1120] py-24"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div
          className={`overflow-hidden rounded-[32px] border border-cyan-400/20 bg-gradient-to-br from-slate-900 via-[#111827] to-[#0F172A] p-12 shadow-2xl transition-all duration-700 ${
            inView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col items-center text-center">

            {/* Icon */}

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-xl shadow-cyan-500/30">
              <Sparkles size={36} className="text-white" />
            </div>

            {/* Heading */}

            <h2
              className="mt-8 text-4xl font-semibold text-white md:text-5xl"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Ready to Automate Your Quoting Process?
            </h2>

            {/* Description */}

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Connect your inbox, upload your product catalog, and let
              FastQuote generate professional quotations in minutes instead of
              hours.
            </p>

            {/* Buttons */}

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">

              <button
                onClick={() => navigate("/register")}
                className="group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/40"
              >
                Get Started Free
                <ArrowRight
                  size={20}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={() => navigate("/signin")}
                className="rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white/10"
              >
                Sign In
              </button>

            </div>

            {/* Bottom Text */}

            <p className="mt-8 text-sm text-slate-500">
              ✓ No Credit Card Required &nbsp;&nbsp; • &nbsp;&nbsp;
              ✓ Enterprise Ready &nbsp;&nbsp; • &nbsp;&nbsp;
              ✓ AI Powered
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}