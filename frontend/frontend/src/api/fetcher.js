import api from "./axios";

/**
 * SWR fetcher using axios instance
 * Token is automatically attached by axios interceptor
 */
export const fetcher = (url) => api.get(url).then((res) => res.data);
