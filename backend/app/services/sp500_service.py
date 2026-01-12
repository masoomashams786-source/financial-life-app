"""
S&P 500 Data Service - Simple & Reliable
Fetches S&P 500 data with proper error handling and caching
"""

import yfinance as yf
from datetime import datetime, timedelta
from typing import Dict, Any
import logging
import time

logger = logging.getLogger(__name__)


class SP500Service:
    """
    Service for fetching S&P 500 data
    Simple implementation with caching and rate limiting
    """
    
    TICKER = "^GSPC"
    CACHE_DURATION_MINUTES = 15
    
    def __init__(self):
        self._cache = {}
        self._cache_time = {}
    
    def _get_cached(self, key: str) -> Dict[str, Any]:
        """Get cached data if still valid"""
        if key not in self._cache or key not in self._cache_time:
            return None
        
        age = datetime.now() - self._cache_time[key]
        if age.total_seconds() / 60 < self.CACHE_DURATION_MINUTES:
            logger.info(f"Returning cached data for {key}")
            return self._cache[key]
        
        return None
    
    def _set_cache(self, key: str, data: Dict[str, Any]):
        """Store data in cache"""
        self._cache[key] = data
        self._cache_time[key] = datetime.now()
    
    def get_current_data(self) -> Dict[str, Any]:
        """
        Get current S&P 500 price
        Returns cached data if available, otherwise fetches fresh
        """
        cache_key = "current"
        
        # Try cache first
        cached = self._get_cached(cache_key)
        if cached:
            return cached
        
        try:
            # Add small delay to avoid rate limiting
            time.sleep(1)
            
            # Fetch data using simple history method (most reliable)
            ticker = yf.Ticker(self.TICKER)
            hist = ticker.history(period="5d")
            
            if hist.empty:
                raise Exception("No data returned from Yahoo Finance")
            
            # Get latest data
            latest = hist.iloc[-1]
            current_price = float(latest['Close'])
            
            # Calculate change
            if len(hist) >= 2:
                previous = hist.iloc[-2]
                previous_close = float(previous['Close'])
            else:
                previous_close = float(latest['Open'])
            
            change = current_price - previous_close
            percent_change = (change / previous_close * 100) if previous_close != 0 else 0
            
            result = {
                "ticker": self.TICKER,
                "current_price": round(current_price, 2),
                "change": round(change, 2),
                "percent_change": round(percent_change, 2),
                "previous_close": round(previous_close, 2),
                "timestamp": datetime.now().isoformat(),
                "market_status": self._get_market_status()
            }
            
            # Cache it
            self._set_cache(cache_key, result)
            logger.info("Successfully fetched current S&P 500 data")
            
            return result
            
        except Exception as e:
            logger.error(f"Error fetching S&P 500 data: {str(e)}")
            
            # Return stale cache if available
            if cache_key in self._cache:
                logger.warning("Returning stale cached data")
                stale = self._cache[cache_key]
                stale['stale'] = True
                return stale
            
            # Return mock data as last resort
            logger.warning("Returning mock data")
            return {
                "ticker": self.TICKER,
                "current_price": 4783.45,
                "change": 23.67,
                "percent_change": 0.50,
                "previous_close": 4759.78,
                "timestamp": datetime.now().isoformat(),
                "market_status": "closed",
                "mock": True,
                "error": "Unable to fetch live data"
            }
    
    def get_historical_data(self, period: str = "1mo", interval: str = "1d") -> Dict[str, Any]:
        """
        Get historical S&P 500 data
        """
        cache_key = f"hist_{period}_{interval}"
        
        # Try cache first
        cached = self._get_cached(cache_key)
        if cached:
            return cached
        
        try:
            # Add delay
            time.sleep(1)
            
            # Fetch historical data
            ticker = yf.Ticker(self.TICKER)
            hist = ticker.history(period=period, interval=interval)
            
            if hist.empty:
                raise Exception(f"No historical data for period {period}")
            
            # Convert to list of dicts
            data_points = []
            for date, row in hist.iterrows():
                data_points.append({
                    "date": date.strftime("%Y-%m-%d"),
                    "timestamp": int(date.timestamp()),
                    "open": round(float(row['Open']), 2),
                    "high": round(float(row['High']), 2),
                    "low": round(float(row['Low']), 2),
                    "close": round(float(row['Close']), 2),
                    "volume": int(row['Volume'])
                })
            
            # Calculate stats
            closes = [p['close'] for p in data_points]
            statistics = {
                "high": round(max(closes), 2),
                "low": round(min(closes), 2),
                "mean": round(sum(closes) / len(closes), 2),
                "range": round(max(closes) - min(closes), 2),
                "volatility": round(self._calculate_volatility(closes), 2)
            }
            
            result = {
                "ticker": self.TICKER,
                "period": period,
                "interval": interval,
                "data": data_points,
                "statistics": statistics,
                "data_points_count": len(data_points)
            }
            
            # Cache it
            self._set_cache(cache_key, result)
            logger.info(f"Successfully fetched historical data for {period}")
            
            return result
            
        except Exception as e:
            logger.error(f"Error fetching historical data: {str(e)}")
            
            # Return stale cache if available
            if cache_key in self._cache:
                logger.warning("Returning stale historical data")
                return self._cache[cache_key]
            
            # Return mock data
            logger.warning("Returning mock historical data")
            return self._generate_mock_historical(period)
    
    def _calculate_volatility(self, closes: list) -> float:
        """Calculate simple volatility"""
        if len(closes) < 2:
            return 0.0
        
        mean = sum(closes) / len(closes)
        variance = sum((x - mean) ** 2 for x in closes) / len(closes)
        std_dev = variance ** 0.5
        
        return (std_dev / mean * 100) if mean != 0 else 0.0
    
    def _generate_mock_historical(self, period: str) -> Dict[str, Any]:
        """Generate mock historical data"""
        base_price = 4783.45
        num_days = {"1d": 1, "5d": 5, "1mo": 21, "3mo": 63, "6mo": 126, "1y": 252}.get(period, 21)
        
        data_points = []
        for i in range(num_days):
            date = datetime.now() - timedelta(days=num_days - i)
            price = base_price + (i * 2) - 20
            
            data_points.append({
                "date": date.strftime("%Y-%m-%d"),
                "timestamp": int(date.timestamp()),
                "open": round(price - 5, 2),
                "high": round(price + 10, 2),
                "low": round(price - 10, 2),
                "close": round(price, 2),
                "volume": 3500000000
            })
        
        closes = [p['close'] for p in data_points]
        
        return {
            "ticker": self.TICKER,
            "period": period,
            "interval": "1d",
            "data": data_points,
            "statistics": {
                "high": round(max(closes), 2),
                "low": round(min(closes), 2),
                "mean": round(sum(closes) / len(closes), 2),
                "range": round(max(closes) - min(closes), 2),
                "volatility": 1.5
            },
            "data_points_count": len(data_points),
            "mock": True
        }
    
    def _get_market_status(self) -> str:
        """Determine market status"""
        now = datetime.now()
        
        # Weekend
        if now.weekday() >= 5:
            return "closed"
        
        # Market hours (9:30 AM - 4:00 PM ET)
        hour = now.hour
        minute = now.minute
        
        if hour < 9 or (hour == 9 and minute < 30):
            return "pre_market" if hour >= 4 else "closed"
        elif hour >= 16:
            return "post_market" if hour < 20 else "closed"
        else:
            return "open"