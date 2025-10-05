// hooks/useHostProfile.js
import { useContext } from "react";
import { HostProfileContext } from "../contexts/HostProfileContext";

export const useHostProfile = () => {
  const context = useContext(HostProfileContext);

  if (!context) {
    throw new Error("useHostProfile must be used within a HostProfileProvider");
  }

  return context;
};
