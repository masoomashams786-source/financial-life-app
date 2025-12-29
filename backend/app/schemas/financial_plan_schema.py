from app.extensions import ma
from marshmallow import fields, validate, EXCLUDE

class FinancialPlanSchema(ma.Schema):
    class Meta:
        unknown = EXCLUDE

    id = fields.Int(dump_only=True)
    user_id = fields.Int(dump_only=True)
    
    plan_type = fields.Str(
        required=True, 
        validate=validate.OneOf([
            "Max-Funded IUL",
            "Whole Life (IBC)",
            "Roth IRA",
            "Traditional 401k",
            "Roth 401k",
            "Solo 401k",
            "HSA",
            "529 Plan",
            "Real Estate",
            "Private Equity",
            "CDs / Savings",
            "Non-Qual Annuity",
            "Other"
        ])
    )
    
    # Current status
    current_value = fields.Float(required=True, validate=validate.Range(min=0))
    cash_value = fields.Float(validate=validate.Range(min=0))
    
    # Contribution details
    monthly_contribution = fields.Float(validate=validate.Range(min=0))
    total_contribution_amount = fields.Float(validate=validate.Range(min=0))
    years_to_contribute = fields.Int(validate=validate.Range(min=0, max=100))
    
    # Income withdrawal
    income_start_age = fields.Int(validate=validate.Range(min=18, max=120))
    income_end_age = fields.Int(validate=validate.Range(min=18, max=120))
    user_current_age = fields.Int(validate=validate.Range(min=18, max=120))
    
    # Notes
    notes = fields.Str(validate=validate.Length(max=1000))
    
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)