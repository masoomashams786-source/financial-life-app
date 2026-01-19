"""
API routes for financial projections
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User, FinancialSnapshot, FinancialPlan
from app.services.projection_engine import ProjectionEngine

projections_bp = Blueprint("projections", __name__, url_prefix="/api/projections")


@projections_bp.route("/full", methods=["POST"])
@jwt_required()
def generate_full_projection():
    """
    Generate complete financial projection for user
    
    Request Body:
    {
        "scenario": "predicted" | "best" | "worst",
        "retirement_age": 65 (optional)
    }
    
    Returns:
    {
        "scenario": "predicted",
        "projections": [...],  // Year-by-year data
        "summary": {...}       // Summary statistics
    }
    """
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    
    scenario = data.get('scenario', 'predicted')
    if scenario not in ['predicted', 'best', 'worst']:
        return jsonify({"error": "Invalid scenario. Must be 'predicted', 'best', or 'worst'"}), 400
    
    try:
        # Get user data
        snapshot = FinancialSnapshot.query.filter_by(user_id=int(user_id)).first()
        plans = FinancialPlan.query.filter_by(user_id=int(user_id)).all()
        user = User.query.get(int(user_id))
        
        if not snapshot:
            return jsonify({"error": "Financial snapshot not found. Please update your snapshot first."}), 404
        
        # Build user data dictionary
        user_data = {
            'age': snapshot.age,
            'monthly_income': snapshot.net_income,
            'side_income': snapshot.side_income,
            'monthly_expenses': snapshot.monthly_expenses,
            'savings': snapshot.savings,
            'investments': snapshot.investments,
            'debt': snapshot.debt,
            'debt_interest_rate': 0,  # Assuming interest-free for now
            'plans': [
                {
                    'plan_type': p.plan_type,
                    'cash_value': p.cash_value,
                    'monthly_contribution': p.monthly_contribution,
                    'years_to_contribute': p.years_to_contribute,
                    'user_current_age': p.user_current_age,
                    'income_rate': p.income_rate,
                    'income_start_age': p.income_start_age,
                    'income_end_age': p.income_end_age
                }
                for p in plans
            ],
            'retirement_age': data.get('retirement_age', 65)
        }
        
        # Generate projection
        engine = ProjectionEngine()
        projection = engine.generate_full_projection(user_data, scenario)
        
        return jsonify(projection), 200
        
    except Exception as e:
        print(f"Projection error: {str(e)}")  # Debug
        return jsonify({"error": "Failed to generate projection"}), 500


@projections_bp.route("/all-scenarios", methods=["POST", "GET"])
@jwt_required()
def generate_all_scenarios():
    """
    Generate projections for all three scenarios at once
    
    Returns:
    {
        "predicted": {...},
        "best": {...},
        "worst": {...}
    }
    """
    user_id = get_jwt_identity()
    data = request.get_json(silent=True) or {}
    
    try:
        # Get user data (same as above)
        snapshot = FinancialSnapshot.query.filter_by(user_id=int(user_id)).first()
        plans = FinancialPlan.query.filter_by(user_id=int(user_id)).all()
        
        if not snapshot:
            return jsonify({"error": "Financial snapshot required"}), 404
        if not snapshot.age:
            return jsonify({"error": "Please update your age in Financial Snapshot"}), 400
        
        user_data = {
            'age': snapshot.age,
            'monthly_income': snapshot.net_income,
            'side_income': snapshot.side_income,
            'monthly_expenses': snapshot.monthly_expenses,
            'savings': snapshot.savings,
            'investments': snapshot.investments,
            'debt': snapshot.debt,
            'debt_interest_rate': 0,
            'plans': [
                {
                    'plan_type': p.plan_type,
                    'cash_value': p.cash_value,
                    'monthly_contribution': p.monthly_contribution,
                    'years_to_contribute': p.years_to_contribute,
                    'user_current_age': p.user_current_age,
                    'income_rate': p.income_rate,
                    'income_start_age': p.income_start_age,
                    'income_end_age': p.income_end_age
                }
                for p in plans
            ],
            'retirement_age': data.get('retirement_age', 65)
        }
        
        # Generate all scenarios
        engine = ProjectionEngine()
        
        predicted = engine.generate_full_projection(user_data, 'predicted')
        best = engine.generate_full_projection(user_data, 'best')
        worst = engine.generate_full_projection(user_data, 'worst')
        
        return jsonify({
            'predicted': predicted,
            'best': best,
            'worst': worst
        }), 200
        
    except Exception as e:
        print(f"Projection error: {str(e)}")
        return jsonify({"error": "Failed to generate projections"}), 500