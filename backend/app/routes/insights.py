"""
API routes for financial insights and analysis
"""

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import FinancialSnapshot, FinancialPlan
from app.services.insight_engine import InsightEngine

insights_bp = Blueprint("insights", __name__, url_prefix="/api/insights")


@insights_bp.route("/analysis", methods=["GET"])
@jwt_required()
def get_financial_analysis():
    """
    Get complete financial analysis with health score and recommendations
    
    Returns:
    {
        "health_score": {...},
        "metrics": {...},
        "strengths": [...],
        "vulnerabilities": [...],
        "immediate_actions": [...],
        "short_term_tactics": [...],
        "long_term_strategy": [...],
        "alerts": [...],
        "benchmarks": {...}
    }
    """
    user_id = get_jwt_identity()
    
    try:
        # Get user data
        snapshot = FinancialSnapshot.query.filter_by(user_id=int(user_id)).first()
        plans = FinancialPlan.query.filter_by(user_id=int(user_id)).all()
        
        if not snapshot:
            return jsonify({"error": "Financial snapshot required"}), 404
        
        # Build user data
        user_data = {
            'age': plans[0].user_current_age if plans else 30,
            'monthly_income': snapshot.net_income,
            'side_income': snapshot.side_income,
            'monthly_expenses': snapshot.monthly_expenses,
            'savings': snapshot.savings,
            'investments': snapshot.investments,
            'debt': snapshot.debt,
            'plans': [
                {
                    'plan_type': p.plan_type,
                    'cash_value': p.cash_value,
                    'monthly_contribution': p.monthly_contribution,
                    'years_to_contribute': p.years_to_contribute,
                    'user_current_age': p.user_current_age
                }
                for p in plans
            ]
        }
        
        # Generate insights
        engine = InsightEngine()
        analysis = engine.analyze_financial_profile(user_data)
        
        return jsonify(analysis), 200
        
    except Exception as e:
        print(f"Analysis error: {str(e)}")
        return jsonify({"error": "Failed to generate analysis"}), 500