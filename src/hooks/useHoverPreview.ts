import { useEffect, useRef, useState } from "react";

export function useHoverPreview(delay = 250) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const timer = useRef<number | null>(null);

  const onEnter = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setCoords({ x: clientX, y: clientY });
      setVisible(true);
    }, delay);
  };

  const onLeave = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    setVisible(false);
  };

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  return { visible, coords, onEnter, onLeave, setVisible } as const;
}
