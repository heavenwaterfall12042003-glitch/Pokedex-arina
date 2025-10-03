import { useEffect, useRef, useState } from "react";

export function useSentinel<T extends HTMLElement>(rootMargin = "300px") {
  const ref = useRef<T | null>(null);
  const [hit, setHit] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setHit(true);
          }
        });
      },
      { root: null, rootMargin, threshold: 0.01 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);

  const reset = () => setHit(false);

  return { ref, hit, reset };
}
