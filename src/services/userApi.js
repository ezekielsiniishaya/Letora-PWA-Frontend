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
