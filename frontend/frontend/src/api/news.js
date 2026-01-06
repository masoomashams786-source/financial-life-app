import api from "./axios";


export const getFinancialNews = async () => {
  const response = await api.get("/news/headlines");
  return response.data;
};

export const getFinancialArticles = async () => {
  const response = await api.get("/news/articles");
  return response.data;
};