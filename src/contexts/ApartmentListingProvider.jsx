// contexts/ApartmentListingProvider.jsx
import React, { useState, useEffect, useCallback } from "react";
import { ApartmentListingContext } from "./ApartmentListingContext";
import { useUser } from "../hooks/useUser";
import {
  getApprovedApartments,
  getHotApartments,
  getNearbyApartments,
} from "../services/apartmentApi";

const ApartmentListingProvider = ({ children }) => {
  const [apartments, setApartments] = useState([]);
  const [hotApartments, setHotApartments] = useState([]);
  const [nearbyApartments, setNearbyApartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hotApartmentsLoading, setHotApartmentsLoading] = useState(false);
  const [nearbyApartmentsLoading, setNearbyApartmentsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  const { isAuthenticated, getUserLocation, user } = useUser();

  // Fetch all approved apartments
  const fetchApartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getApprovedApartments();
      setApartments(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch apartments");
      console.error("Error fetching apartments:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch hot apartments
  const fetchHotApartments = useCallback(async () => {
    setHotApartmentsLoading(true);
    try {
      const response = await getHotApartments();
      setHotApartments(response.data);
    } catch (err) {
      console.error("Error fetching hot apartments:", err);
      setHotApartments([]);
    } finally {
      setHotApartmentsLoading(false);
    }
  }, []);

  // Fetch nearby apartments using user's actual location
  const fetchNearbyApartments = useCallback(
    async (state = null, town = null) => {
      setNearbyApartmentsLoading(true);
      try {
        // Use provided location or fallback to user's actual location
        let userState = state;
        let userTown = town;

        if (!userState && isAuthenticated && user) {
          const userLocation = getUserLocation();
          userState = userLocation?.state || user.stateOrigin;
        }

        // Only fetch if we have a location
        if (userState) {
          const response = await getNearbyApartments(userState, userTown);
          setNearbyApartments(response.data);
        } else {
          // If no user location, show empty array
          setNearbyApartments([]);
        }
      } catch (err) {
        console.error("Error fetching nearby apartments:", err);
        setNearbyApartments([]);
      } finally {
        setNearbyApartmentsLoading(false);
      }
    },
    [isAuthenticated, getUserLocation, user]
  );

  // Get apartment by ID
  const getApartmentById = (id) => {
    return apartments.find((apt) => apt.id === id);
  };

  // Refresh all data
  const refreshApartments = useCallback(() => {
    setHasFetched(false); // Reset to allow fresh fetch
    fetchApartments();
    fetchHotApartments();
    fetchNearbyApartments();
  }, [fetchApartments, fetchHotApartments, fetchNearbyApartments]);

  // Fetch data on component mount - only when user is available
  useEffect(() => {
    const fetchAllData = async () => {
      if (hasFetched) return; // Prevent duplicate fetches

      await Promise.all([
        fetchApartments(),
        fetchHotApartments(),
        fetchNearbyApartments(),
      ]);
      setHasFetched(true);
    };

    // Only fetch if we have user data or we're not authenticated
    if ((!isAuthenticated || user) && !hasFetched) {
      fetchAllData();
    }
  }, [
    fetchApartments,
    fetchHotApartments,
    fetchNearbyApartments,
    isAuthenticated,
    user,
    hasFetched,
  ]);

  const value = {
    apartments,
    hotApartments,
    nearbyApartments,
    loading,
    hotApartmentsLoading,
    nearbyApartmentsLoading,
    error,
    fetchApartments,
    fetchHotApartments,
    fetchNearbyApartments,
    getApartmentById,
    refreshApartments,
  };

  return (
    <ApartmentListingContext.Provider value={value}>
      {children}
    </ApartmentListingContext.Provider>
  );
};

export default ApartmentListingProvider;
