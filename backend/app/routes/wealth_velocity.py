"""
API routes for Wealth Velocity metrics
"""

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import FinancialSnapshot, FinancialPlan
from app.services.wealth_velocity_engine import WealthVelocityEngine

wealth_velocity_bp = Blueprint("wealth_velocity", __name__, url_prefix="/api/wealth-velocity")


@wealth_velocity_bp.route("", methods=["GET"])
@jwt_required()
def get_wealth_velocity():
    
    """
    Get wealth velocity analysis for current user
    
    Returns:
    {
        "velocity": 14.2,
        "real_velocity": 11.2,
        "trend": "up",
        "momentum": "strong",
        "percentile": 90,
        "benchmark": {...},
        "projections": {...},
        "metrics": {...}
    }
    """
    user_id = get_jwt_identity()
    
    try:
        # Get user's financial snapshot
        snapshot = FinancialSnapshot.query.filter_by(user_id=int(user_id)).first()
        plans = FinancialPlan.query.filter_by(user_id=int(user_id)).all()
        
        if not snapshot:
            return jsonify({"error": "Financial snapshot not found"}), 404
        
        # Build user data
        user_data = {
            'monthly_income': snapshot.net_income,
            'side_income': snapshot.side_income,
            'monthly_expenses': snapshot.monthly_expenses,
            'savings': snapshot.savings,
            'investments': snapshot.investments,
            'debt': snapshot.debt,
            'net_worth': (snapshot.savings + snapshot.investments) - snapshot.debt,
            'savings_rate': _calculate_savings_rate(snapshot, plans)
        }
        
        # TODO: Implement historical data storage
        # For now, historical_data is None (will estimate from current data)
        historical_data = None
        
        # Calculate wealth velocity
        engine = WealthVelocityEngine()
        analysis = engine.calculate_wealth_velocity(user_data, historical_data)
        
        return jsonify(analysis), 200
        
    except Exception as e:
        print(f"Wealth velocity error: {str(e)}")
        return jsonify({"error": "Failed to calculate wealth velocity"}), 500


def _calculate_savings_rate(snapshot, plans):
    """Helper to calculate savings rate"""
    total_income = snapshot.net_income + snapshot.side_income
    
    if total_income == 0:
        return 0
    
    # Calculate plan contributions
    plan_contributions = sum(plan.monthly_contribution for plan in plans)
    
    # Monthly surplus
    monthly_surplus = total_income - snapshot.monthly_expenses - plan_contributions
    
    # Savings rate
    savings_rate = (monthly_surplus / total_income) if total_income > 0 else 0
    
    return max(0, savings_rate)  # Ensure non-negative