import { useMemo, useState } from "react";
import {
  ToastContext,
  type ToastCtx,
  type ToastItem,
  type ToastKind,
} from "../shared/ToastContext";

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const show = (text: string, kind: ToastKind = "info") => {
    const id = Date.now();
    setItems((a) => [...a, { id, text, kind }]);
    setTimeout(() => setItems((a) => a.filter((t) => t.id !== id)), 3000);
  };

  const value = useMemo<ToastCtx>(() => ({ show }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          zIndex: 1000,
        }}
      >
        {items.map((t) => (
          <div
            key={t.id}
            style={{
              border: "1px solid var(--border)",
              background:
                t.kind === "error"
                  ? "#fee2e2"
                  : t.kind === "success"
                    ? "#dcfce7"
                    : "var(--chip-bg)",
              color: "var(--fg)",
              borderRadius: 10,
              padding: "8px 12px",
              minWidth: 220,
            }}
          >
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
