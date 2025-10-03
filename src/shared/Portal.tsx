import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

type Props = { children: React.ReactNode; containerId?: string };

export default function Portal({
  children,
  containerId = "portal-root",
}: Props) {
  const el = useMemo(() => document.createElement("div"), []);
  useEffect(() => {
    let root = document.getElementById(containerId);
    if (!root) {
      root = document.createElement("div");
      root.id = containerId;
      document.body.appendChild(root);
    }
    root.appendChild(el);
    return () => {
      root?.removeChild(el);
    };
  }, [containerId, el]);
  return createPortal(children, el);
}
