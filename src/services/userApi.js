// services/userApi.js
import { apiRequest } from "./apiRequest";

// Get user profile
export const getUserProfile = async () => {
  return apiRequest("/api/users/profile", {
    method: "GET",
  });
};

// Update user profile
export const updateUserProfile = async (userData) => {
  return apiRequest("/api/users/profile", {
    method: "PUT",
    body: userData,
  });
};

// ✅ Get all notifications
export const getNotifications = async () => {
  return apiRequest("/api/users/notification", {
    method: "GET",
  });
};

// ✅ Mark a single notification as read
export const markNotificationAsRead = async (notificationId) => {
  return apiRequest(`/api/users/notification/${notificationId}/read`, {
    method: "PATCH",
  });
};

// ✅ Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  return apiRequest("/api/users/notification/read-all", {
    method: "PATCH",
  });
};

// ✅ Delete a single notification
export const deleteNotification = async (notificationId) => {
  return apiRequest(`/api/users/notifications/${notificationId}`, {
    method: "DELETE",
  });
};
// Request availability
export const requestAvailability = async (apartmentId) => {
  return apiRequest("/api/users/apartment/request", {
    method: "POST",
    body: { apartmentId },
  });
};

// Create rating
export const createRating = async (apartmentId, rating, comment) => {
  return apiRequest("/api/users/rating", {
    method: "POST",
    body: { apartmentId, rating, comment },
  });
};

export const getBookingById = async (bookingId) => {
  return apiRequest("/api/users/bookings/${bookingId}", {
    method: "GET",
    body: { bookingId },
  });
};

export const cancelBooking = async (bookingId, cancellationReason) => {
  return apiRequest(`/api/users/bookings/${bookingId}/cancel`, {
    method: "PUT",
    body: { cancellationReason },
  });
};

export const holdSecurityDeposit = async (bookingId) => {
  return apiRequest(`/api/users/bookings/${bookingId}/hold-deposit`, {
    method: "PUT",
  });
};