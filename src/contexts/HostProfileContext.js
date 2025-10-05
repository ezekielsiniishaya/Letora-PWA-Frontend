// contexts/HostProfileContext.js
import React, { createContext, useContext } from "react";

export const HostProfileContext = createContext();

// Add this custom hook export
export const useHostProfile = () => {
  const context = useContext(HostProfileContext);
  if (context === undefined) {
    throw new Error("useHostProfile must be used within a HostProfileProvider");
  }
  return context;
};
