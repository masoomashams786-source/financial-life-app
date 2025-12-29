import api from "./axios";

// Get user's financial snapshot
export const getFinancialSnapshot = () => {
  const token = localStorage.getItem("token");
  return api.get("/financial-snapshot", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Update user's financial snapshot
export const updateFinancialSnapshot = (data) => {
  const token = localStorage.getItem("token");
  return api.post("/financial-snapshot", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};