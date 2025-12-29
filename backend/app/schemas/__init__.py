from .user_schema import UserSchema
from .financial_snapshot_schema import FinancialSnapshotSchema
from .financial_plan_schema import FinancialPlanSchema
# instance used by routes
user_schema = UserSchema()
financial_snapshot_schema = FinancialSnapshotSchema()
financial_plan_schema = FinancialPlanSchema()
financial_plans_schema = FinancialPlanSchema(many=True)
