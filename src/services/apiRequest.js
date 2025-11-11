import BASE_URL from "../config/config";

// Move refreshToken here to avoid circular dependency
const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
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
    throw new Error("Refresh token expired");
  }

  const data = await response.json();
  localStorage.setItem("token", data.accessToken);
  return data.accessToken;
};

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

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, config);

      // Handle network errors that prevent the request from completing
      if (!response.ok && response.status === 0) {
        throw new Error("Network error: Failed to connect to server");
      }

      return response;
    } catch (error) {
      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        throw new Error("Network error: Please check your internet connection");
      }
      throw error;
    }
  };

  try {
    let response = await makeRequest(token);

    if (response.status === 401) {
      try {
        const newToken = await refreshToken();
        response = await makeRequest(newToken);
      } catch {
        throw {
          response: {
            status: 401,
            data: {
              error: "Authentication failed",
              shouldLogout: true,
            },
          },
        };
      }
    }

    const responseData = await response.json().catch(() => ({
      error: "Invalid response from server",
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
  } catch (error) {
    // Handle network errors and other exceptions
    if (error.message && error.message.includes("Network error")) {
      throw {
        response: {
          status: 0,
          data: { error: error.message },
        },
      };
    }
    throw error;
  }
};
