import { useEffect, useRef, useState } from "react";

type Options = {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
};

export function useInViewSentinel<T extends HTMLElement = HTMLDivElement>({
  root = null,
  rootMargin = "200px",
  threshold = 0,
}: Options = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      { root, rootMargin, threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [root, rootMargin, threshold]);

  return { ref, inView } as const;
}
