import { useEffect, useRef, useState } from "react";

export function useInViewOnce<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    // Wait a frame so the hidden starting state paints at least once before
    // the observer's first check can immediately flip inView to true for
    // content that's already in the viewport on load (e.g. near the top of the page).
    const raf = requestAnimationFrame(() => observer.observe(el));
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [inView, threshold]);

  return { ref, inView };
}
