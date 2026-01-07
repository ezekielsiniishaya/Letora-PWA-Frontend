import { useEffect, useRef } from "react";

export default function PullToRefresh({ onRefresh, enabled, containerId }) {
  const startY = useRef(0);
  const pulling = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const container = containerId
      ? document.getElementById(containerId)
      : document.scrollingElement;

    if (!container) return;

    const atTop = () => container.scrollTop === 0;

    const onTouchStart = (e) => {
      if (atTop()) {
        startY.current = e.touches[0].clientY;
        pulling.current = true;
      }
    };

    const onTouchMove = (e) => {
      if (!pulling.current) return;

      const deltaY = e.touches[0].clientY - startY.current;
      if (deltaY > 120) {
        pulling.current = false;
        onRefresh();
      }
    };

    const onTouchEnd = () => {
      pulling.current = false;
      startY.current = 0;
    };

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onTouchEnd);

    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [enabled, onRefresh, containerId]);

  return null;
}
