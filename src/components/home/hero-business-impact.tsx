const ROWS = [
  { label: "Time to first quote", manual: "1–2 days", agent: "34 min avg" },
  { label: "RFQs missed", manual: "~1 in 5", agent: "Every email read" },
  { label: "Pricing errors", manual: "Frequent", agent: "Catalog only" },
  { label: "Hours per week", manual: "10–15 h", agent: "~1 h review" },
];

export function HeroBusinessImpact() {
  return (
    <div className="mt-7 rounded-[3px] border border-[#DAD5C8] bg-[#FCFBF7] md:mt-9">
      <div className="flex items-baseline justify-between gap-4 border-b border-[#DAD5C8] px-5 py-3.5 md:px-7">
        <span
          className="text-[13.5px] italic text-[#1A1A1A]"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          What changes after this workflow
        </span>
        <div className="flex gap-6 font-mono text-[10px] uppercase tracking-[0.12em] text-[#9A998F] sm:gap-9">
          <span>Manual</span>
          <span className="text-[#1D7A46]">QuoteAgent</span>
        </div>
      </div>

      <div className="divide-y divide-[#F1EFE7] px-5 md:px-7">
        {ROWS.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 py-3.5 text-[13.5px]">
            <span className="text-[#43433E]">{row.label}</span>
            <span className="flex items-baseline gap-6 sm:gap-9">
              <span className="w-[7ch] text-right font-mono text-[12.5px] text-[#9A998F] sm:w-[9ch]">
                {row.manual}
              </span>
              <span className="w-[9ch] text-right font-mono text-[12.5px] font-medium text-[#1D7A46] sm:w-[11ch]">
                {row.agent}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
