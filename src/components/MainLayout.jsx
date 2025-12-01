import React, { useEffect } from "react";
import { useBackgroundColor } from "../contexts/BackgroundColorContext.jsx";

function MainLayout({ children }) {
  const { backgroundColor } = useBackgroundColor();

  useEffect(() => {
    if (!backgroundColor) return;

    // Meta theme-color for PWA
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", backgroundColor);

    // Native status bar background
    if (window.Capacitor || window.capacitor) {
      import("@capacitor/status-bar").then(({ StatusBar }) => {
        StatusBar.setBackgroundColor({ color: backgroundColor });
      });
    }
  }, [backgroundColor]);

  // Do NOT set document.body.style.background here if you only care about status bar
  return <div>{children}</div>;
}

export default MainLayout;
