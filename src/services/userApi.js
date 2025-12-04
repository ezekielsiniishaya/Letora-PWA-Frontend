// services/userApi.js
import { apiRequest } from "./apiRequest";
import BASE_URL from "../config/config";

// ========== NOTIFICATION APIS ==========

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
  return apiRequest(`/api/users/notification/${notificationId}`, {
    method: "DELETE",
  });
};

// ✅ Delete all notifications for user
export const deleteAllNotifications = async () => {
  return apiRequest("/api/users/notification/delete-all", {
    method: "DELETE",
  });
};

// ✅ Delete only read notifications
export const deleteReadNotifications = async () => {
  return apiRequest("/api/users/notification/delete-read", {
    method: "DELETE",
  });
};
// Send a test push to the logged-in user
export const sendTestPush = async () => {
  return apiRequest("/api/users/notification/test-push", {
    method: "POST",
  });
};

// ========== PROFILE APIS ==========

// Get user profile
export const getUserProfile = async () => {
  return apiRequest("/api/users/profile", {
    method: "GET",
  });
};

// Update firebase token
export const updateFcmToken = async (fcmToken) => {
  return apiRequest("/api/users/me/fcm-token", {
    method: "PUT",
    body: { fcmToken },
  });
};

// Update user profile
export const updateUserProfile = async (userData) => {
  return apiRequest("/api/users/profile", {
    method: "PUT",
    body: userData,
  });
};

// Request availability
export const requestAvailability = async (apartmentId) => {
  return apiRequest("/api/users/apartment/request", {
    method: "POST",
    body: { apartmentId },
  });
};

// Respond to availability request
export const respondToAvailability = async (
  availabilityRequestId,
  isAvailable
) => {
  return apiRequest("/api/users/availability/respond", {
    method: "POST",
    body: {
      availabilityRequestId,
      isAvailable,
    },
  });
};

// Create rating
export const createRating = async (apartmentId, rating, comment, bookingId) => {
  return apiRequest("/api/users/rating", {
    method: "POST",
    body: { apartmentId, rating, comment, bookingId },
  });
};

// ========== BOOKING APIS ==========
export const createBooking = async (bookingData) => {
  return apiRequest("/api/bookings", {
    method: "POST",
    body: bookingData,
  });
};

export const getBookingById = async (bookingId) => {
  return apiRequest(`/api/bookings/${bookingId}`, {
    method: "GET",
  });
};

export const getUserBookings = async () => {
  return apiRequest("/api/bookings/my-bookings", {
    method: "GET",
  });
};

export const updateBookingPaymentStatus = async (bookingId, paymentData) => {
  return apiRequest(`/api/bookings/${bookingId}/payment`, {
    method: "PATCH",
    body: paymentData,
  });
};

// upload guest documents - accept FormData directly
export const uploadGuestDocuments = async (formData) => {
  return apiRequest("/api/users/guest-documents", {
    method: "POST",
    body: formData,
  });
};

// ========== PAYMENT APIS ==========
// In services/userApi.js - Update the createPayment function
export const createPayment = async (bookingId) => {
  try {
    const response = await apiRequest("/api/vant/checkout", {
      method: "POST",
      body: {
        bookingId: bookingId, // Make sure this is being passed correctly
      },
    });

    return response;
  } catch (error) {
    console.error("Create payment error:", error);
    // Re-throw the error so it can be caught in the component
    throw error;
  }
};

// FIXED: confirmPayment should accept bookingId and handle reference lookup
export const confirmPayment = async (bookingId) => {
  try {
    // Get the payment reference from localStorage first
    const storedData = localStorage.getItem(`paymentData_${bookingId}`);
    let reference;

    if (storedData) {
      const paymentData = JSON.parse(storedData);
      reference = paymentData.reference;
    }

    if (!reference) {
      throw new Error("Payment reference not found. Please start over.");
    }

    return apiRequest(`/api/vant/verify?reference=${reference}`, {
      method: "GET",
    });
  } catch (error) {
    console.error("Confirm payment error:", error);
    throw error;
  }
};

export const getPaymentStatus = async (bookingId) => {
  return apiRequest(`/api/payments/booking/${bookingId}/status`, {
    method: "GET",
  });
};

// Download receipt (returns Blob so caller can handle web/APK separately)
export const downloadReceipt = async (bookingId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${BASE_URL}/api/bookings/${bookingId}/receipt`,
      {
        method: "GET",
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get PDF as Blob
    const blob = await response.blob();

    // Basic validation: ensure it's a PDF
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/pdf")) {
      return {
        success: false,
        error: "Invalid receipt format received from server",
      };
    }

    return {
      success: true,
      data: blob, // let UI decide how to handle this
    };
  } catch (error) {
    console.error("Receipt download error:", error);
    return {
      success: false,
      error: error.message || "Failed to download receipt",
    };
  }
};

// ========== DEPOSIT HOLD APIS ==========

/**
 * Check if a booking has an active security deposit hold
 * @param {string} bookingId - The booking ID to check
 * @returns {Promise<Object>} Response with hasDepositHold boolean
 */
export const checkDepositHold = async (bookingId) => {
  return apiRequest(`/api/bookings/${bookingId}/deposit-hold/check`, {
    method: "GET",
  });
};

/**
 * Get detailed deposit hold information for a booking
 * @param {string} bookingId - The booking ID to check
 * @returns {Promise<Object>} Response with deposit hold details
 */
export const getDepositHoldDetails = async (bookingId) => {
  return apiRequest(`/api/bookings/${bookingId}/deposit-hold/details`, {
    method: "GET",
  });
};

/**
 * Create a security deposit hold for a booking
 * @param {string} bookingId - The booking ID
 * @param {Object} holdData - Hold data including amount, reason, etc.
 * @returns {Promise<Object>} Response with created hold details
 */
export const holdSecurityDeposit = async (bookingId) => {
  return apiRequest(`/api/bookings/${bookingId}/hold-deposit`, {
    method: "PUT",
  });
};

// Process withdrawal (only amount needed)
export const processWithdrawal = async (amount) => {
  return apiRequest("/api/users/withdraw", {
    method: "POST",
    body: { amount },
  });
};

export const createDepositHold = async (bookingId) => {
  return apiRequest(`/api/bookings/${bookingId}/hold-deposit`, {
    method: "PUT",
  });
};

// In userApi.js - add this function
export const checkDepositHoldStatus = async (bookingId) => {
  return apiRequest(`/api/bookings/${bookingId}/deposit-hold/status`, {
    method: "GET",
  });
};

// ========== CANCELLATION APIS ==========

/**
 * Check if a booking can be cancelled and what the financial impact would be
 * @param {string} bookingId - The booking ID to check
 * @returns {Promise<Object>} Response with cancellation eligibility details
 */
export const checkCancellationEligibility = async (bookingId) => {
  return apiRequest(`/api/bookings/${bookingId}/cancellation/eligibility`, {
    method: "GET",
  });
};

/**
 * Cancel a booking
 * @param {string} bookingId - The booking ID to cancel
 * @param {string} reason - Reason for cancellation
 * @returns {Promise<Object>} Response with cancellation details
 */
export const cancelBooking = async (bookingId, reason) => {
  return apiRequest(`/api/bookings/${bookingId}/cancel`, {
    method: "PUT",
    body: { reason },
  });
};

/**
 * Get cancellation dispute details for a booking
 * @param {string} bookingId - The booking ID
 * @returns {Promise<Object>} Response with dispute details
 */
export const getCancellationDispute = async (bookingId) => {
  return apiRequest(`/api/bookings/${bookingId}/cancellation/dispute`, {
    method: "GET",
  });
};
