import { apiRequest, logout } from "./apiRequest";
import BASE_URL from "../config/config";

// Register user
export const registerAPI = async (userData) => {
  const response = await apiRequest("/api/auth/register", {
    method: "POST",
    body: userData,
  });

  // Store both tokens
  if (response.accessToken && response.refreshToken) {
    localStorage.setItem("token", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);
  }

  return response;
};

// Login user
export const loginAPI = async (email, password) => {
  const response = await apiRequest("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });

  // Store both tokens
  if (response.accessToken && response.refreshToken) {
    localStorage.setItem("token", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);
  }

  return response;
};

// Refresh token
export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    logout();
    throw new Error("No refresh token available");
  }

  const response = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    // Refresh token expired, force logout
    logout();
    throw new Error("Refresh token expired");
  }

  const data = await response.json();
  localStorage.setItem("token", data.accessToken);
  return data.accessToken;
};

// Verify email
export const verifyEmailAPI = async (code) => {
  return apiRequest("/api/auth/verify-email", {
    method: "POST",
    body: { code },
  });
};

// Resend verification email
export const resendVerificationEmailAPI = async (email) => {
  return apiRequest("/api/auth/resend-verification", {
    method: "POST",
    body: { email },
  });
};

// Set password after email verification
export const setPasswordAPI = async (password) => {
  return apiRequest("/api/auth/set-password", {
    method: "POST",
    body: { password },
  });
};

// Change password (for authenticated users)
export const changePasswordAPI = async (currentPassword, newPassword) => {
  return apiRequest("/api/auth/change-password", {
    method: "POST",
    body: { currentPassword, newPassword },
  });
};

// Forgot password - request reset
export const forgotPasswordAPI = async (email) => {
  return apiRequest("/api/auth/forgot-password", {
    method: "POST",
    body: { email },
  });
};
// Verify password reset code
export const verifyPasswordResetCodeAPI = async (code) => {
  return apiRequest("/api/auth/verify-reset-code", {
    method: "POST",
    body: { code },
  });
};

// Resend password reset code
export const resendPasswordResetCodeAPI = async (email) => {
  return apiRequest("/api/auth/resend-reset-code", {
    method: "POST",
    body: { email },
  });
};
// Reset password with token
export const resetPasswordAPI = async (token, newPassword) => {
  return apiRequest("/api/auth/reset-password", {
    method: "POST",
    body: { token, newPassword },
  });
};

// Logout user
export const logoutAPI = async () => {
  try {
    await apiRequest("/api/auth/logout", {
      method: "POST",
    });
  } catch (error) {
    console.error("Logout API error:", error);
  } finally {
    // Always clear local storage
    logout();
  }
};

// Get current user profile
export const getCurrentUserAPI = async () => {
  return apiRequest("/api/auth/me", {
    method: "GET",
  });
};

// Update user profile
export const updateProfileAPI = async (userData) => {
  return apiRequest("/api/auth/profile", {
    method: "PUT",
    body: userData,
  });
};
