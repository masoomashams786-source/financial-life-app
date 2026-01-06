import api from "./axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

// SWR-compatible fetcher
export const insightsFetcher = (url) => {
  return api.get(url).then((res) => res.data);
};