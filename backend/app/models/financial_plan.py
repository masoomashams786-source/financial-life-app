from datetime import datetime, timezone
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, Text
from app.extensions import db

class FinancialPlan(db.Model):
    __tablename__ = "financial_plans"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    
    # Plan identification
    plan_type: Mapped[str] = mapped_column(String(50), nullable=False)
    
    # Current status
    current_value: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    cash_value: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    
    # Contribution details
    monthly_contribution: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    total_contribution_amount: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    years_to_contribute: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    # Income withdrawal details
    income_start_age: Mapped[int] = mapped_column(Integer, nullable=True)
    income_end_age: Mapped[int] = mapped_column(Integer, nullable=True)
    
    # User's current age (for calculations)
    user_current_age: Mapped[int] = mapped_column(Integer, nullable=True)
    
    # Additional info
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=lambda: datetime.now(timezone.utc), 
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=lambda: datetime.now(timezone.utc), 
        onupdate=lambda: datetime.now(timezone.utc), 
        nullable=False
    )

    def __repr__(self) -> str:
        return f"<FinancialPlan {self.plan_type}: ${self.current_value}>"