const STEPS = [
  {
    n: "01",
    title: "An RFQ arrives",
    description:
      "The agent watches your inbox for quotation requests and reads every line — items, quantities, delivery terms.",
  },
  {
    n: "02",
    title: "It prices from your catalog",
    description:
      "Every line is matched against the price data you uploaded. Anything it can't price is flagged for you, never guessed.",
  },
  {
    n: "03",
    title: "You approve, quotation sent",
    description:
      "A finished quotation lands in your review queue. One click to approve, and it's emailed with a full audit trail.",
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
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#9A998F]">How it works</p>
          <h2
            className="mt-3 text-[28px] leading-[1.15] text-[#1A1A1A] md:text-[34px]"
            style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 400 }}
          >
            One workflow, three steps.
          </h2>
        </div>

        <div className="mt-14 grid gap-10 border-t border-[#DAD5C8] pt-10 md:grid-cols-3 md:gap-12">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="group border-l-[3px] border-[#DAD5C8] pl-5 transition-colors duration-300 ease-out hover:border-[#1A1A1A]"
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
