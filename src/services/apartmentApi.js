// services/apartmentApi.js
import { apiRequest } from "./apiRequest";

// GET endpoints for fetching apartments
export const getApprovedApartments = async () => {
  return apiRequest("/apartments/approved", {
    method: "GET",
  });
};

export const getHotApartments = async () => {
  return apiRequest("/apartments/hot", {
    method: "GET",
  });
};

export const getNearbyApartments = async (state, town) => {
  const params = new URLSearchParams();
  if (state) params.append("state", state);
  if (town) params.append("town", town);

  return apiRequest(`/apartments/nearby?${params.toString()}`, {
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

  return apiRequest(`/apartments/search?${params.toString()}`, {
    method: "GET",
  });
};

// Keep your existing endpoints below...

// Single endpoint to create complete apartment
export const createCompleteApartment = async (formData) => {
  return apiRequest("/apartments/create", {
    method: "POST",
    body: formData,
  });
};

// Keep existing GET endpoints for viewing/editing
export const getApartmentById = async (apartmentId) => {
  return apiRequest(`/apartments/${apartmentId}`, {
    method: "GET",
  });
};

export const getHostApartments = async () => {
  return apiRequest("/apartments/host/list", {
    method: "GET",
  });
};

export const updateApartmentStatus = async (apartmentId, status) => {
  return apiRequest(`/apartments/${apartmentId}/status`, {
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
