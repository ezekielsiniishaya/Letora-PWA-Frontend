// contexts/UserProvider.jsx
import React, { useState, useEffect, useCallback } from "react";
import { UserContext } from "./UserContext";
import { getUserProfile } from "../services/userApi";
import { toggleFavoriteAPI } from "../services/apartmentApi";
import { markNotificationAsRead } from "../services/userApi"

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


// Login function
const login = async (userData, token) => {
  try {
    setLoading(true);
    
    // Store token first
    localStorage.setItem("authToken", token);
    
    // Fetch complete user profile with notifications
    const profileResponse = await getUserProfile();
    const completeUserData = profileResponse.data || profileResponse;
    
    console.log("Complete user data after login:", completeUserData); // Debug log
    
    setUser(completeUserData);
    setError(null);
  } catch (err) {
    console.error("Error fetching user profile after login:", err);
    
    // Fallback: use the basic user data from login
    const actualUserData = userData.data || userData;
    setUser(actualUserData);
    setError("Logged in but could not load complete profile");
  } finally {
    setLoading(false);
  }
};

  const logout = () => {
      // Clear search history for this user
  const userId = user?.id || 'anonymous';
  const storageKey = `apartmentSearchHistory_${userId}`;
  localStorage.removeItem(storageKey);

    setUser(null);
    localStorage.removeItem("authToken");
    setError(null);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const response = await getUserProfile();
      const userData = response.data || response;
      setUser(userData);
    } catch (err) {
      console.error("Error refreshing user:", err);
      setError("Failed to refresh user data");
    }
  }, []);

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

// In UserProvider.jsx - add a check to prevent unnecessary API calls
const markAsRead = useCallback(async (notificationId) => {
  try {
    // Check if notification is already read in local state to avoid unnecessary API calls
    const currentNotification = user?.notifications?.items?.find(
      n => n.id === notificationId
    );
    
    if (currentNotification?.isRead) {
      console.log("Notification already read, skipping API call");
      return { success: true };
    }

    console.log("Marking notification as read:", notificationId);
    
    // Call API to mark as read
    const response = await markNotificationAsRead(notificationId);
    
    if (!response.success) {
      throw new Error(response.error || "Failed to mark notification as read");
    }

    // Update local state
    setUser((prev) => {
      if (!prev || !prev.notifications?.items) return prev;
      
      const updatedItems = prev.notifications.items.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true, readAt: new Date() }
          : notification
      );
      
      const unreadCount = updatedItems.filter(n => !n.isRead).length;
      
      return {
        ...prev,
        notifications: {
          ...prev.notifications,
          unread: unreadCount,
          items: updatedItems,
        },
      };
    });

    return { success: true };
  } catch (err) {
    console.error("Error marking notification as read:", err);
    setError("Failed to mark notification as read");
    return { success: false, error: err.message };
  }
}, [user]); // Add user to dependencies

  // MARK ALL NOTIFICATIONS AS READ
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

      return { success: true };
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      setError("Failed to mark all notifications as read");
      return { success: false, error: err.message };
    }
  }, []);

  // ADD NEW NOTIFICATION (for real-time updates)
  const addNotification = useCallback((notification) => {
    setUser((prev) => ({
      ...prev,
      notifications: {
        total: (prev.notifications?.total || 0) + 1,
        unread: (prev.notifications?.unread || 0) + 1,
        items: [notification, ...(prev.notifications?.items || [])],
      },
    }));
  }, []);

  // REMOVE NOTIFICATION
  const removeNotification = useCallback((notificationId) => {
    setUser((prev) => {
      const notificationToRemove = prev.notifications?.items?.find(
        (n) => n.id === notificationId
      );
      const wasUnread = notificationToRemove?.isRead === false;

      return {
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
    });
  }, []);

  // FAVORITE FUNCTIONS (existing)
  const addToFavorites = useCallback(
    async (apartmentId) => {
      try {
        const response = await toggleFavoriteAPI(apartmentId);
        if (response.success) {
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

  const removeFromFavorites = useCallback(
    async (apartmentId) => {
      try {
        const response = await toggleFavoriteAPI(apartmentId);
        if (response.success) {
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

  // FIXED: Use refreshUser instead of getUserProfile
  const refreshFavorites = useCallback(async () => {
    try {
      await refreshUser(); // This reuses the existing refreshUser function
      return user?.favorites || [];
    } catch (err) {
      console.error("Error refreshing favorites:", err);
      setError("Failed to refresh favorites");
      return [];
    }
  }, [refreshUser, user?.favorites]);

  // Other existing functions...
  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem("authToken");
    return !!token && !!user;
  }, [user]);

  const isHost = user?.role === "HOST";
  const isGuest = user?.role === "GUEST";
  const isAdmin = user?.role === "ADMIN";

  const getUserLocation = () => {
    return {
      state: user?.location?.state || user?.stateOrigin,
      town: user?.location?.town || user?.townOrigin,
    };
  };

  const getUserBookings = useCallback(() => {
    return user?.bookings || [];
  }, [user]);

  const getUserFavorites = useCallback(() => {
    return user?.favorites || [];
  }, [user]);

  const getUserApartments = useCallback(() => {
    return user?.apartments || [];
  }, [user]);

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

    // Notification functions
    getUserNotifications,
    getUnreadNotificationsCount,
    markAsRead,
    markAllAsRead, // Add this too
    addNotification,
    removeNotification,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
