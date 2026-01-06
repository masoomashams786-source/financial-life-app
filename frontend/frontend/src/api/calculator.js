import api from "./axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

// Calculator mutations
export const comparePlan = (data) => {
  return api.post("/calculator/compare", data);
};

export const compareMultiplePlans = (data) => {
  return api.post("/calculator/compare-multiple", data);
};