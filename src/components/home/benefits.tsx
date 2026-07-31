const BENEFITS = [
  {
    title: "Never miss an RFQ",
    description: "Every email is read the moment it lands, even during your busiest hours.",
  },
  {
    title: "Built for large catalogs",
    description: "Price thousands of SKUs without a manual lookup for every line.",
  },
  {
    title: "Faster than manual quoting",
    description: "Cut average response time from 1–2 days to under an hour.",
  },
  {
    title: "Consistent pricing, every time",
    description: "The same catalog and logic price every quote — no variation by who typed it.",
  },
];

export function Benefits() {
  return (
    <section className="border-t border-[#DAD5C8] bg-[#FCFBF7] py-16 md:py-24" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="container mx-auto px-4">
        <div className="max-w-xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#9A998F]">Built for industrial suppliers</p>
          <h2
            className="mt-3 text-[28px] leading-[1.15] text-[#1A1A1A] md:text-[34px]"
            style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 400 }}
          >
            Quoted the way your business actually runs.
          </h2>
        </div>

        <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b, idx) => (
            <div key={b.title} className={idx > 0 ? "lg:border-l lg:border-[#DAD5C8] lg:pl-10" : ""}>
              <h3 className="text-[15px] font-medium text-[#1A1A1A]">{b.title}</h3>
              <p className="mt-2 text-[13.5px] leading-[1.6] text-[#71716A]">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
