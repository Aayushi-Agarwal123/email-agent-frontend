const STEPS = [
  {
    n: "01",
    title: "RFQ Received",
    description:
      "Monitors your inbox, extracts every line item, quantity, and requirement, and turns unstructured RFQs into structured requests.",
  },
  {
    n: "02",
    title: "Intelligent Retrieval & Pricing",
    description:
      "Understands customer requirements, finds the right products across complex catalogs, asks clarifying questions when needed, and generates accurate pricing.",
  },
  {
    n: "03",
    title: "Review & Approve",
    description:
      "Review the draft quotation, approve it, and send it with a complete audit trail.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-t border-[#DAD5C8] bg-[#FCFBF7] py-16 md:py-24"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-xl">
          <h2
            className="text-[2rem] font-semibold leading-[1.15] tracking-[-0.5px] text-[#1A1A1A] md:text-[3rem]"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            How It Works
          </h2>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-12">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="group border-2 border-[#1A1A1A] bg-[#FCFBF7] p-6 transition-all duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-[1.02] hover:bg-[color-mix(in_srgb,#1A1A1A_2%,#FCFBF7)] hover:shadow-[0_10px_30px_rgba(26,26,26,0.07)]"
            >
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
          ))}
        </div>
      </div>
    </section>
  );
}
