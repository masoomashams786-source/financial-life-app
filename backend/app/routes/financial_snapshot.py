from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import FinancialSnapshot
from app.extensions import db
from app.schemas import financial_snapshot_schema

financial_snapshot_bp = Blueprint("financial_snapshot", __name__, url_prefix="/api/financial-snapshot")


@financial_snapshot_bp.route("", methods=["GET"])
@jwt_required()
def get_snapshot():
    """Get user's current financial snapshot"""
    user_id = get_jwt_identity()
    snapshot = FinancialSnapshot.query.filter_by(user_id=int(user_id)).first()
    
    if not snapshot:
        # Return default values if no snapshot exists
        return jsonify({
            "age": 0,
            "net_income": 0.0,
            "monthly_expenses": 0.0,
            "savings": 0.0,
            "investments": 0.0,
            "debt": 0.0,
            "side_income": 0.0
        }), 200
    
    return jsonify(financial_snapshot_schema.dump(snapshot)), 200


@financial_snapshot_bp.route("", methods=["POST", "PUT"])
@jwt_required()
def update_snapshot():
    """Create or update user's financial snapshot"""
    user_id = get_jwt_identity()
    data = request.get_json()
    print("RAW DATA:", data)
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    # Validate data
    errors = financial_snapshot_schema.validate(data)
    if errors:
        return jsonify({"errors": errors}), 422
    
    try:
        validated_data = financial_snapshot_schema.load(data)
        
        # Check if snapshot exists
        snapshot = FinancialSnapshot.query.filter_by(user_id=int(user_id)).first()
        
        if snapshot:
            # Update existing
            snapshot.age = validated_data["age"]
            snapshot.net_income = validated_data["net_income"]
            snapshot.monthly_expenses = validated_data["monthly_expenses"]
            snapshot.savings = validated_data["savings"]
            snapshot.investments = validated_data["investments"]
            snapshot.debt = validated_data["debt"]
            snapshot.side_income = validated_data["side_income"]
        else:
            # Create new
            snapshot = FinancialSnapshot(
                user_id=int(user_id),
                age=validated_data["age"],
                net_income=validated_data["net_income"],
                monthly_expenses=validated_data["monthly_expenses"],
                savings=validated_data["savings"],
                investments=validated_data["investments"],
                debt=validated_data["debt"],
                side_income=validated_data["side_income"]
            )
            db.session.add(snapshot)
        
        db.session.commit()
        
        return jsonify({
            "message": "Financial snapshot updated successfully",
            "snapshot": financial_snapshot_schema.dump(snapshot)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update snapshot"}), 500