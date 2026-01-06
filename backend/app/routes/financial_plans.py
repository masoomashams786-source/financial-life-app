from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import FinancialPlan
from app.extensions import db
from app.schemas import financial_plan_schema, financial_plans_schema

financial_plans_bp = Blueprint("financial_plans", __name__, url_prefix="/api/financial-plans")


@financial_plans_bp.route("", methods=["GET"])
@jwt_required()
def get_plans():
    """Get all user's financial plans"""
    user_id = get_jwt_identity()
    plans = FinancialPlan.query.filter_by(user_id=int(user_id)).all()
    return jsonify(financial_plans_schema.dump(plans)), 200


@financial_plans_bp.route("/<int:plan_id>", methods=["GET"])
@jwt_required()
def get_plan(plan_id):
    """Get a specific financial plan"""
    user_id = get_jwt_identity()
    plan = FinancialPlan.query.filter_by(id=plan_id, user_id=int(user_id)).first()
    
    if not plan:
        return jsonify({"error": "Plan not found"}), 404
    
    return jsonify(financial_plan_schema.dump(plan)), 200


@financial_plans_bp.route("", methods=["POST"])
@jwt_required()
def create_plan():
    """Create a new financial plan"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    # Validate data
    errors = financial_plan_schema.validate(data)
    if errors:
        return jsonify({"errors": errors}), 422
    
    try:
        validated_data = financial_plan_schema.load(data)
        
        # Check if plan type already exists for this user (only for single-plan types)
        single_plan_types = ["Roth IRA", "Traditional 401k", "Roth 401k", "Solo 401k", "HSA"]
        
        if validated_data["plan_type"] in single_plan_types:
            existing_plan = FinancialPlan.query.filter_by(
                user_id=int(user_id), 
                plan_type=validated_data["plan_type"]
            ).first()
            
            if existing_plan:
                return jsonify({"error": f"{validated_data['plan_type']} plan already exists. You can only have one."}), 409
        
        # Create new plan with ALL fields
        plan = FinancialPlan(
            user_id=int(user_id),
            plan_type=validated_data["plan_type"],
            current_value=validated_data["current_value"],
            cash_value=validated_data["cash_value"],
            monthly_contribution=validated_data["monthly_contribution"],
            total_contribution_amount=validated_data.get("total_contribution_amount", 0.0),
            years_to_contribute=validated_data["years_to_contribute"],
            income_start_age=validated_data["income_start_age"],
            income_end_age=validated_data["income_end_age"],
            user_current_age=validated_data["user_current_age"],
            income_rate=validated_data["income_rate"],  # Make sure this is included
            notes=validated_data.get("notes", "")
        )
        
        db.session.add(plan)
        db.session.commit()
        
        return jsonify({
            "message": "Financial plan created successfully",
            "plan": financial_plan_schema.dump(plan)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error creating plan: {str(e)}")  # Debug log
        return jsonify({"error": "Failed to create plan"}), 500


@financial_plans_bp.route("/<int:plan_id>", methods=["PUT"])
@jwt_required()
def update_plan(plan_id):
    """Update an existing financial plan"""
    user_id = get_jwt_identity()
    plan = FinancialPlan.query.filter_by(id=plan_id, user_id=int(user_id)).first()
    
    if not plan:
        return jsonify({"error": "Plan not found"}), 404
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    # Validate data
    errors = financial_plan_schema.validate(data)
    if errors:
        return jsonify({"errors": errors}), 422
    
    try:
        validated_data = financial_plan_schema.load(data)
        
        # Update ALL fields
        plan.plan_type = validated_data["plan_type"]
        plan.current_value = validated_data["current_value"]
        plan.cash_value = validated_data["cash_value"]
        plan.monthly_contribution = validated_data["monthly_contribution"]
        plan.total_contribution_amount = validated_data.get("total_contribution_amount", 0.0)
        plan.years_to_contribute = validated_data["years_to_contribute"]
        plan.income_start_age = validated_data["income_start_age"]
        plan.income_end_age = validated_data["income_end_age"]
        plan.user_current_age = validated_data["user_current_age"]
        plan.income_rate = validated_data["income_rate"]  # Make sure this is included
        plan.notes = validated_data.get("notes", "")
        
        db.session.commit()
        
        return jsonify({
            "message": "Financial plan updated successfully",
            "plan": financial_plan_schema.dump(plan)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error updating plan: {str(e)}")  # Debug log
        return jsonify({"error": "Failed to update plan"}), 500


@financial_plans_bp.route("/<int:plan_id>", methods=["DELETE"])
@jwt_required()
def delete_plan(plan_id):
    """Delete a financial plan"""
    user_id = get_jwt_identity()
    plan = FinancialPlan.query.filter_by(id=plan_id, user_id=int(user_id)).first()
    
    if not plan:
        return jsonify({"error": "Plan not found"}), 404
    
    try:
        db.session.delete(plan)
        db.session.commit()
        return jsonify({"message": "Plan deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete plan"}), 500


@financial_plans_bp.route("/summary", methods=["GET"])
@jwt_required()
def get_summary():
    """Get summary of all plans (total value)"""
    user_id = get_jwt_identity()
    plans = FinancialPlan.query.filter_by(user_id=int(user_id)).all()
    
    total_value = sum(plan.current_value for plan in plans)
    total_contributions = sum(plan.monthly_contribution for plan in plans)
    
    return jsonify({
        "total_plans": len(plans),
        "total_value": total_value,
        "total_monthly_contributions": total_contributions,
        "plans": financial_plans_schema.dump(plans)
    }), 200