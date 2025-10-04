import BASE_URL from "../config/config";

// Add or update bank details
export const uploadBankDetailsAPI = async (bankDetails) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/api/users/bank-details`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(bankDetails),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload bank details");
  }

  return response.json();
};
