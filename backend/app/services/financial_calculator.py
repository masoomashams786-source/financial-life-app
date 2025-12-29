"""
Financial Calculator Service
Calculates projections for different financial vehicles
"""

class FinancialCalculator:
    
    # Average assumptions for each vehicle type
    VEHICLE_ASSUMPTIONS = {
        "Max-Funded IUL": {
            "avg_return": 0.065,  # 6.5%
            "policy_cost": 0.015,  # 1.5% policy fees
            "tax_advantage": True,
            "volatility": 0.02,  # 2% volatility
        },
        "Whole Life (IBC)": {
            "avg_return": 0.045,  # 4.5%
            "policy_cost": 0.02,  # 2% policy fees
            "tax_advantage": True,
            "volatility": 0.0,  # No volatility (guaranteed)
        },
        "Roth IRA": {
            "avg_return": 0.08,  # 8%
            "policy_cost": 0.0,
            "tax_advantage": True,
            "volatility": 0.15,  # 15% volatility
        },
        "Traditional 401k": {
            "avg_return": 0.08,  # 8%
            "policy_cost": 0.0,
            "tax_advantage": False,  # Taxed on withdrawal
            "volatility": 0.15,
        },
        "Roth 401k": {
            "avg_return": 0.08,
            "policy_cost": 0.0,
            "tax_advantage": True,
            "volatility": 0.15,
        },
        "Solo 401k": {
            "avg_return": 0.08,
            "policy_cost": 0.0,
            "tax_advantage": False,
            "volatility": 0.15,
        },
        "HSA": {
            "avg_return": 0.06,
            "policy_cost": 0.0,
            "tax_advantage": True,
            "volatility": 0.10,
        },
        "529 Plan": {
            "avg_return": 0.07,
            "policy_cost": 0.0,
            "tax_advantage": True,
            "volatility": 0.12,
        },
        "Real Estate": {
            "avg_return": 0.09,
            "policy_cost": 0.03,  # Maintenance, taxes
            "tax_advantage": False,
            "volatility": 0.10,
        },
        "Private Equity": {
            "avg_return": 0.12,
            "policy_cost": 0.02,
            "tax_advantage": False,
            "volatility": 0.25,
        },
        "CDs / Savings": {
            "avg_return": 0.025,
            "policy_cost": 0.0,
            "tax_advantage": False,
            "volatility": 0.0,
        },
        "Non-Qual Annuity": {
            "avg_return": 0.04,
            "policy_cost": 0.015,
            "tax_advantage": False,
            "volatility": 0.0,
        },
    }
    
    def __init__(self, tax_rate=0.25, inflation_rate=0.03):
        self.tax_rate = tax_rate
        self.inflation_rate = inflation_rate
    
    def calculate_projection(
        self,
        plan_type: str,
        current_age: int,
        monthly_contribution: float,
        years_to_contribute: int,
        income_start_age: int,
        income_end_age: int,
        current_value: float = 0.0
    ):
        """
        Calculate best, average, worst case scenarios
        """
        assumptions = self.VEHICLE_ASSUMPTIONS.get(plan_type)
        if not assumptions:
            raise ValueError(f"Unknown plan type: {plan_type}")
        
        # Base calculations
        avg_return = assumptions["avg_return"]
        policy_cost = assumptions["policy_cost"]
        volatility = assumptions["volatility"]
        tax_advantage = assumptions["tax_advantage"]
        
        # Calculate scenarios
        best_case = self._calculate_scenario(
            current_value,
            monthly_contribution,
            years_to_contribute,
            income_start_age - current_age,
            income_end_age - income_start_age,
            avg_return + volatility,
            policy_cost,
            tax_advantage
        )
        
        average_case = self._calculate_scenario(
            current_value,
            monthly_contribution,
            years_to_contribute,
            income_start_age - current_age,
            income_end_age - income_start_age,
            avg_return,
            policy_cost,
            tax_advantage
        )
        
        worst_case = self._calculate_scenario(
            current_value,
            monthly_contribution,
            years_to_contribute,
            income_start_age - current_age,
            income_end_age - income_start_age,
            max(avg_return - volatility, 0.01),  # At least 1%
            policy_cost,
            tax_advantage
        )
        
        return {
            "plan_type": plan_type,
            "best_case": best_case,
            "average_case": average_case,
            "worst_case": worst_case
        }
    
    def _calculate_scenario(
        self,
        current_value: float,
        monthly_contribution: float,
        years_to_contribute: int,
        years_until_income: int,
        years_of_income: int,
        rate_of_return: float,
        policy_cost: float,
        tax_advantage: bool
    ):
        """Calculate single scenario"""
        
        # Phase 1: Accumulation (contributing)
        balance = current_value
        total_contributed = 0
        
        for year in range(years_to_contribute):
            annual_contribution = monthly_contribution * 12
            total_contributed += annual_contribution
            balance += annual_contribution
            
            # Apply returns and costs
            net_return = rate_of_return - policy_cost - self.inflation_rate
            balance *= (1 + net_return)
        
        # Phase 2: Growth (not contributing, before income)
        years_growth = years_until_income - years_to_contribute
        for year in range(max(0, years_growth)):
            net_return = rate_of_return - policy_cost - self.inflation_rate
            balance *= (1 + net_return)
        
        cash_value_at_income = balance
        
        # Phase 3: Income distribution
        annual_income_before_tax = balance / years_of_income if years_of_income > 0 else 0
        
        if tax_advantage:
            annual_income_after_tax = annual_income_before_tax
        else:
            annual_income_after_tax = annual_income_before_tax * (1 - self.tax_rate)
        
        return {
            "total_contributed": round(total_contributed, 2),
            "cash_value": round(cash_value_at_income, 2),
            "annual_income_before_tax": round(annual_income_before_tax, 2),
            "annual_income_after_tax": round(annual_income_after_tax, 2)
        }