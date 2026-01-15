"""
API routes for Wealth Velocity metrics - FIXED
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
    
    Returns realistic wealth velocity based on:
    1. Market returns on existing assets (5-10% annually)
    2. Verified contributions (retirement plans only)
    
    Does NOT assume all "surplus cash flow" is saved.
    """
    user_id = get_jwt_identity()
    
    try:
        # Get user's financial snapshot
        snapshot = FinancialSnapshot.query.filter_by(user_id=int(user_id)).first()
        plans = FinancialPlan.query.filter_by(user_id=int(user_id)).all()
        
        if not snapshot:
            return jsonify({"error": "Financial snapshot not found"}), 404
        
        # Calculate VERIFIED monthly contributions (what we can prove is being saved)
        monthly_plan_contributions = sum(plan.monthly_contribution for plan in plans)
        
        # Calculate total assets
        total_assets = snapshot.savings + snapshot.investments
        
        # Add plan cash values to total assets
        plan_cash_values = sum(plan.cash_value for plan in plans)
        total_assets += plan_cash_values
        
        # Calculate net worth
        net_worth = total_assets - snapshot.debt
        
        # Build user data
        user_data = {
            'monthly_income': snapshot.net_income,
            'side_income': snapshot.side_income,
            'monthly_expenses': snapshot.monthly_expenses,
            'savings': snapshot.savings,
            'investments': snapshot.investments,
            'debt': snapshot.debt,
            'net_worth': net_worth,
            'monthly_plan_contributions': monthly_plan_contributions,  # VERIFIED savings
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
    """
    Helper to calculate ACTUAL savings rate
    
    Savings rate = (verified contributions) / (total income)
    
    NOT the same as "cash flow surplus" because:
    - Cash flow surplus might go to discretionary spending
    - We only count what we KNOW is being saved
    """
    total_income = snapshot.net_income + snapshot.side_income
    
    if total_income == 0:
        return 0
    
    # VERIFIED savings = plan contributions only
    plan_contributions = sum(plan.monthly_contribution for plan in plans)
    
    # Savings rate = what percentage of income is being invested
    savings_rate = (plan_contributions / total_income) if total_income > 0 else 0
    
    return max(0, min(savings_rate, 1.0))  # Cap between 0-100%