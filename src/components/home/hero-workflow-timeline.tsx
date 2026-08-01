import { useEffect, useRef, useState } from "react";

const STEPS: { actor: string; label: string; you?: boolean }[] = [
  { actor: "Agent", label: "Reads the email" },
  { actor: "Agent", label: "Matches your catalog" },
  { actor: "Agent", label: "Drafts the quotation" },
  { actor: "You", label: "Review and Approve", you: true },
  { actor: "Agent", label: "Shares the quotation" },
];

const HOLD = [2400, 3000, 3200, 3200, 3400];

const TRACK_COLS = "grid-cols-2 md:grid-cols-3 lg:grid-cols-5";

// At the lg breakpoint dots are pinned to fixed 0/25/50/75/100% points (equal gaps,
// first and last flush with the line's ends) instead of sitting at grid-column starts.
const LG_DOT_POSITION = [
  "lg:left-0 lg:translate-x-0",
  "lg:left-1/4 lg:-translate-x-1/2",
  "lg:left-1/2 lg:-translate-x-1/2",
  "lg:left-3/4 lg:-translate-x-1/2",
  "lg:left-full lg:-translate-x-full",
];

// Labels reuse the dots' fixed positions so each one sits directly under its own dot.
const LG_LABEL_ALIGN = ["lg:text-left", "lg:text-center", "lg:text-center", "lg:text-center", "lg:text-right"];

export function HeroWorkflowTimeline() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || paused || !visible) return;
    const t = setTimeout(() => setI((n) => (n + 1) % STEPS.length), HOLD[i]);
    return () => clearTimeout(t);
  }, [i, paused, visible, reduced]);

  const fillPct = (i / (STEPS.length - 1)) * 100;

  return (
    <div
      ref={railRef}
      className="mt-11 md:mt-[4.5rem]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Dot track: dots only, one shared grid, so nothing else can affect row height */}
      <div className={`relative grid gap-x-4 ${TRACK_COLS} lg:h-6`}>
        <div className="absolute inset-0 hidden items-center lg:flex">
          <div className="h-px w-full bg-[#DAD5C8]" />
        </div>
        <div className="absolute inset-0 hidden items-center lg:flex">
          <div
            className="h-[1.5px] bg-[#1A1A1A]"
            style={{ width: `${fillPct}%`, transition: "width 620ms cubic-bezier(.2,.7,.3,1)" }}
          />
        </div>

        {STEPS.map((s, n) => {
          const done = n < i;
          const now = n === i;
          return (
            <button
              key={n}
              type="button"
              onClick={() => setI(n)}
              className={`flex h-6 cursor-pointer items-center border-none bg-none p-0 lg:absolute lg:top-1/2 lg:-translate-y-1/2 ${LG_DOT_POSITION[n]}`}
            >
              <span
                className="relative z-10 block h-[11px] w-[11px] rounded-full border-2 transition-colors duration-300"
                style={{
                  borderColor: done || now ? "#1A1A1A" : "#DAD5C8",
                  background: s.you ? "#FCFBF7" : done || now ? "#1A1A1A" : "#FCFBF7",
                }}
              >
                {now && n !== STEPS.length - 1 && (
                  <span className="absolute -inset-1.5 animate-[qa-ring_2.4s_cubic-bezier(.2,.7,.3,1)_infinite] rounded-full border border-[#1A1A1A] opacity-0" />
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Label track: separate grid for mobile/tablet wrap; pinned to the dots' fixed points at lg */}
      <div className={`relative mt-4 grid gap-x-4 gap-y-8 ${TRACK_COLS} lg:min-h-[3.75rem] lg:gap-y-0`}>
        {STEPS.map((s, n) => {
          const done = n < i;
          const now = n === i;
          return (
            <button
              key={n}
              type="button"
              onClick={() => setI(n)}
              onFocus={() => setI(n)}
              className={`block cursor-pointer border-none bg-none p-0 pr-2.5 text-left font-sans lg:w-[15ch] lg:p-0 lg:top-0 ${LG_DOT_POSITION[n]} ${LG_LABEL_ALIGN[n]} lg:absolute`}
            >
              <span
                className="mb-1.5 block font-mono text-[9.5px] uppercase tracking-[0.14em] transition-colors duration-300"
                style={{ color: now ? (s.you ? "#1D7A46" : "#1A1A1A") : "#9A998F" }}
              >
                {s.actor}
              </span>
              <span
                className="block max-w-[15ch] text-[13.5px] leading-[1.35] transition-colors duration-300 lg:max-w-none"
                style={{
                  color: now ? "#1A1A1A" : done ? "#4A4A45" : "#71716A",
                  fontWeight: now ? 500 : 400,
                }}
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes qa-ring {
          0% { transform: scale(.6); opacity: .5 }
          70% { transform: scale(1.15); opacity: 0 }
          100% { opacity: 0 }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[qa-ring_2\\.4s_cubic-bezier\\(\\.2\\,\\.7\\,\\.3\\,1\\)_infinite\\] { animation: none !important }
        }
      `}</style>
    </div>
  );
}
