import api from "./axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

// SWR-compatible fetcher
export const projectionsFetcher = (url) => {
  return api.get(url).then((res) => res.data);
};

export const generateAllScenarios = (data = {}) => {
  return api.post("/projections/all-scenarios", data);
};