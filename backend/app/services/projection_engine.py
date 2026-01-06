"""
Multi-Year Financial Projection Engine
Calculates year-by-year net worth, cash flow, and milestones
Pure algorithmic - no AI
"""

from typing import Dict, List, Any
from datetime import datetime


class ProjectionEngine:
    """
    Generates detailed financial projections over 30+ years
    Tracks net worth, assets, liabilities, cash flow year by year
    """
    
    def __init__(self):
        # Constants based on historical data
        self.INFLATION_RATE = 0.03  # 3% historical average
        self.DEFAULT_INCOME_GROWTH = 0.03  # Conservative 3%
        self.OPTIMISTIC_INCOME_GROWTH = 0.05  # Promotions, raises
        self.PESSIMISTIC_INCOME_GROWTH = -0.02  # Economic downturn
        
        # Investment return assumptions
        self.INVESTMENT_RETURNS = {
            "predicted": 0.07,  # 7% S&P 500 historical
            "best": 0.10,       # Bull market
            "worst": 0.03       # Bear market/recession
        }
        
    def generate_full_projection(
        self,
        user_data: Dict[str, Any],
        scenario: str = "predicted"
    ) -> Dict[str, Any]:
        """
        Generate complete financial projection from current age to retirement
        
        Args:
            user_data: Dictionary containing:
                - age: Current age
                - monthly_income: Net monthly income
                - side_income: Monthly side income
                - monthly_expenses: Monthly expenses
                - savings: Current savings
                - investments: Current investment value
                - debt: Total debt amount
                - debt_interest_rate: Interest rate on debt
                - plans: List of financial plans with contributions
                - retirement_age: Target retirement age (default 65)
                
            scenario: "predicted", "best", or "worst"
            
        Returns:
            Dictionary with year-by-year projections and summary metrics
        """
        
        current_age = user_data['age']
        retirement_age = user_data.get('retirement_age', 65)
        years_to_retirement = retirement_age - current_age
        
        # Initialize tracking variables
        projections = []
        
        # Starting values
        age = current_age
        savings = user_data['savings']
        investments = user_data['investments']
        debt = user_data['debt']
        annual_income = (user_data['monthly_income'] + user_data.get('side_income', 0)) * 12
        annual_expenses = user_data['monthly_expenses'] * 12
        
        # Get scenario parameters
        income_growth = self._get_income_growth_rate(scenario)
        investment_return = self.INVESTMENT_RETURNS[scenario]
        expense_growth = self._get_expense_growth_rate(scenario)
        
        # Year-by-year projection
        for year in range(years_to_retirement + 1):
            current_year = datetime.now().year + year
            
            # Calculate annual cash flow
            total_income = annual_income
            total_expenses = annual_expenses
            
            # Financial plan contributions (IUL, 401k, etc.)
            plan_contributions = self._calculate_plan_contributions(
                user_data.get('plans', []),
                age
            )
            
            # Available for savings/investing after expenses and plan contributions
            annual_surplus = total_income - total_expenses - plan_contributions['total']
            
            # Debt payoff (if exists)
            if debt > 0:
                debt_payment = min(debt, annual_surplus)
                debt -= debt_payment
                if debt < 0:
                    debt = 0
                annual_surplus -= debt_payment
            else:
                debt_payment = 0
            
            # Add surplus to investments
            if annual_surplus > 0:
                investments += annual_surplus
            
            # Apply investment returns
            investments *= (1 + investment_return)
            
            # Update plan cash values
            plan_values = self._calculate_plan_values(
                user_data.get('plans', []),
                age,
                year,
                scenario
            )
            
            # Calculate net worth
            total_assets = savings + investments + plan_values['total_cash_value']
            total_liabilities = debt
            net_worth = total_assets - total_liabilities
            
            # Store year projection
            projections.append({
                'year': current_year,
                'age': age,
                'annual_income': round(total_income, 2),
                'annual_expenses': round(total_expenses, 2),
                'annual_surplus': round(annual_surplus, 2),
                'debt_payment': round(debt_payment, 2),
                'savings': round(savings, 2),
                'investments': round(investments, 2),
                'plan_contributions': round(plan_contributions['total'], 2),
                'plan_cash_values': round(plan_values['total_cash_value'], 2),
                'plan_details': plan_values['details'],
                'total_assets': round(total_assets, 2),
                'total_liabilities': round(total_liabilities, 2),
                'net_worth': round(net_worth, 2),
                'debt_remaining': round(debt, 2)
            })
            
            # Apply growth rates for next year
            annual_income *= (1 + income_growth)
            annual_expenses *= (1 + expense_growth)
            age += 1
        
        # Calculate summary statistics
        summary = self._calculate_summary_stats(projections, user_data, scenario)
        
        return {
            'scenario': scenario,
            'projections': projections,
            'summary': summary
        }
    
    def _get_income_growth_rate(self, scenario: str) -> float:
        """Get income growth rate based on scenario"""
        if scenario == "best":
            return self.OPTIMISTIC_INCOME_GROWTH
        elif scenario == "worst":
            return self.PESSIMISTIC_INCOME_GROWTH
        else:
            return self.DEFAULT_INCOME_GROWTH
    
    def _get_expense_growth_rate(self, scenario: str) -> float:
        """Get expense growth rate based on scenario"""
        if scenario == "best":
            return 0.02  # Controlled spending
        elif scenario == "worst":
            return 0.04  # Inflation surge
        else:
            return self.INFLATION_RATE
    
    def _calculate_plan_contributions(
        self,
        plans: List[Dict],
        current_age: int
    ) -> Dict[str, Any]:
        """Calculate total contributions to financial plans for current year"""
        total = 0
        details = {}
        
        for plan in plans:
            # Check if still contributing
            plan_current_age = plan.get('user_current_age', current_age)
            years_since_start = current_age - plan_current_age
            
            if years_since_start < plan.get('years_to_contribute', 0):
                annual_contribution = plan.get('monthly_contribution', 0) * 12
                total += annual_contribution
                details[plan['plan_type']] = annual_contribution
        
        return {
            'total': total,
            'details': details
        }
    
    def _calculate_plan_values(
        self,
        plans: List[Dict],
        current_age: int,
        years_elapsed: int,
        scenario: str
    ) -> Dict[str, Any]:
        """Calculate cash values of financial plans"""
        
        # Plan-specific return rates
        plan_returns = {
            "predicted": {
                "Max-Funded IUL": 0.065,
                "Whole Life (IBC)": 0.045,
                "Roth IRA": 0.08,
                "Traditional 401k": 0.08,
                "Roth 401k": 0.08,
                "Solo 401k": 0.08,
                "HSA": 0.06,
                "529 Plan": 0.07,
                "Real Estate": 0.09,
                "Private Equity": 0.12,
                "CDs / Savings": 0.025,
                "Non-Qual Annuity": 0.04
            },
            "best": {
                "Max-Funded IUL": 0.075,
                "Whole Life (IBC)": 0.05,
                "Roth IRA": 0.10,
                "Traditional 401k": 0.10,
                "Roth 401k": 0.10,
                "Solo 401k": 0.10,
                "HSA": 0.08,
                "529 Plan": 0.09,
                "Real Estate": 0.12,
                "Private Equity": 0.15,
                "CDs / Savings": 0.04,
                "Non-Qual Annuity": 0.05
            },
            "worst": {
                "Max-Funded IUL": 0.04,
                "Whole Life (IBC)": 0.03,
                "Roth IRA": 0.04,
                "Traditional 401k": 0.04,
                "Roth 401k": 0.04,
                "Solo 401k": 0.04,
                "HSA": 0.03,
                "529 Plan": 0.04,
                "Real Estate": 0.05,
                "Private Equity": 0.06,
                "CDs / Savings": 0.02,
                "Non-Qual Annuity": 0.02
            }
        }
        
        total_cash_value = 0
        details = {}
        
        for plan in plans:
            plan_type = plan['plan_type']
            current_value = plan.get('cash_value', 0)
            monthly_contribution = plan.get('monthly_contribution', 0)
            
            # Get return rate for this plan and scenario
            return_rate = plan_returns[scenario].get(plan_type, 0.05)
            
            # Calculate growth over years
            value = current_value
            for year in range(years_elapsed):
                # Add contributions if still in contribution period
                plan_age_at_year = plan.get('user_current_age', current_age) + year
                if year < plan.get('years_to_contribute', 0):
                    value += monthly_contribution * 12
                
                # Apply returns (minus fees for insurance products)
                if plan_type in ["Max-Funded IUL", "Whole Life (IBC)", "Non-Qual Annuity"]:
                    fees = 0.015  # 1.5% average policy fees
                    value *= (1 + return_rate - fees)
                else:
                    value *= (1 + return_rate)
            
            total_cash_value += value
            details[plan_type] = round(value, 2)
        
        return {
            'total_cash_value': total_cash_value,
            'details': details
        }
    
    def _calculate_summary_stats(
        self,
        projections: List[Dict],
        user_data: Dict,
        scenario: str
    ) -> Dict[str, Any]:
        """Calculate summary statistics from projections"""
        
        if not projections:
            return {}
        
        first_year = projections[0]
        last_year = projections[-1]
        
        # Find debt-free date
        debt_free_year = None
        for proj in projections:
            if proj['debt_remaining'] == 0 and debt_free_year is None:
                debt_free_year = proj['year']
                debt_free_age = proj['age']
                break
        
        # Calculate total contributions over period
        total_contributed = sum(p['annual_surplus'] for p in projections if p['annual_surplus'] > 0)
        total_plan_contributions = sum(p['plan_contributions'] for p in projections)
        
        # Final values
        final_net_worth = last_year['net_worth']
        final_investments = last_year['investments']
        final_plan_values = last_year['plan_cash_values']
        
        # Calculate retirement income potential (4% rule)
        retirement_income_from_investments = final_investments * 0.04
        
        # Add income from plans (if they provide income)
        retirement_income_from_plans = 0
        for plan in user_data.get('plans', []):
            if plan.get('income_rate', 0) > 0:
                retirement_income_from_plans += plan['income_rate']
        
        total_retirement_income = retirement_income_from_investments + retirement_income_from_plans
        
        return {
            'starting_net_worth': round(first_year['net_worth'], 2),
            'ending_net_worth': round(final_net_worth, 2),
            'net_worth_growth': round(final_net_worth - first_year['net_worth'], 2),
            'debt_free_year': debt_free_year,
            'debt_free_age': debt_free_age if debt_free_year else None,
            'total_contributed': round(total_contributed, 2),
            'total_plan_contributions': round(total_plan_contributions, 2),
            'final_investments': round(final_investments, 2),
            'final_plan_values': round(final_plan_values, 2),
            'projected_annual_retirement_income': round(total_retirement_income, 2),
            'projected_monthly_retirement_income': round(total_retirement_income / 12, 2),
            'income_replacement_rate': round(
                (total_retirement_income / (user_data['monthly_income'] * 12)) * 100, 1
            ) if user_data.get('monthly_income') else 0
        }