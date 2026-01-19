from datetime import datetime, timezone
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey
from app.extensions import db

class FinancialSnapshot(db.Model):
    __tablename__ = "financial_snapshots"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    age: Mapped[int] = mapped_column(Integer, nullable=True)
    
    # Income
    net_income: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    
    # Expenses
    monthly_expenses: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    
    # Assets
    savings: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    investments: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    
    # Liabilities
    debt: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    
    # Side income
    side_income: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    
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
        return f"<FinancialSnapshot user_id={self.user_id}>"