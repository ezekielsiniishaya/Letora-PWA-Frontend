import { LocationContext } from "./LocationContext";
import { useState } from "react";

export function LocationProvider({ children }) {
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <LocationContext.Provider value={{ selectedLocation, setSelectedLocation }}>
      {children}
    </LocationContext.Provider>
  );
}
