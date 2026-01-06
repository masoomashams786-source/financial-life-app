import api from "./axios";



// SWR-compatible fetchers
export const financialPlansFetcher = (url) => {
  return api.get(url).then((res) => res.data);
};

export const createFinancialPlan = (data) => {
  return api.post("/financial-plans", data);
};

export const updateFinancialPlan = (id, data) => {
  return api.put(`/financial-plans/${id}`, data);
};

export const deleteFinancialPlan = (id) => {
  return api.delete(`/financial-plans/${id}`);
};