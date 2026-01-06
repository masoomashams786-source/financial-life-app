import api from "./axios";

// ✅ Simplified - no manual headers!
export const getFinancialSnapshot = () => {
  return api.get("/financial-snapshot");
};

export const updateFinancialSnapshot = (data) => {
  return api.post("/financial-snapshot", data);
};