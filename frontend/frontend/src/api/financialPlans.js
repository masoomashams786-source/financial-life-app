import api from "./axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

// SWR-compatible fetchers
export const financialPlansFetcher = (url) => {
  return api.get(url, { headers: getAuthHeaders() }).then((res) => res.data);
};

// Mutation functions (non-GET requests)
export const createFinancialPlan = (data) => {
  return api.post("/financial-plans", data, { headers: getAuthHeaders() });
};

export const updateFinancialPlan = (id, data) => {
  return api.put(`/financial-plans/${id}`, data, { headers: getAuthHeaders() });
};

export const deleteFinancialPlan = (id) => {
  return api.delete(`/financial-plans/${id}`, { headers: getAuthHeaders() });
};