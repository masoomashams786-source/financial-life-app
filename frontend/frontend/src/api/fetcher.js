import api from "./axios";

// fetcher function for SWR
export const fetcher = (url) => {
  const token = localStorage.getItem("token");
  return api.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.data);
};
