// contexts/UserProvider.jsx
import React, { useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import { getUserProfile } from "../services/userApi";

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

  // ... rest of your functions remain the same
  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    setError(null);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const refreshUser = async () => {
    try {
      const response = await getUserProfile();
      const userData = response.data || response;
      setUser(userData);
    } catch (err) {
      console.error("Error refreshing user:", err);
      setError("Failed to refresh user data");
    }
  };

  // Check if user is authenticated

  const isAuthenticated = () => {
    const token = localStorage.getItem("authToken");
    return !!token && !!user; // Both token and user data must be present
  };

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
  const getUserBookings = () => {
    return user?.bookings || [];
  };

  // Get user's favorites
  const getUserFavorites = () => {
    return user?.favorites || [];
  };

  // Get user's apartments (if host)
  const getUserApartments = () => {
    return user?.apartments || [];
  };

  // Get user's documents
  const getUserDocuments = () => {
    return user?.documents || [];
  };

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
    getUserLocation,
    getUserBookings,
    getUserFavorites,
    getUserApartments,
    getUserDocuments,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
