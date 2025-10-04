import BASE_URL from "../config/config";
import { refreshToken } from "./authApi";

// Helper function for API calls with auto token refresh
export const apiRequest = async (endpoint, options = {}) => {
  let token = localStorage.getItem("token");

  const makeRequest = async (authToken) => {
    const isFormData = options.body instanceof FormData;

    const config = {
      method: options.method || "GET",
      headers: {
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
        ...(!isFormData && { "Content-Type": "application/json" }),
        ...options.headers,
      },
    };

    // Handle body
    if (options.body) {
      config.body = isFormData ? options.body : JSON.stringify(options.body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    return response;
  };

  // First attempt with current token
  let response = await makeRequest(token);

  // If 401, try to refresh token and retry
  if (response.status === 401) {
    try {
      const newToken = await refreshToken();
      response = await makeRequest(newToken);
    } catch {
      // Refresh failed, redirect to login
      logout();
      throw new Error("Authentication failed");
    }
  }

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Network error" }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Logout function
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  // Redirect to login page
  window.location.href = "/login";
};
