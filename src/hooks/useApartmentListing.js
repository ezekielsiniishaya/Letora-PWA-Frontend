// hooks/useApartmentListing.js
import { useContext } from "react";
import { ApartmentListingContext } from "../contexts/ApartmentListingContext";

export const useApartmentListing = () => {
  const context = useContext(ApartmentListingContext);
  if (!context) {
    throw new Error(
      "useApartmentListing must be used within ApartmentListingProvider"
    );
  }
  return context;
};
