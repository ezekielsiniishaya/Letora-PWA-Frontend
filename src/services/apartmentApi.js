// services/apartmentApi.js
import { apiRequest } from "./apiRequest";

// GET endpoints for fetching apartments
export const getApprovedApartments = async () => {
  return apiRequest("/api/apartments/approved", {
    method: "GET",
  });
};

export const getHotApartments = async () => {
  return apiRequest("/api/apartments/hot", {
    method: "GET",
  });
};

export const getNearbyApartments = async (state, town) => {
  const params = new URLSearchParams();
  if (state) params.append("state", state);
  if (town) params.append("town", town);

  return apiRequest(`/api/apartments/nearby?${params.toString()}`, {
    method: "GET",
  });
};

// Search apartments with filters
export const searchApartments = async (filters = {}) => {
  const params = new URLSearchParams();

  // Add filter parameters if provided
  Object.keys(filters).forEach((key) => {
    if (
      filters[key] !== undefined &&
      filters[key] !== null &&
      filters[key] !== ""
    ) {
      params.append(key, filters[key]);
    }
  });

  return apiRequest(`/api/apartments/search?${params.toString()}`, {
    method: "GET",
  });
};

// Keep your existing endpoints below...

// Single endpoint to create complete apartment
export const createCompleteApartment = async (formData) => {
  return apiRequest("/api/apartments/create", {
    method: "POST",
    body: formData,
  });
};

// Keep existing GET endpoints for viewing/editing
export const getApartmentById = async (apartmentId) => {
  return apiRequest(`/api/apartments/${apartmentId}`, {
    method: "GET",
  });
};

export const getHostApartments = async () => {
  return apiRequest("/api/apartments/host/list", {
    method: "GET",
  });
};

export const updateApartmentStatus = async (apartmentId, status) => {
  return apiRequest(`/api/apartments/${apartmentId}/status`, {
    method: "PATCH",
    body: JSON.stringify(status),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Helper function to prepare FormData for final submission
export const prepareApartmentSubmission = (
  apartmentData,
  imageFiles,
  documentFiles
) => {
  const formData = new FormData();
  formData.append("apartmentData", JSON.stringify(apartmentData));

  if (imageFiles && imageFiles.length > 0) {
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });
  }

  if (documentFiles && documentFiles.length > 0) {
    documentFiles.forEach((file) => {
      formData.append("documents", file);
    });
  }

  return formData;
};

// Optional: Progress tracking for large files
export const createCompleteApartmentWithProgress = async (
  formData,
  onProgress
) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        const percentComplete = (event.loaded / event.total) * 100;
        onProgress(percentComplete);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed"));
    });

    xhr.open("POST", "/api/apartments/create");
    const token = localStorage.getItem("authToken");
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }
    xhr.send(formData);
  });
};

// Update banking information
export const updateBankingInfoAPI = async (bankingInfo) => {
  return await apiRequest("/api/users/bank/update", {
    method: "PUT",
    body: { bankingInfo }, // No need to stringify now
  });
};

// Get banking information
export const getBankingInfoAPI = async () => {
  return await apiRequest("/api/banking");
};
// Delete apartment permanently
export const deleteApartment = async (apartmentId) => {
  return await apiRequest(`/api/apartments/${apartmentId}`, {
    method: "DELETE",
  });
};

// Soft delete apartment (mark as not listed)
export const softDeleteApartmentAPI = async (apartmentId) => {
  return await apiRequest(`/api/apartments/${apartmentId}/soft-delete`, {
    method: "PATCH",
  });
};

// Add to your apartmentApi.js
export const toggleFavoriteAPI = async (apartmentId) => {
  return await apiRequest(`/api/apartments/${apartmentId}/favorite`, {
    method: "POST",
    body: { apartmentId },
  });
};

// Delete apartment image
export const deleteApartmentImageAPI = async (imageId) => {
  return await apiRequest(`/api/apartments/images/${imageId}`, {
    method: "DELETE",
  });
};
// Update complete apartment with all data (including images and documents)
export const updateCompleteApartment = async (apartmentId, formData) => {
  return apiRequest(`/api/apartments/${apartmentId}`, {
    method: "PUT",
    body: formData,
    // Note: Don't set Content-Type header for FormData - let browser set it with boundary
  });
};
// Search apartments by query (name/location)
export const searchApartmentsByQuery = async (query, page = 1, limit = 10) => {
  const params = new URLSearchParams();
  if (query) params.append("query", query);
  params.append("page", page);
  params.append("limit", limit);

  return apiRequest(`/api/apartments/search?${params.toString()}`, {
    method: "GET",
  });
};

// Filter apartments with comprehensive filters
export const filterApartments = async (filters = {}) => {
  const params = new URLSearchParams();

  // Add all filter parameters if provided
  Object.keys(filters).forEach((key) => {
    const value = filters[key];

    // Handle different types of values
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        // Handle array values (facilities, houseRules)
        value.forEach((item) => {
          params.append(key, item);
        });
      } else if (typeof value === "boolean") {
        // Convert boolean to string
        params.append(key, value.toString());
      } else {
        // Handle string, number, etc.
        params.append(key, value);
      }
    }
  });

  return apiRequest(`/api/apartments/filter?${params.toString()}`, {
    method: "GET",
  });
};
