import { useEffect, useState } from "react";

export default function ScrollTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Наверх"
      style={{
        position: "fixed",
        right: 16,
        bottom: 72,
        width: 44,
        height: 44,
        borderRadius: 22,
        border: "1px solid var(--border)",
        background: "var(--card)",
        color: "var(--text)",
        boxShadow: "var(--shadow)",
        cursor: "pointer",
        zIndex: 50,
      }}
      title="Наверх"
    >
      ↑
    </button>
  );
}
