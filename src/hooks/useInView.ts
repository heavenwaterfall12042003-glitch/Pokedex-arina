import { useEffect, useRef, useState } from "react";

function useInView<T extends HTMLElement>(rootMargin = "200px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let stopped = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (stopped) return;
        const entry = entries[0];
        setInView(entry.isIntersecting);
      },
      { root: null, rootMargin, threshold: 0.01 }
    );

    io.observe(el);
    return () => {
      stopped = true;
      io.disconnect();
    };
  }, [rootMargin]);

  return { ref, inView };
}

export default useInView;
export { useInView };
