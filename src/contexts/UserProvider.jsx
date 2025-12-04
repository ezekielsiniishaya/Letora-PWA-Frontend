// contexts/UserProvider.jsx
import React, { useState, useEffect, useCallback } from "react";
import { UserContext } from "./UserContext";
import { getUserProfile } from "../services/userApi";
import { toggleFavoriteAPI } from "../services/apartmentApi";
import {
  markNotificationAsRead,
  deleteReadNotifications as deleteReadNotificationsApi,
  updateFcmToken,
} from "../services/userApi";
import { Preferences } from "@capacitor/preferences";

const AUTH_TOKEN_KEY = "token";
const USER_LOCATION_KEY = "userLocation";

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  // Get token helper (async)
  const getToken = useCallback(async () => {
    const { value } = await Preferences.get({ key: AUTH_TOKEN_KEY });
    return value;
  }, []);

  // Set token helper (async)
  const setToken = useCallback(async (token) => {
    if (token) {
      await Preferences.set({ key: AUTH_TOKEN_KEY, value: token });
    } else {
      await Preferences.remove({ key: AUTH_TOKEN_KEY });
    }
  }, []);

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
        const token = await getToken();

        console.log("🔄 Initializing user, token found:", !!token);

        if (token) {
          try {
            console.log("🔄 Fetching user profile with token...");
            const response = await getUserProfile();
            console.log("Profile API response:", response);

            const userData = response.data || response;
            const fcmToken = localStorage.getItem("fcm_token");
            console.log("FCM token from localStorage on login:", fcmToken);

            if (fcmToken) {
              try {
                await updateFcmToken(fcmToken);
                console.log("FCM token re-synced for new user");
              } catch (e) {
                console.error("Failed to resync FCM token on login", e);
              }
            }

            console.log("✅ User initialized successfully:", userData);
            setUser(userData);
            setError(null);
          } catch (err) {
            console.error("❌ Error fetching user profile:", err);

            if (err.response?.status === 401) {
              console.warn("Authentication failed, clearing token");
              await setToken(null);
              setUser(null);
              setError("Session expired. Please login again.");
            } else {
              console.warn("Could not fetch user profile, but token is valid");
              setUser({ isAuthenticated: true });
              setError("Could not load user profile");
            }
          }
        } else {
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
  }, [getToken, setToken]);

  // Set user location function
  const setUserLocation = useCallback((location) => {
    console.log("📍 Setting user location:", location);
    setCurrentLocation(location);
    localStorage.setItem(USER_LOCATION_KEY, JSON.stringify(location));
    setUser((prev) => (prev ? { ...prev, currentLocation: location } : prev));
    console.log("✅ Location saved to localStorage and state");
  }, []);

  // Get user location function
  const getUserLocation = useCallback(() => {
    if (currentLocation) return currentLocation;
    if (user?.currentLocation) return user.currentLocation;
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
  const syncStoredFcmToken = useCallback(async (maxRetries = 3) => {
    try {
      const fcmToken = localStorage.getItem("fcm_token");
      if (!fcmToken) {
        console.log("No FCM token found in localStorage");
        return { success: false, message: "No FCM token found" };
      }

      // Optional: Check if we already synced this token
      const lastSyncedToken = localStorage.getItem("last_synced_fcm_token");
      if (lastSyncedToken === fcmToken) {
        console.log("FCM token already synced, skipping");
        return { success: true, message: "Already synced" };
      }

      console.log("Syncing stored FCM token to backend...");

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`Attempt ${attempt} to sync FCM token...`);
          const response = await updateFcmToken(fcmToken);

          if (response.success) {
            console.log("✅ FCM token successfully synced to backend");
            // Mark as synced
            localStorage.setItem("last_synced_fcm_token", fcmToken);
            return { success: true, message: "FCM token synced" };
          }

          console.warn(`Attempt ${attempt} failed:`, response.message);
        } catch (error) {
          console.warn(`Attempt ${attempt} error:`, error.message);
        }

        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        }
      }

      console.error("All attempts to sync FCM token failed");
      return { success: false, message: "Failed after all retries" };
    } catch (error) {
      console.error("Error syncing FCM token:", error);
      return { success: false, message: error.message };
    }
  }, []);
  const login = async (userData, token) => {
    try {
      setLoading(true);
      setError(null);

      await setToken(token);
      console.log("✅ Token stored as 'token':", token ? "Yes" : "No");

      try {
        console.log("🔄 Fetching user profile after login...");
        const profileResponse = await getUserProfile();
        const completeUserData = profileResponse.data || profileResponse;

        console.log("✅ Complete user data after login:", completeUserData);
        setUser(completeUserData);

        // Store host verification status
        const isHostVerified =
          completeUserData?.hostProfile?.isVerified ||
          completeUserData?.hostVerification?.status === "VERIFIED";
        await Preferences.set({
          key: "hostVerificationStatus",
          value: isHostVerified ? "verified" : "pending",
        });

        // Store user type/role if needed
        const userType = completeUserData?.role || completeUserData?.userType;
        if (userType) {
          await Preferences.set({
            key: "userType",
            value: userType.toLowerCase(),
          });
        }

        // ✅ SYNC FCM TOKEN AFTER SUCCESSFUL LOGIN
        setTimeout(async () => {
          try {
            await syncStoredFcmToken();
          } catch (syncError) {
            console.error("Failed to sync FCM token after login:", syncError);
          }
        }, 500); // Small delay to ensure user is fully set

        setError(null);
      } catch (profileErr) {
        console.error(
          "❌ Error fetching user profile after login:",
          profileErr
        );
        const actualUserData = userData.data || userData;
        console.log("🔄 Using fallback user data:", actualUserData);
        setUser(actualUserData);

        // Try to store verification with fallback data
        const isHostVerified =
          actualUserData?.hostProfile?.isVerified ||
          actualUserData?.hostVerification?.status === "VERIFIED";
        await Preferences.set({
          key: "hostVerificationStatus",
          value: isHostVerified ? "verified" : "pending",
        });

        // ✅ SYNC FCM TOKEN EVEN WITH FALLBACK DATA
        setTimeout(async () => {
          try {
            await syncStoredFcmToken();
          } catch (syncError) {
            console.error("Failed to sync FCM token after login:", syncError);
          }
        }, 500);

        setError("Logged in but could not load complete profile");
      }
    } catch (err) {
      console.error("❌ Error during login process:", err);
      setError("Login failed");
      await setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    console.log("🚪 Logging out user...");

    const userId = user?.id || "anonymous";
    const storageKey = `apartmentSearchHistory_${userId}`;
    localStorage.removeItem(storageKey);

    // ✅ CLEAR THE LAST SYNCED TOKEN ON LOGOUT
    localStorage.removeItem("last_synced_fcm_token");

    // remove token from Preferences instead of localStorage
    await setToken(null);
    localStorage.removeItem(USER_LOCATION_KEY);

    const userStorageKeys = [
      "userPreferences",
      "userSettings",
      "recentSearches",
      "filtersState",
      "apartmentFilters",
      "bookingDraft",
      "draftListing",
    ];

    userStorageKeys.forEach((key) => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`🗑️ Cleared localStorage key: ${key}`);
      }
    });

    sessionStorage.clear();

    setUser(null);
    setError(null);
    setCurrentLocation(null);
    setLoading(false);

    console.log("✅ User logged out successfully - all storage cleared");
  }, [setToken, user?.id]);

  const refreshUser = useCallback(async () => {
    try {
      console.log("🔄 Refreshing user data...");
      const token = await getToken();

      if (!token) {
        console.warn("No token available for refresh");
        setUser(null);
        return;
      }

      const response = await getUserProfile();
      const userData = response.data || response;

      const updatedUserData = currentLocation
        ? { ...userData, currentLocation }
        : userData;

      console.log("✅ User data refreshed with location:", updatedUserData);
      setUser(updatedUserData);

      // ✅ SYNC FCM TOKEN ON USER REFRESH TOO
      setTimeout(async () => {
        try {
          await syncStoredFcmToken();
        } catch (syncError) {
          console.error("Failed to sync FCM token on refresh:", syncError);
        }
      }, 500);

      setError(null);
      return updatedUserData;
    } catch (err) {
      console.error("❌ Error refreshing user:", err);

      if (err.response?.status === 401) {
        console.warn("Authentication failed during refresh, logging out");
        await logout();
        setError("Session expired. Please login again.");
      } else {
        setError("Failed to refresh user data");
      }
      throw err;
    }
  }, [getToken, currentLocation, syncStoredFcmToken, logout]);
  const updateUser = useCallback((updatedData) => {
    setUser((prev) => {
      if (!prev) return updatedData;
      return { ...prev, ...updatedData };
    });
  }, []);

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

  const getUserNotifications = useCallback(() => {
    return Array.isArray(user?.notifications?.items)
      ? user.notifications.items
      : [];
  }, [user]);

  const getUnreadNotificationsCount = useCallback(() => {
    if (user?.notifications?.unread !== undefined) {
      return user.notifications.unread;
    }
    return Array.isArray(user?.notifications?.items)
      ? user.notifications.items.filter((n) => !n.isRead).length
      : 0;
  }, [user]);

  const markAsRead = useCallback(
    async (notificationId) => {
      try {
        const currentNotification = user?.notifications?.items?.find(
          (n) => n.id === notificationId
        );

        if (currentNotification?.isRead) {
          console.log("📭 Notification already read, skipping API call");
          return { success: true };
        }

        console.log("📬 Marking notification as read:", notificationId);

        const response = await markNotificationAsRead(notificationId);

        if (!response.success) {
          throw new Error(
            response.error || "Failed to mark notification as read"
          );
        }

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

  const markAllAsRead = useCallback(async () => {
    try {
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

  // Async isAuthenticated helper for callers that care about token
  const isAuthenticated = useCallback(async () => {
    const token = await getToken();
    return !!token && !!user;
  }, [getToken, user]);

  const isHost = user?.role === "HOST";
  const isGuest = user?.role === "GUEST";
  const isAdmin = user?.role === "ADMIN";

  const getUserBookings = useCallback(() => {
    return user?.bookings || [];
  }, [user]);

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

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated, // now async
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
    isGuestVerified,
    getGuestVerificationStatus,
    hasPendingGuestDocuments,
    getGuestDocuments,
    isHostVerified,
    getHostVerificationStatus,
    hasPendingHostDocuments,
    getHostDocuments,
    canHostListProperties,
    getUserNotifications,
    getUnreadNotificationsCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    deleteReadNotifications,
    clearError,
    getToken,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
