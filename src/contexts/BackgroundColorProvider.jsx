import React, { useState } from "react";
import { BackgroundColorContext } from "./BackgroundColorContext";

export function BackgroundColorProvider({ children }) {
  const [backgroundColor, setBackgroundColor] = useState(null); // no default

  return (
    <BackgroundColorContext.Provider
      value={{ backgroundColor, setBackgroundColor }}
    >
      {children}
    </BackgroundColorContext.Provider>
  );
}
