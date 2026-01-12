from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app.services.sp500_service import SP500Service
import logging

logger = logging.getLogger(__name__)

sp500_bp = Blueprint("sp500", __name__, url_prefix="/api/sp500")

# Initialize service
sp500_service = SP500Service()


@sp500_bp.route("/current", methods=["GET"])
@jwt_required()
def get_current_price():
    """
    Get current S&P 500 price and today's performance
    
    Returns:
        200: Current market data
        500: Server error
    
    Example Response:
    {
        "ticker": "^GSPC",
        "current_price": 4783.45,
        "change": 23.67,
        "percent_change": 0.50,
        "previous_close": 4759.78,
        "timestamp": "2024-01-08T15:30:00",
        "market_status": "open"
    }
    """
    try:
        data = sp500_service.get_current_data()
        return jsonify(data), 200
        
    except Exception as e:
        logger.error(f"Error in get_current_price: {str(e)}")
        return jsonify({
            "error": "Failed to fetch current market data",
            "message": str(e)
        }), 500


@sp500_bp.route("/historical", methods=["GET"])
@jwt_required()
def get_historical_data():
    """
    Get historical S&P 500 data for charting
    
    Query Parameters:
        period (str): Time period (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
                     Default: 1mo
        interval (str): Data interval (1d, 1wk, 1mo)
                       Default: 1d
    
    Returns:
        200: Historical data with statistics
        400: Invalid parameters
        500: Server error
    
    Example Response:
    {
        "ticker": "^GSPC",
        "period": "1mo",
        "interval": "1d",
        "data": [
            {
                "date": "2024-01-08",
                "timestamp": 1704672000,
                "open": 4750.23,
                "high": 4785.12,
                "low": 4745.67,
                "close": 4783.45,
                "volume": 3500000000
            },
            ...
        ],
        "statistics": {
            "high": 4850.43,
            "low": 4650.12,
            "mean": 4750.67,
            "std_dev": 45.23,
            "volatility": 0.95,
            "range": 200.31
        },
        "data_points_count": 21
    }
    """
    try:
        # Get query parameters
        period = request.args.get('period', '1mo')
        interval = request.args.get('interval', '1d')
        
        # Validate period
        valid_periods = ['1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max']
        if period not in valid_periods:
            return jsonify({
                "error": "Invalid period",
                "valid_periods": valid_periods
            }), 400
        
        # Validate interval
        valid_intervals = ['1m', '2m', '5m', '15m', '30m', '60m', '90m', '1h', '1d', '5d', '1wk', '1mo', '3mo']
        if interval not in valid_intervals:
            return jsonify({
                "error": "Invalid interval",
                "valid_intervals": valid_intervals
            }), 400
        
        # Fetch data
        data = sp500_service.get_historical_data(period=period, interval=interval)
        return jsonify(data), 200
        
    except ValueError as e:
        logger.warning(f"Invalid request parameters: {str(e)}")
        return jsonify({
            "error": "Invalid request parameters",
            "message": str(e)
        }), 400
        
    except Exception as e:
        logger.error(f"Error in get_historical_data: {str(e)}")
        return jsonify({
            "error": "Failed to fetch historical data",
            "message": str(e)
        }), 500


@sp500_bp.route("/performance", methods=["GET"])
@jwt_required()
def get_performance_metrics():
    """
    Get performance metrics for multiple time periods
    
    Returns:
        200: Performance metrics for all periods
        500: Server error
    
    Example Response:
    {
        "current_price": 4783.45,
        "as_of": "2024-01-08T15:30:00",
        "1D": {
            "change": 23.67,
            "percent_change": 0.50,
            "past_price": 4759.78
        },
        "1W": {
            "change": 45.23,
            "percent_change": 0.95,
            "past_price": 4738.22
        },
        "1M": {
            "change": 123.45,
            "percent_change": 2.65,
            "past_price": 4660.00
        },
        "3M": {
            "change": 234.56,
            "percent_change": 5.15,
            "past_price": 4548.89
        },
        "6M": {
            "change": 345.67,
            "percent_change": 7.78,
            "past_price": 4437.78
        },
        "1Y": {
            "change": 456.78,
            "percent_change": 10.56,
            "past_price": 4326.67
        },
        "YTD": {
            "change": 83.45,
            "percent_change": 1.77,
            "past_price": 4700.00
        }
    }
    """
    try:
        metrics = sp500_service.get_performance_metrics()
        return jsonify(metrics), 200
        
    except Exception as e:
        logger.error(f"Error in get_performance_metrics: {str(e)}")
        return jsonify({
            "error": "Failed to calculate performance metrics",
            "message": str(e)
        }), 500


@sp500_bp.route("/health", methods=["GET"])
def health_check():
    """
    Health check endpoint (no auth required)
    
    Returns:
        200: Service is healthy
    """
    return jsonify({
        "status": "healthy",
        "service": "S&P 500 Data Service",
        "timestamp": sp500_service._get_market_status()
    }), 200