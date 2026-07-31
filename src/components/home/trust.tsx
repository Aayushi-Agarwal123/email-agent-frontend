const POINTS = [
  {
    title: "You approve every quotation",
    description: "Nothing is emailed to a customer until you click approve. The agent drafts; you decide.",
  },
  {
    title: "Your data stays yours",
    description: "Your catalog and inbox are never shared, sold, or used to train anything outside your account.",
  },
  {
    title: "Full audit trail",
    description: "Every quotation — drafted, edited, or approved — is logged with a timestamp you can review anytime.",
  },
  {
    title: "Read-and-send access only",
    description: "A verified connection to one mailbox. The agent never deletes or moves your mail.",
  },
];

export function Trust() {
  return (
    <section id="trust" className="border-t border-[#DAD5C8] bg-[#FCFBF7] py-16 md:py-24" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="container mx-auto px-4">
        <div className="max-w-xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#9A998F]">Why you can trust it</p>
          <h2
            className="mt-3 text-[28px] leading-[1.15] text-[#1A1A1A] md:text-[34px]"
            style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 400 }}
          >
            Built for suppliers who can't afford a mistake in a customer's inbox.
          </h2>
        </div>

        <div className="group/grid mt-14 grid gap-6 sm:grid-cols-2">
          {POINTS.map((p) => (
            <div
              key={p.title}
              className="group/card relative border border-[#DAD5C8] p-8 transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:border-[#1A1A1A] hover:bg-white hover:shadow-[0_8px_24px_rgba(26,26,26,0.08)] motion-safe:hover:-translate-y-1 group-hover/grid:[&:not(:hover)]:opacity-40"
            >
              <h3 className="text-[15.5px] font-medium text-[#1A1A1A]">{p.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.6] text-[#71716A]">{p.description}</p>
              <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#1A1A1A] transition-[width] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/card:w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
