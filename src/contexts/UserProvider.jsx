// contexts/UserProvider.jsx
import React, { useState, useEffect, useCallback } from "react";
import { UserContext } from "./UserContext";
import { getUserProfile } from "../services/userApi";
import { toggleFavoriteAPI } from "../services/apartmentApi";
import { markNotificationAsRead } from "../services/userApi";
import { deleteReadNotifications as deleteReadNotificationsApi } from "../services/userApi";

const AUTH_TOKEN_KEY = "token";
const USER_LOCATION_KEY = "userLocation";

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  // Get token helper
  const getToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

  // Set token helper
  const setToken = (token) => {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  };

  // Initialize user location from localStorage
  useEffect(() => {
    const savedLocation = localStorage.getItem(USER_LOCATION_KEY);
    if (savedLocation) {
      try {
        setCurrentLocation(JSON.parse(savedLocation));
      } catch (err) {
        console.error("Error parsing saved location:", err);
        localStorage.removeItem(USER_LOCATION_KEY);
      }
    }
  }, []);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        setLoading(true);
        const token = getToken();

        console.log("🔄 Initializing user, token found:", !!token);

        if (token) {
          try {
            console.log("🔄 Fetching user profile with token...");
            const response = await getUserProfile();
            console.log("Profile API response:", response);

            // Extract the actual user data from the response
            const userData = response.data || response;

            console.log("✅ User initialized successfully:", userData);
            setUser(userData);
            setError(null);
          } catch (err) {
            console.error("❌ Error fetching user profile:", err);

            // Check if it's an authentication error
            if (err.response?.status === 401) {
              console.warn("Authentication failed, clearing token");
              setToken(null); // Clear invalid token
              setUser(null);
              setError("Session expired. Please login again.");
            } else {
              // For other errors, keep user as authenticated but show warning
              console.warn("Could not fetch user profile, but token is valid");
              setUser({ isAuthenticated: true });
              setError("Could not load user profile");
            }
          }
        } else {
          // No token, user is not authenticated
          console.log("No token found, user is not authenticated");
          setUser(null);
          setError(null);
        }
      } catch (err) {
        console.error("Unexpected error during initialization:", err);
        setError("Failed to initialize user");
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  // Set user location function
  const setUserLocation = useCallback((location) => {
    console.log("📍 Setting user location:", location);

    // Save to state
    setCurrentLocation(location);

    // Save to localStorage
    localStorage.setItem(USER_LOCATION_KEY, JSON.stringify(location));

    // Update user context if user is logged in
    setUser((prev) => (prev ? { ...prev, currentLocation: location } : prev));

    console.log("✅ Location saved to localStorage and state");
  }, []);

  // Get user location function
  const getUserLocation = useCallback(() => {
    // Priority: 1. Current location state, 2. User profile location, 3. Default
    if (currentLocation) {
      return currentLocation;
    }

    if (user?.currentLocation) {
      return user.currentLocation;
    }

    if (user?.location?.state) {
      return { state: user.location.state, town: user.location.town };
    }

    return null;
  }, [currentLocation, user]);

  // Clear user location
  const clearUserLocation = useCallback(() => {
    setCurrentLocation(null);
    localStorage.removeItem(USER_LOCATION_KEY);
    console.log("📍 User location cleared");
  }, []);

  // Login function
  const login = async (userData, token) => {
    try {
      setLoading(true);
      setError(null);

      // ✅ Store token as "token"
      setToken(token);
      console.log("✅ Token stored as 'token':", token ? "Yes" : "No");

      try {
        // Fetch complete user profile with notifications
        console.log("🔄 Fetching user profile after login...");
        const profileResponse = await getUserProfile();
        const completeUserData = profileResponse.data || profileResponse;

        console.log("✅ Complete user data after login:", completeUserData);
        setUser(completeUserData);
        setError(null);
      } catch (profileErr) {
        console.error(
          "❌ Error fetching user profile after login:",
          profileErr
        );

        // Fallback: use the basic user data from login
        const actualUserData = userData.data || userData;
        console.log("🔄 Using fallback user data:", actualUserData);
        setUser(actualUserData);
        setError("Logged in but could not load complete profile");
      }
    } catch (err) {
      console.error("❌ Error during login process:", err);
      setError("Login failed");
      // Clear the token if login fails
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  const logout = useCallback(() => {
    console.log("🚪 Logging out user...");

    // Clear user-specific search history
    const userId = user?.id || "anonymous";
    const storageKey = `apartmentSearchHistory_${userId}`;
    localStorage.removeItem(storageKey);

    // Clear all other user-related localStorage items
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_LOCATION_KEY);

    // Clear any additional potential storage items that might contain user data
    const userStorageKeys = [
      "userPreferences",
      "userSettings",
      "recentSearches",
      "filtersState",
      "apartmentFilters",
      "bookingDraft",
      "draftListing",
      // Add any other keys your app might use
    ];

    userStorageKeys.forEach((key) => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`🗑️ Cleared localStorage key: ${key}`);
      }
    });

    // Clear sessionStorage as well (if used)
    sessionStorage.clear();

    // Clear all state
    setToken(null);
    setUser(null);
    setError(null);
    setCurrentLocation(null);
    setLoading(false);

    console.log("✅ User logged out successfully - all storage cleared");
  }, [user?.id]);
  // Update the refreshUser function to handle location updates
  const refreshUser = useCallback(async () => {
    try {
      console.log("🔄 Refreshing user data...");
      const token = getToken();

      if (!token) {
        console.warn("No token available for refresh");
        setUser(null);
        return;
      }

      const response = await getUserProfile();
      const userData = response.data || response;

      // Merge with current location if it exists
      const updatedUserData = currentLocation
        ? { ...userData, currentLocation }
        : userData;

      console.log("✅ User data refreshed with location:", updatedUserData);
      setUser(updatedUserData);
      setError(null);
      return updatedUserData;
    } catch (err) {
      console.error("❌ Error refreshing user:", err);

      if (err.response?.status === 401) {
        console.warn("Authentication failed during refresh, logging out");
        logout();
        setError("Session expired. Please login again.");
      } else {
        setError("Failed to refresh user data");
      }
      throw err;
    }
  }, [logout, currentLocation]); // Add currentLocation as dependency
  // Update user function
  const updateUser = useCallback((updatedData) => {
    setUser((prev) => {
      if (!prev) return updatedData;
      return { ...prev, ...updatedData };
    });
  }, []);
  // Add these functions in the UserProvider, around line 350-400 (after guest verification functions)

  // Host verification functions
  const isHostVerified = useCallback(() => {
    return (
      user?.hostProfile?.isVerified ||
      user?.hostVerification?.status === "VERIFIED"
    );
  }, [user]);

  const getHostVerificationStatus = useCallback(() => {
    return (
      user?.hostVerification || {
        status: user?.verificationStatus || "PENDING",
        hasRequiredDocuments: user?.documents?.length >= 2 || false,
        documents: user?.documents || [],
      }
    );
  }, [user]);

  const hasPendingHostDocuments = useCallback(() => {
    return user?.verificationStatus === "PENDING";
  }, [user]);

  const getHostDocuments = useCallback(() => {
    return (
      user?.hostVerification?.documents ||
      user?.documents?.filter(
        (doc) => doc.type === "ID_CARD" || doc.type === "ID_PHOTOGRAPH"
      ) ||
      []
    );
  }, [user]);

  const canHostListProperties = useCallback(() => {
    return isHostVerified();
  }, [isHostVerified]);
  // Get user notifications
  const getUserNotifications = useCallback(() => {
    return Array.isArray(user?.notifications?.items)
      ? user.notifications.items
      : [];
  }, [user]);

  // Get unread notifications count
  const getUnreadNotificationsCount = useCallback(() => {
    if (user?.notifications?.unread !== undefined) {
      return user.notifications.unread;
    }
    return Array.isArray(user?.notifications?.items)
      ? user.notifications.items.filter((n) => !n.isRead).length
      : 0;
  }, [user]);

  // Mark notification as read
  const markAsRead = useCallback(
    async (notificationId) => {
      try {
        // Check if notification is already read in local state to avoid unnecessary API calls
        const currentNotification = user?.notifications?.items?.find(
          (n) => n.id === notificationId
        );

        if (currentNotification?.isRead) {
          console.log("📭 Notification already read, skipping API call");
          return { success: true };
        }

        console.log("📬 Marking notification as read:", notificationId);

        // Call API to mark as read
        const response = await markNotificationAsRead(notificationId);

        if (!response.success) {
          throw new Error(
            response.error || "Failed to mark notification as read"
          );
        }

        // Update local state
        setUser((prev) => {
          if (!prev || !prev.notifications?.items) return prev;

          const updatedItems = prev.notifications.items.map((notification) =>
            notification.id === notificationId
              ? { ...notification, isRead: true, readAt: new Date() }
              : notification
          );

          const unreadCount = updatedItems.filter((n) => !n.isRead).length;

          return {
            ...prev,
            notifications: {
              ...prev.notifications,
              unread: unreadCount,
              items: updatedItems,
            },
          };
        });

        console.log("✅ Notification marked as read");
        return { success: true };
      } catch (err) {
        console.error("❌ Error marking notification as read:", err);
        setError("Failed to mark notification as read");
        return { success: false, error: err.message };
      }
    },
    [user]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      // You'll need to create this API function
      // await markAllNotificationsAsRead();

      // Update local state
      setUser((prev) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          unread: 0,
          items:
            prev.notifications?.items?.map((notification) => ({
              ...notification,
              isRead: true,
              readAt: new Date(),
            })) || [],
        },
      }));

      console.log("✅ All notifications marked as read");
      return { success: true };
    } catch (err) {
      console.error("❌ Error marking all notifications as read:", err);
      setError("Failed to mark all notifications as read");
      return { success: false, error: err.message };
    }
  }, []);

  // Add new notification (for real-time updates)
  const addNotification = useCallback((notification) => {
    setUser((prev) => ({
      ...prev,
      notifications: {
        total: (prev.notifications?.total || 0) + 1,
        unread: (prev.notifications?.unread || 0) + 1,
        items: [notification, ...(prev.notifications?.items || [])],
      },
    }));
    console.log("✅ New notification added");
  }, []);

  // Remove notification
  const removeNotification = useCallback((notificationId) => {
    setUser((prev) => {
      const notificationToRemove = prev.notifications?.items?.find(
        (n) => n.id === notificationId
      );
      const wasUnread = notificationToRemove?.isRead === false;

      const updatedUser = {
        ...prev,
        notifications: {
          total: Math.max(0, (prev.notifications?.total || 0) - 1),
          unread: wasUnread
            ? Math.max(0, (prev.notifications?.unread || 0) - 1)
            : prev.notifications?.unread || 0,
          items:
            prev.notifications?.items?.filter((n) => n.id !== notificationId) ||
            [],
        },
      };

      console.log("✅ Notification removed");
      return updatedUser;
    });
  }, []);

  // Favorite functions
  const addToFavorites = useCallback(
    async (apartmentId) => {
      try {
        console.log("❤️ Adding to favorites:", apartmentId);
        const response = await toggleFavoriteAPI(apartmentId);
        if (response.success) {
          await refreshUser();
          console.log("✅ Added to favorites successfully");
          return { success: true };
        } else {
          throw new Error(response.message || "Failed to add to favorites");
        }
      } catch (err) {
        console.error("❌ Error adding to favorites:", err);
        setError("Failed to add to favorites");
        return { success: false, error: err.message };
      }
    },
    [refreshUser]
  );

  const removeFromFavorites = useCallback(
    async (apartmentId) => {
      try {
        console.log("💔 Removing from favorites:", apartmentId);
        const response = await toggleFavoriteAPI(apartmentId);
        if (response.success) {
          await refreshUser();
          console.log("✅ Removed from favorites successfully");
          return { success: true };
        } else {
          throw new Error(
            response.message || "Failed to remove from favorites"
          );
        }
      } catch (err) {
        console.error("❌ Error removing from favorites:", err);
        setError("Failed to remove from favorites");
        return { success: false, error: err.message };
      }
    },
    [refreshUser]
  );

  // Refresh favorites
  const refreshFavorites = useCallback(async () => {
    try {
      console.log("🔄 Refreshing favorites...");
      await refreshUser();
      console.log("✅ Favorites refreshed");
      return user?.favorites || [];
    } catch (err) {
      console.error("❌ Error refreshing favorites:", err);
      setError("Failed to refresh favorites");
      return [];
    }
  }, [refreshUser, user?.favorites]);

  // Authentication and role helpers
  const isAuthenticated = useCallback(() => {
    const token = getToken();
    const authenticated = !!token && !!user;
    return authenticated;
  }, [user]);

  const isHost = user?.role === "HOST";
  const isGuest = user?.role === "GUEST";
  const isAdmin = user?.role === "ADMIN";

  const getUserBookings = useCallback(() => {
    return user?.bookings || [];
  }, [user]);
  // Then add this function inside your component
  const deleteReadNotifications = async () => {
    try {
      const response = await deleteReadNotificationsApi();
      return response;
    } catch (error) {
      console.error("Error deleting read notifications:", error);
      throw error;
    }
  };
  const getUserFavorites = useCallback(() => {
    return user?.favorites || [];
  }, [user]);

  const getUserApartments = useCallback(() => {
    return user?.apartments || [];
  }, [user]);

  const getUserDocuments = useCallback(() => {
    return user?.documents || [];
  }, [user]);

  // Guest verification functions
  const isGuestVerified = useCallback(() => {
    return user?.guestVerification?.canBook || false;
  }, [user]);

  const getGuestVerificationStatus = useCallback(() => {
    return (
      user?.guestVerification || {
        status: user?.guestDocumentStatus || "NOT_REQUIRED",
        hasRequiredDocuments: false,
        canBook: false,
        documents: [],
      }
    );
  }, [user]);

  const hasPendingGuestDocuments = useCallback(() => {
    return user?.guestDocumentStatus === "PENDING";
  }, [user]);

  const getGuestDocuments = useCallback(() => {
    return (
      user?.guestVerification?.documents ||
      user?.documents?.filter(
        (doc) => doc.type === "ID_CARD" || doc.type === "ID_PHOTOGRAPH"
      ) ||
      []
    );
  }, [user]);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);
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
    setUserLocation,
    clearUserLocation,
    getUserBookings,
    getUserFavorites,
    getUserApartments,
    getUserDocuments,

    // Guest verification functions
    isGuestVerified,
    getGuestVerificationStatus,
    hasPendingGuestDocuments,
    getGuestDocuments,

    // ✅ ADD THESE NEW HOST VERIFICATION FUNCTIONS
    isHostVerified,
    getHostVerificationStatus,
    hasPendingHostDocuments,
    getHostDocuments,
    canHostListProperties,

    // Notification functions
    getUserNotifications,
    getUnreadNotificationsCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    deleteReadNotifications,
    // Error handling
    clearError,

    // Token helpers (for debugging)
    getToken,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
