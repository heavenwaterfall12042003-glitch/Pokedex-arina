import { useEffect } from "react";
import Portal from "../../shared/Portal";

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ open, onClose, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prevOverflow = document.documentElement.style.overflow;
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.45)",
          display: "grid",
          placeItems: "center",
          zIndex: 50,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "min(720px, 92vw)",
            maxHeight: "90vh",
            overflow: "auto",
            background: "var(--card-bg)",
            color: "var(--card-fg)",
            borderRadius: 12,
            border: "1px solid var(--border)",
            padding: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,.25)",
          }}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
}
