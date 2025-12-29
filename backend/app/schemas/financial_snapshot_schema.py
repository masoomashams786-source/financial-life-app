from app.extensions import ma
from marshmallow import fields, validate, EXCLUDE

class FinancialSnapshotSchema(ma.Schema):
    class Meta:
        unknown = EXCLUDE

    id = fields.Int(dump_only=True)
    user_id = fields.Int(dump_only=True)
    
    net_income = fields.Float(required=True, validate=validate.Range(min=0))
    monthly_expenses = fields.Float(required=True, validate=validate.Range(min=0))
    savings = fields.Float(required=True, validate=validate.Range(min=0))
    investments = fields.Float(required=True, validate=validate.Range(min=0))
    debt = fields.Float(required=True, validate=validate.Range(min=0))
    side_income = fields.Float(required=True, validate=validate.Range(min=0))
    
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)