import React, { useState } from "react";
import { BackgroundColorContext } from "./BackgroundColorContext";

export function BackgroundColorProvider({ children }) {
  const [backgroundColor, setBackgroundColor] = useState("#A20BA2");

  return (
    <BackgroundColorContext.Provider
      value={{ backgroundColor, setBackgroundColor }}
    >
      {children}
    </BackgroundColorContext.Provider>
  );
}
