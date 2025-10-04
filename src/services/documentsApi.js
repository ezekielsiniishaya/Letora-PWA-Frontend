import BASE_URL from "../config/config";

// Upload ID Card
export const uploadIdCardAPI = async (file) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("document", file);

  const response = await fetch(`${BASE_URL}/api/documents/upload-id-card`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to upload ID card");
  }

  return response.json();
};

// Upload ID Photograph
export const uploadIdPhotographAPI = async (file) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("document", file);

  const response = await fetch(
    `${BASE_URL}/api/documents/upload-id-photograph`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to upload ID photograph");
  }

  return response.json();
};

// Get user's documents
export const getUserDocumentsAPI = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/api/documents/my-documents`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to get documents");
  }

  return response.json();
};
