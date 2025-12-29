import axios from "axios";

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const NEWS_BASE_URL = "https://newsapi.org/v2";

// Fetch financial news
export const getFinancialNews = async () => {
  try {
    const response = await axios.get(`${NEWS_BASE_URL}/top-headlines`, {
      params: {
        category: "business",
        country: "us",
        pageSize: 10,
        apiKey: NEWS_API_KEY,
      },
    });
    return response.data.articles;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};

// Fetch financial articles/education content
export const getFinancialArticles = async () => {
  try {
    const response = await axios.get(`${NEWS_BASE_URL}/everything`, {
      params: {
        q: "personal finance OR investing OR retirement planning",
        language: "en",
        sortBy: "relevancy",
        pageSize: 10,
        apiKey: NEWS_API_KEY,
      },
    });
    return response.data.articles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
};