import React, { useEffect } from "react";
import { useBackgroundColor } from "../contexts/BackgroundColorContext.jsx";

function MainLayout({ children }) {
  const { backgroundColor } = useBackgroundColor();

  useEffect(() => {
    // 1. Set browser theme-color
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", backgroundColor);

    // 2. Set Capacitor status bar background (but NOT style)
    if (window.Capacitor || window.capacitor) {
      import("@capacitor/status-bar").then(({ StatusBar }) => {
        StatusBar.setBackgroundColor({ color: backgroundColor });
      });
    }

    // 3. Set the page's body background directly
    document.body.style.background = backgroundColor;
  }, [backgroundColor]);

  return (
    <div style={{ background: backgroundColor, minHeight: "100vh" }}>
      {children}
    </div>
  );
}

export default MainLayout;
