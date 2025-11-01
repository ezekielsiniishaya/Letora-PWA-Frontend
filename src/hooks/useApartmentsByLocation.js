// hooks/useApartmentsByLocation.js
import { useState, useEffect, useContext, useCallback } from "react";
import { UserContext } from "../contexts/UserContext";
import { getApprovedApartments } from "../services/apartmentApi";

export const useApartmentsByLocation = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getUserLocation } = useContext(UserContext);

  const fetchApprovedApartmentsByLocation = useCallback(
    async (state = null) => {
      try {
        setLoading(true);
        setError(null);

        // Use provided state or get from user context
        const location = state || getUserLocation()?.state;

        if (!location) {
          console.log("No location specified for apartment search");
          setApartments([]);
          return;
        }

        console.log("🏠 Fetching approved apartments for location:", location);

        // Use the correct getApprovedApartments function
        const response = await getApprovedApartments();

        // Filter apartments by the selected location
        const allApartments = response.data || response.apartments || response;
        const apartmentsArray = Array.isArray(allApartments)
          ? allApartments
          : [];

        // Filter by location
        const filteredApartments = apartmentsArray.filter(
          (apartment) =>
            apartment.state === location ||
            apartment.location?.state === location
        );

        setApartments(filteredApartments);

        console.log(
          `✅ Found ${
            filteredApartments.length || 0
          } approved apartments in ${location}`
        );

        return filteredApartments;
      } catch (err) {
        console.error("❌ Error fetching apartments by location:", err);
        const errorMessage = err.message || "Failed to fetch apartments";
        setError(errorMessage);
        setApartments([]);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getUserLocation]
  );

  // Auto-fetch when location changes
  useEffect(() => {
    const location = getUserLocation();
    if (location?.state) {
      fetchApprovedApartmentsByLocation();
    }
  }, [getUserLocation()?.state, fetchApprovedApartmentsByLocation]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    apartments,
    loading,
    error,
    fetchApprovedApartmentsByLocation,
    clearError,
    refetch: () => fetchApprovedApartmentsByLocation(),
  };
};
