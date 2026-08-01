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
      className="border-t border-[#DAD5C8] bg-[#FCFBF7] py-16 md:py-24"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className="container mx-auto px-4">
        <div
          className={`mx-auto max-w-xl text-center opacity-100 motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out ${
            inView ? "" : "motion-safe:-translate-x-10 motion-safe:opacity-0"
          }`}
        >
          <h2
            className="text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.5px] text-[#1A1A1A] md:text-[2.5rem]"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            How It Works
          </h2>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-12">
          {STEPS.map((s, idx) => (
            <div
              key={s.n}
              className={`opacity-100 motion-safe:transition-all motion-safe:ease-out motion-safe:[transition-duration:800ms] ${
                inView ? "" : "motion-safe:translate-y-10 motion-safe:opacity-0"
              }`}
              style={{ transitionDelay: `${(idx + 1) * 100}ms` }}
            >
              <div className="group flex h-full flex-col border-2 border-[#1A1A1A] bg-[#FCFBF7] p-6 transition-all duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-[1.02] hover:bg-[color-mix(in_srgb,#1A1A1A_2%,#FCFBF7)] hover:shadow-[0_10px_30px_rgba(26,26,26,0.07)]">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-[#DAD5C8] font-mono text-[16px] font-semibold text-[#9A998F] transition-all duration-300 ease-out group-hover:border-[#1A1A1A] group-hover:bg-[#1A1A1A] group-hover:text-[#FCFBF7] motion-safe:group-hover:scale-110"
                >
                  {s.n}
                </span>
                <h3
                  className="mt-6 text-[19px] text-[#1A1A1A]"
                  style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 500 }}
                >
                  {s.title}
                </h3>
                <p className="mt-2.5 text-[14.5px] leading-[1.6] text-[#71716A]">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
