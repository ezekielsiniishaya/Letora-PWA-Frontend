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
        // Preserve any custom headers from options FIRST
        ...options.headers,
        // Then add our headers (they won't override existing ones)
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
        // Only add Content-Type if it's NOT FormData AND not already set
        ...(!isFormData &&
          !options.headers?.["Content-Type"] && {
            "Content-Type": "application/json",
          }),
      },
    };

    // Handle body
    if (options.body) {
      config.body = isFormData ? options.body : JSON.stringify(options.body);
    }

    console.log("API Request Config:", {
      endpoint,
      isFormData,
      headers: config.headers,
      hasBody: !!config.body,
      bodyType: typeof config.body,
    });

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
    const error = await response.json().catch(() => ({
      message: "Network error. Please check your connection.",
    }));

    // Just use the backend error message directly
    throw new Error(error.message);
  }

  return response.json();
};

// Logout function
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  // Redirect to login page
  window.location.href = "/sign-in";
};
