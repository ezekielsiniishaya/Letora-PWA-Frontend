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
  const [error] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  const { isAuthenticated, getUserLocation, user } = useUser();

  // Fetch hot apartments - UPDATED with location
  const fetchHotApartments = useCallback(
    async (state = null, town = null) => {
      setHotApartmentsLoading(true);
      try {
        const excludeHostId = user?.id || null;
        console.log(
          "Fetching hot apartments, excluding host ID:",
          excludeHostId
        );

        // Get user location if not provided
        let userState = state;
        let userTown = town;

        if (!userState && isAuthenticated && user) {
          const userLocation = getUserLocation();
          userState = userLocation?.state || user.stateOrigin;
        }

        const response = await getHotApartments(
          10,
          excludeHostId,
          userState,
          userTown
        );
        setHotApartments(response.data);
      } catch (err) {
        console.error("Error fetching hot apartments:", err);
        setHotApartments([]);
      } finally {
        setHotApartmentsLoading(false);
      }
    },
    [user, isAuthenticated, getUserLocation]
  );

  // Fetch all approved apartments
  const fetchApartments = useCallback(async () => {
    setLoading(true);
    try {
      const excludeHostId = user?.id || null;
      const response = await getApprovedApartments(excludeHostId);
      setApartments(response.data);
    } catch (err) {
      console.error("Error fetching apartments:", err);
      setApartments([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch nearby apartments - UPDATED to use selectedLocation from context
  const fetchNearbyApartments = useCallback(
    async (state = null, town = null) => {
      setNearbyApartmentsLoading(true);
      try {
        const excludeHostId = user?.id || null;
        let userState = state;
        let userTown = town;

        if (!userState && isAuthenticated && user) {
          const userLocation = getUserLocation();
          userState = userLocation?.state || user.stateOrigin;
        }

        if (userState) {
          const response = await getNearbyApartments(
            userState,
            userTown,
            excludeHostId
          );
          setNearbyApartments(response.data);
        } else {
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

  // Clear apartments
  const clearApartments = () => {
    setApartments([]);
    setHotApartments([]);
    setNearbyApartments([]);
    setHasFetched(false);
  };

  // Get apartment by ID
  const getApartmentById = (id) => {
    return apartments.find((apt) => apt.id === id);
  };

  // Refresh all data - UPDATED to include location
  const refreshApartments = useCallback(
    (state = null, town = null) => {
      setHasFetched(false);
      fetchApartments();
      fetchHotApartments(state, town);
      fetchNearbyApartments(state, town);
    },
    [fetchApartments, fetchHotApartments, fetchNearbyApartments]
  );

  // Fetch data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      if (hasFetched) return;

      let userState = null;
      let userTown = null;

      if (isAuthenticated && user) {
        const userLocation = getUserLocation();
        userState = userLocation?.state || user.stateOrigin;
      }

      await Promise.all([
        fetchApartments(),
        fetchHotApartments(userState, userTown),
        fetchNearbyApartments(userState, userTown),
      ]);
      setHasFetched(true);
    };

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
    getUserLocation,
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
    clearApartments,
  };

  return (
    <ApartmentListingContext.Provider value={value}>
      {children}
    </ApartmentListingContext.Provider>
  );
};

export default ApartmentListingProvider;
