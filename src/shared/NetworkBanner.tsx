import { useEffect, useState } from "react";

export default function NetworkBanner() {
  const [online, setOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (online) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#f87171",
        color: "#fff",
        padding: "8px 12px",
        borderRadius: 8,
        boxShadow: "0 6px 16px rgba(0,0,0,.2)",
        zIndex: 50,
      }}
    >
      Офлайн режим: данные могут быть неактуальны
    </div>
  );
}
