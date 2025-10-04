// services/apartmentApi.js
import { apiRequest } from "./apiRequest";

// Single endpoint to create complete apartment
export const createCompleteApartment = async (formData) => {
  return apiRequest("/apartments/create", {
    method: "POST",
    body: formData, // FormData with images and JSON data
    // Note: Don't set Content-Type header when sending FormData
    // Let the browser set it automatically with boundary
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
  apartmentData, // This should already be transformed
  imageFiles,
  documentFiles
) => {
  const formData = new FormData();

  // Just use the data as-is (it should already be transformed)
  formData.append("apartmentData", JSON.stringify(apartmentData));

  // Add image files
  if (imageFiles && imageFiles.length > 0) {
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });
  }

  // Add document files
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
    // Add your auth token method if needed
    const token = localStorage.getItem("authToken");
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }
    xhr.send(formData);
  });
};
