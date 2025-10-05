import { apiRequest } from "./apiRequest";

// Create host profile (documents + banking info)
export const createHostProfileAPI = async (hostProfileData) => {
  return await apiRequest("/api/users/profile", {
    method: "POST",
    body: hostProfileData,
  });
};

// Get host profile
export const getHostProfileAPI = async () => {
  return await apiRequest("/api/users/profile", {
    method: "GET",
  });
};

// Get account name
export const getAccountNameAPI = async () => {
  return await apiRequest("/api/users/account-name", {
    method: "GET",
  });
};
