"""
Multi-Year Financial Projection Engine
Calculates year-by-year net worth, cash flow, and milestones
Follows US financial planning standards and real cash flow behavior
"""

from typing import Dict, List, Any
from datetime import datetime


class ProjectionEngine:
    """
    Generates detailed financial projections over 30+ years
    Tracks net worth, assets, liabilities, cash flow year by year
    Following realistic US financial planning principles
    """
    
    def __init__(self):
        # US Market Historical Averages
        self.INFLATION_RATE = 0.03  # 3% historical average
        self.SAVINGS_ACCOUNT_RATE = 0.005  # 0.5% HYSA (realistic post-2023)
        self.DEFAULT_DEBT_INTEREST = 0.18  # 18% average credit card rate
        
        # Income growth rates
        self.DEFAULT_INCOME_GROWTH = 0.03  # 3% annual raise
        self.OPTIMISTIC_INCOME_GROWTH = 0.05  # Promotions, career advancement
        self.PESSIMISTIC_INCOME_GROWTH = 0.01  # Stagnant economy
        
        # Investment return assumptions (only if investments exist)
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
        
        Following US financial planning waterfall:
        1. Pay mandatory expenses
        2. Pay minimum debt payments
        3. Contribute to employer-matched plans (free money!)
        4. Pay down high-interest debt
        5. Build emergency fund (3-6 months expenses)
        6. Max out tax-advantaged accounts
        7. Invest surplus in taxable accounts
        """
        
        current_age = user_data['age']
        retirement_age = user_data.get('retirement_age', 65)
        years_to_retirement = retirement_age - current_age
        
        # Initialize tracking variables
        projections = []
        
        # Starting values
        age = current_age
        savings = user_data['savings']  # Liquid cash (checking/savings)
        investments = user_data['investments']  # Brokerage/taxable investments
        debt = user_data['debt']
        debt_interest_rate = user_data.get('debt_interest_rate', self.DEFAULT_DEBT_INTEREST)
        
        annual_income = (user_data['monthly_income'] + user_data.get('side_income', 0)) * 12
        annual_expenses = user_data['monthly_expenses'] * 12
        
        # Get scenario parameters
        income_growth = self._get_income_growth_rate(scenario)
        investment_return = self.INVESTMENT_RETURNS[scenario]
        expense_growth = self._get_expense_growth_rate(scenario)
        
        # Emergency fund target (6 months expenses - US standard)
        emergency_fund_target = annual_expenses / 2
        
        # Year-by-year projection
        for year in range(years_to_retirement + 1):
            current_year = datetime.now().year + year
            
            # Calculate annual cash flow
            total_income = annual_income
            total_expenses = annual_expenses
            
            # Financial plan contributions (401k, IRA, IUL, etc.)
            plan_contributions_data = self._calculate_plan_contributions(
                user_data.get('plans', []),
                age
            )
            plan_contributions = plan_contributions_data['total']
            employer_match = plan_contributions_data['employer_match']
            
            # Calculate available surplus AFTER mandatory expenses and plan contributions
            annual_surplus = total_income - total_expenses - plan_contributions
            
            # --- DEBT MANAGEMENT (US Standard: High priority) ---
            debt_payment = 0
            if debt > 0:
                # Debt grows with interest first
                debt *= (1 + debt_interest_rate)
                
                # Strategy: Pay as much as possible while keeping emergency fund
                if savings > emergency_fund_target:
                    # Use excess savings to pay down debt aggressively
                    available_for_debt = annual_surplus + (savings - emergency_fund_target)
                    debt_payment = min(debt, available_for_debt)
                else:
                    # Only use surplus for debt, protect emergency fund
                    debt_payment = min(debt, max(0, annual_surplus))
                
                debt -= debt_payment
                annual_surplus -= debt_payment
                
                if debt < 0:
                    annual_surplus += abs(debt)  # Refund overpayment
                    debt = 0
            
            # --- SAVINGS & EMERGENCY FUND (Build before investing) ---
            if savings < emergency_fund_target and annual_surplus > 0:
                # Priority: Build emergency fund to 6 months expenses
                needed_for_emergency = emergency_fund_target - savings
                emergency_fund_contribution = min(annual_surplus, needed_for_emergency)
                savings += emergency_fund_contribution
                annual_surplus -= emergency_fund_contribution
            else:
                # Savings account grows at HYSA rate
                savings *= (1 + self.SAVINGS_ACCOUNT_RATE)
            
            # --- INVESTMENTS (Only if surplus exists AND emergency fund is met) ---
            # This is the KEY FIX: Don't assume investments grow without actual investment accounts
            if investments > 0:
                # Existing investments grow with market returns
                investments *= (1 + investment_return)
            
            # Add surplus to investments ONLY if:
            # 1. No high-interest debt remaining (> 7%)
            # 2. Emergency fund is fully funded
            # 3. There's actual surplus left
            if annual_surplus > 0 and debt == 0 and savings >= emergency_fund_target:
                investments += annual_surplus
                annual_surplus = 0
            elif annual_surplus > 0:
                # If emergency fund met but debt remains, add to savings
                savings += annual_surplus
                annual_surplus = 0
            
            # --- FINANCIAL PLANS (401k, IRA, IUL) - Grow separately ---
            plan_values = self._calculate_plan_values(
                user_data.get('plans', []),
                age,
                year,
                scenario
            )
            
            # --- NET WORTH CALCULATION (US Standard) ---
            # Assets = Liquid + Investments + Retirement Accounts
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
                'plan_contributions': round(plan_contributions, 2),
                'employer_match': round(employer_match, 2),
                'plan_cash_values': round(plan_values['total_cash_value'], 2),
                'plan_details': plan_values['details'],
                'total_assets': round(total_assets, 2),
                'total_liabilities': round(total_liabilities, 2),
                'net_worth': round(net_worth, 2),
                'debt_remaining': round(debt, 2),
                'emergency_fund_status': 'Fully Funded' if savings >= emergency_fund_target else f'{(savings/emergency_fund_target)*100:.0f}% Funded'
            })
            
            # Apply growth rates for next year
            annual_income *= (1 + income_growth)
            annual_expenses *= (1 + expense_growth)
            emergency_fund_target = (annual_expenses / 2)  # Adjust target with expenses
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
        """
        Calculate total contributions to financial plans for current year
        INCLUDES EMPLOYER MATCH (free money!)
        """
        total_employee = 0
        total_employer_match = 0
        details = {}
        
        for plan in plans:
            # Check if still contributing
            plan_current_age = plan.get('user_current_age', current_age)
            years_since_start = current_age - plan_current_age
            
            if years_since_start >= plan.get('years_to_contribute', 0):
                continue  # No longer contributing to this plan
            
            # Employee contribution
            monthly_contribution = plan.get('monthly_contribution', 0)
            annual_contribution = monthly_contribution * 12
            total_employee += annual_contribution
            
            # Employer match (401k plans only)
            plan_type = plan.get('plan_type', '')
            if plan.get('employer_match_enabled') and plan_type in ['Traditional 401k', 'Roth 401k', 'Solo 401k']:
                annual_salary = plan.get('user_annual_salary', 0)
                match_percentage = plan.get('employer_match_percentage', 0)
                match_cap = plan.get('employer_match_cap', 0)
                
                if annual_salary > 0:
                    employee_contribution_rate = annual_contribution / annual_salary
                    matched_rate = min(employee_contribution_rate, match_cap)
                    employer_match = annual_salary * matched_rate * match_percentage
                    total_employer_match += employer_match
            
            details[plan['plan_type']] = {
                'employee': annual_contribution,
                'employer': total_employer_match
            }
        
        return {
            'total': total_employee,  # What comes out of paycheck
            'employer_match': total_employer_match,  # Free money from employer
            'details': details
        }
    
    def _calculate_plan_values(
        self,
        plans: List[Dict],
        current_age: int,
        years_elapsed: int,
        scenario: str
    ) -> Dict[str, Any]:
        """
        Calculate cash values of financial plans
        Includes employer match in growth calculations
        """
        
        # Plan-specific return rates (US market historical averages)
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
                "Max-Funded IUL": 0.085,
                "Whole Life (IBC)": 0.055,
                "Roth IRA": 0.12,
                "Traditional 401k": 0.12,
                "Roth 401k": 0.12,
                "Solo 401k": 0.12,
                "HSA": 0.09,
                "529 Plan": 0.10,
                "Real Estate": 0.15,
                "Private Equity": 0.18,
                "CDs / Savings": 0.04,
                "Non-Qual Annuity": 0.06
            },
            "worst": {
                "Max-Funded IUL": 0.03,
                "Whole Life (IBC)": 0.025,
                "Roth IRA": 0.02,
                "Traditional 401k": 0.02,
                "Roth 401k": 0.02,
                "Solo 401k": 0.02,
                "HSA": 0.02,
                "529 Plan": 0.03,
                "Real Estate": 0.04,
                "Private Equity": 0.05,
                "CDs / Savings": 0.015,
                "Non-Qual Annuity": 0.02
            }
        }
        
        total_cash_value = 0
        details = {}
        
        for plan in plans:
            plan_type = plan['plan_type']
            current_value = plan.get('cash_value', 0)
            monthly_contribution = plan.get('monthly_contribution', 0)
            annual_contribution = monthly_contribution * 12
            
            # Calculate employer match
            employer_match_annual = 0
            if plan.get('employer_match_enabled') and plan_type in ['Traditional 401k', 'Roth 401k', 'Solo 401k']:
                annual_salary = plan.get('user_annual_salary', 0)
                match_percentage = plan.get('employer_match_percentage', 0)
                match_cap = plan.get('employer_match_cap', 0)
                
                if annual_salary > 0:
                    employee_rate = annual_contribution / annual_salary
                    matched_rate = min(employee_rate, match_cap)
                    employer_match_annual = annual_salary * matched_rate * match_percentage
            
            # Total annual contribution (employee + employer)
            total_annual_contribution = annual_contribution + employer_match_annual
            
            # Get return rate for this plan and scenario
            return_rate = plan_returns[scenario].get(plan_type, 0.05)
            
            # Calculate growth over years
            value = current_value
            for year in range(years_elapsed):
                # Add contributions if still in contribution period
                if year < plan.get('years_to_contribute', 0):
                    value += total_annual_contribution
                
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
        debt_free_age = None
        for proj in projections:
            if proj['debt_remaining'] == 0 and debt_free_year is None:
                debt_free_year = proj['year']
                debt_free_age = proj['age']
                break
        
        # Calculate total contributions over period
        total_contributed = sum(p['plan_contributions'] for p in projections)
        total_employer_match = sum(p.get('employer_match', 0) for p in projections)
        total_debt_paid = sum(p['debt_payment'] for p in projections)
        
        # Final values
        final_net_worth = last_year['net_worth']
        final_savings = last_year['savings']
        final_investments = last_year['investments']
        final_plan_values = last_year['plan_cash_values']
        
        # Calculate retirement income potential (4% rule - US standard)
        retirement_income_from_investments = final_investments * 0.04
        retirement_income_from_plans = final_plan_values * 0.04  # Assume 4% withdrawal from retirement accounts
        
        # Add specific income from plans that provide income streams
        for plan in user_data.get('plans', []):
            if plan.get('income_rate', 0) > 0:
                retirement_income_from_plans += plan['income_rate']
        
        total_retirement_income = retirement_income_from_investments + retirement_income_from_plans
        
        return {
            'starting_net_worth': round(first_year['net_worth'], 2),
            'ending_net_worth': round(final_net_worth, 2),
            'net_worth_growth': round(final_net_worth - first_year['net_worth'], 2),
            'debt_free_year': debt_free_year,
            'debt_free_age': debt_free_age,
            'total_employee_contributions': round(total_contributed, 2),
            'total_employer_match': round(total_employer_match, 2),
            'total_debt_paid': round(total_debt_paid, 2),
            'final_savings': round(final_savings, 2),
            'final_investments': round(final_investments, 2),
            'final_plan_values': round(final_plan_values, 2),
            'projected_annual_retirement_income': round(total_retirement_income, 2),
            'projected_monthly_retirement_income': round(total_retirement_income / 12, 2),
            'income_replacement_rate': round(
                (total_retirement_income / (user_data['monthly_income'] * 12)) * 100, 1
            ) if user_data.get('monthly_income') else 0
        }