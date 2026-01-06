from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
import requests
import os

news_bp = Blueprint("news", __name__, url_prefix="/api/news")

NEWS_API_KEY = os.getenv("NEWS_API_KEY")
NEWS_BASE_URL = "https://newsapi.org/v2"

@news_bp.route("/headlines", methods=["GET"])
@jwt_required()
def get_headlines():
    """Get top business headlines"""
    try:
        response = requests.get(
            f"{NEWS_BASE_URL}/top-headlines",
            params={
                "category": "business",
                "country": "us",
                "pageSize": 10,
                "apiKey": NEWS_API_KEY,
            },
            timeout=5
        )
        response.raise_for_status()
        return jsonify(response.json()["articles"]), 200
    except requests.Timeout:
        return jsonify({"error": "News service timeout"}), 504
    except requests.RequestException as e:
        return jsonify({"error": "Failed to fetch news"}), 500

@news_bp.route("/articles", methods=["GET"])
@jwt_required()
def get_articles():
    """Get financial articles"""
    try:
        response = requests.get(
            f"{NEWS_BASE_URL}/everything",
            params={
                "q": "personal finance OR investing OR retirement planning",
                "language": "en",
                "sortBy": "relevancy",
                "pageSize": 10,
                "apiKey": NEWS_API_KEY,
            },
            timeout=5
        )
        response.raise_for_status()
        return jsonify(response.json()["articles"]), 200
    except requests.Timeout:
        return jsonify({"error": "News service timeout"}), 504
    except requests.RequestException as e:
        return jsonify({"error": "Failed to fetch articles"}), 500