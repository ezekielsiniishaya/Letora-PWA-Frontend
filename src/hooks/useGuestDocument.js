// hooks/useGuestDocuments.js
import { useContext } from "react";
import { GuestDocumentContext } from "../contexts/GuestDocumentContext";

export const useGuestDocument = () => {
  const context = useContext(GuestDocumentContext);

  if (!context) {
    throw new Error(
      "useGuestDocuments must be used within a GuestDocumentsProvider"
    );
  }

  return context;
};
