// contexts/UserProvider.jsx
import React, { useState, useEffect, useCallback } from "react";
import { UserContext } from "./UserContext";
import { getUserProfile } from "../services/userApi";
import { toggleFavoriteAPI } from "../services/apartmentApi"; // Import the toggle favorite API

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");

        if (token) {
          try {
            const response = await getUserProfile();
            console.log("Profile API response:", response); // Debug log

            // Extract the actual user data from the response
            // The API returns { success: true, data: userObject }
            const userData = response.data || response;

            console.log("Extracted user data:", userData); // Debug log

            setUser(userData);
          } catch (err) {
            console.warn(
              "Could not fetch user profile, but user remains authenticated:",
              err.message
            );
            // Set basic authenticated state
            setUser({ isAuthenticated: true });
          }
        } else {
          // No token, user is not authenticated
          setUser(null);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  // Login function - also fix this to handle response structure
  const login = (userData, token) => {
    // userData might be the full API response, extract the actual user data
    const actualUserData = userData.data || userData;
    setUser(actualUserData);
    localStorage.setItem("authToken", token);
    setError(null);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    setError(null);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  // In UserProvider.jsx
  const refreshUser = useCallback(async () => {
    try {
      const response = await getUserProfile();
      const userData = response.data || response;
      setUser(userData);
    } catch (err) {
      console.error("Error refreshing user:", err);
      setError("Failed to refresh user data");
    }
  }, []); // Add useCallback with empty dependencies

  // Add to favorites function
  const addToFavorites = useCallback(
    async (apartmentId) => {
      try {
        const response = await toggleFavoriteAPI(apartmentId);

        if (response.success) {
          // Refresh user data to get updated favorites
          await refreshUser();
          return { success: true };
        } else {
          throw new Error(response.message || "Failed to add to favorites");
        }
      } catch (err) {
        console.error("Error adding to favorites:", err);
        setError("Failed to add to favorites");
        return { success: false, error: err.message };
      }
    },
    [refreshUser]
  );

  // Remove from favorites function
  const removeFromFavorites = useCallback(
    async (apartmentId) => {
      try {
        const response = await toggleFavoriteAPI(apartmentId);

        if (response.success) {
          // Refresh user data to get updated favorites
          await refreshUser();
          return { success: true };
        } else {
          throw new Error(
            response.message || "Failed to remove from favorites"
          );
        }
      } catch (err) {
        console.error("Error removing from favorites:", err);
        setError("Failed to remove from favorites");
        return { success: false, error: err.message };
      }
    },
    [refreshUser]
  );

  // Refresh favorites function (alternative to refreshUser for just favorites)
  const refreshFavorites = useCallback(async () => {
    try {
      const response = await getUserProfile();
      const userData = response.data || response;

      // Update only favorites in user state
      setUser((prevUser) => ({
        ...prevUser,
        favorites: userData.favorites || [],
      }));

      return userData.favorites || [];
    } catch (err) {
      console.error("Error refreshing favorites:", err);
      setError("Failed to refresh favorites");
      return [];
    }
  }, []);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem("authToken");
    return !!token && !!user;
  }, [user]);

  // Check user role
  const isHost = user?.role === "HOST";
  const isGuest = user?.role === "GUEST";
  const isAdmin = user?.role === "ADMIN";

  // Get user's location
  const getUserLocation = () => {
    return {
      state: user?.location?.state || user?.stateOrigin,
      town: user?.location?.town || user?.townOrigin,
    };
  };

  // Get user's bookings
  const getUserBookings = useCallback(() => {
    return user?.bookings || [];
  }, [user]);

  // Get user's favorites
  const getUserFavorites = useCallback(() => {
    return user?.favorites || [];
  }, [user]);

  // Get user's apartments (if host)
  const getUserApartments = useCallback(() => {
    return user?.apartments || [];
  }, [user]);

  // Get user's documents
  const getUserDocuments = useCallback(() => {
    return user?.documents || [];
  }, [user]);

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    isHost,
    isGuest,
    isAdmin,
    login,
    logout,
    updateUser,
    refreshUser,
    refreshFavorites,
    addToFavorites,
    removeFromFavorites,
    getUserLocation,
    getUserBookings,
    getUserFavorites,
    getUserApartments,
    getUserDocuments,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
