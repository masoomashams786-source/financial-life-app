from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.services.financial_calculator import FinancialCalculator

calculator_bp = Blueprint("calculator", __name__, url_prefix="/api/calculator")


@calculator_bp.route("/compare", methods=["POST"])
@jwt_required()
def compare_plans():
    """
    Compare financial plans with projections
    """
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    required_fields = ["plan_type", "current_age", "monthly_contribution", 
                      "years_to_contribute", "income_start_age", "income_end_age"]
    
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    try:
        calculator = FinancialCalculator(
            tax_rate=data.get("tax_rate", 0.25),
            inflation_rate=data.get("inflation_rate", 0.03)
        )
        
        result = calculator.calculate_projection(
            plan_type=data["plan_type"],
            current_age=data["current_age"],
            monthly_contribution=data["monthly_contribution"],
            years_to_contribute=data["years_to_contribute"],
            income_start_age=data["income_start_age"],
            income_end_age=data["income_end_age"],
            current_value=data.get("current_value", 0.0)
        )
        
        return jsonify(result), 200
        
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Calculation failed"}), 500


@calculator_bp.route("/compare-multiple", methods=["POST"])
@jwt_required()
def compare_multiple_plans():
    """
    Compare multiple plans side by side
    """
    data = request.get_json()
    
    if not data or "plans" not in data:
        return jsonify({"error": "No plans provided"}), 400
    
    plans_to_compare = data["plans"]  # List of plan types
    params = data.get("params", {})
    
    required_params = ["current_age", "monthly_contribution", "years_to_contribute",
                      "income_start_age", "income_end_age"]
    
    for field in required_params:
        if field not in params:
            return jsonify({"error": f"Missing required parameter: {field}"}), 400
    
    try:
        calculator = FinancialCalculator(
            tax_rate=params.get("tax_rate", 0.25),
            inflation_rate=params.get("inflation_rate", 0.03)
        )
        
        results = []
        for plan_type in plans_to_compare:
            result = calculator.calculate_projection(
                plan_type=plan_type,
                current_age=params["current_age"],
                monthly_contribution=params["monthly_contribution"],
                years_to_contribute=params["years_to_contribute"],
                income_start_age=params["income_start_age"],
                income_end_age=params["income_end_age"],
                current_value=params.get("current_value", 0.0)
            )
            results.append(result)
        
        return jsonify({"comparisons": results}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500