import BASE_URL from "../config/config";
import { refreshToken } from "./authApi";
export const apiRequest = async (endpoint, options = {}) => {
  let token = localStorage.getItem("token");

  const makeRequest = async (authToken) => {
    const isFormData = options.body instanceof FormData;

    const config = {
      method: options.method || "GET",
      headers: {
        ...options.headers,
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
        ...(!isFormData &&
          !options.headers?.["Content-Type"] && {
            "Content-Type": "application/json",
          }),
      },
    };

    if (options.body) {
      config.body = isFormData ? options.body : JSON.stringify(options.body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    return response;
  };

  let response = await makeRequest(token);

  if (response.status === 401) {
    try {
      const newToken = await refreshToken();
      response = await makeRequest(newToken);
    } catch {
      // Instead of calling logout here, throw a specific error
      // that components can catch to trigger the context logout
      throw {
        response: {
          status: 401,
          data: {
            error: "Authentication failed",
            shouldLogout: true, // Add this flag
          },
        },
      };
    }
  }

  const responseData = await response.json().catch(() => ({
    error: "Network error. Please check your connection.",
  }));

  if (!response.ok || responseData.success === false) {
    throw {
      response: {
        status: response.status,
        data: responseData,
      },
    };
  }

  return responseData;
};
