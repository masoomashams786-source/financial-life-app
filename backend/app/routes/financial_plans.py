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
        
        # Check if plan type already exists for this user
        existing_plan = FinancialPlan.query.filter_by(
            user_id=int(user_id), 
            plan_type=validated_data["plan_type"]
        ).first()
        
        if existing_plan:
            return jsonify({"error": f"{validated_data['plan_type']} plan already exists"}), 409
        
        # Create new plan
        plan = FinancialPlan(
            user_id=int(user_id),
            plan_type=validated_data["plan_type"],
            current_value=validated_data["current_value"],
            monthly_contribution=validated_data.get("monthly_contribution", 0.0),
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
        
        # Update fields
        plan.plan_type = validated_data["plan_type"]
        plan.current_value = validated_data["current_value"]
        plan.monthly_contribution = validated_data.get("monthly_contribution", 0.0)
        plan.notes = validated_data.get("notes", "")
        
        db.session.commit()
        
        return jsonify({
            "message": "Financial plan updated successfully",
            "plan": financial_plan_schema.dump(plan)
        }), 200
        
    except Exception as e:
        db.session.rollback()
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