
import api from "./axios";

/**
 * SWR-compatible fetcher for S&P 500 current data
 * @param {string} url - API endpoint
 * @returns {Promise} API response data
 */
export const sp500Fetcher = (url) => {
  return api.get(url).then((res) => res.data);
};

/**
 * Get current S&P 500 price and today's performance
 * @returns {Promise} Current market data
 * 
 * Response shape:
 * {
 *   ticker: string,
 *   current_price: number,
 *   change: number,
 *   percent_change: number,
 *   previous_close: number,
 *   timestamp: string,
 *   market_status: 'open' | 'closed' | 'pre_market' | 'post_market'
 * }
 */
export const getCurrentSP500 = () => {
  return api.get("/sp500/current");
};

/**
 * Get historical S&P 500 data for charting
 * @param {Object} params - Query parameters
 * @param {string} params.period - Time period (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
 * @param {string} params.interval - Data interval (1d, 1wk, 1mo)
 * @returns {Promise} Historical data with statistics
 * 
 * Response shape:
 * {
 *   ticker: string,
 *   period: string,
 *   interval: string,
 *   data: Array<{
 *     date: string,
 *     timestamp: number,
 *     open: number,
 *     high: number,
 *     low: number,
 *     close: number,
 *     volume: number
 *   }>,
 *   statistics: {
 *     high: number,
 *     low: number,
 *     mean: number,
 *     std_dev: number,
 *     volatility: number,
 *     range: number
 *   },
 *   data_points_count: number
 * }
 */
export const getHistoricalSP500 = (params = {}) => {
  const { period = "1mo", interval = "1d" } = params;
  return api.get("/sp500/historical", {
    params: { period, interval },
  });
};

/**
 * Get performance metrics for multiple time periods
 * @returns {Promise} Performance metrics
 * 
 * Response shape:
 * {
 *   current_price: number,
 *   as_of: string,
 *   '1D': { change: number, percent_change: number, past_price: number },
 *   '1W': { change: number, percent_change: number, past_price: number },
 *   '1M': { change: number, percent_change: number, past_price: number },
 *   '3M': { change: number, percent_change: number, past_price: number },
 *   '6M': { change: number, percent_change: number, past_price: number },
 *   '1Y': { change: number, percent_change: number, past_price: number },
 *   'YTD': { change: number, percent_change: number, past_price: number }
 * }
 */
export const getPerformanceMetrics = () => {
  return api.get("/sp500/performance");
};

/**
 * Check S&P 500 service health
 * @returns {Promise} Health status
 */
export const checkSP500Health = () => {
  return api.get("/sp500/health");
};