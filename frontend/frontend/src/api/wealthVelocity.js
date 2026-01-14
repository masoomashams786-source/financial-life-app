import api from "./axios";

// SWR-compatible fetcher
export const wealthVelocityFetcher = (url) => {
  return api.get(url).then((res) => res.data);
};