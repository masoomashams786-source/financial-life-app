"""
Wealth Velocity Engine - CFO-Grade Professional Analysis
Based on institutional wealth management standards and real financial principles

Key Principles:
1. Net worth must be POSITIVE to calculate velocity
2. Only count VERIFIED savings (actual contributions to investment accounts)
3. Use realistic market return assumptions (7-10% long-term)
4. Handle debt, emergency fund, and lifecycle stages properly
"""

from typing import Dict, Any


class WealthVelocityEngine:
    """
    Professional wealth velocity calculator following institutional standards
    """
    
    # Standard asset allocation returns (Vanguard/Fidelity historical data)
    ASSET_RETURNS = {
        'aggressive': 0.095,    # 9.5% (80/20 stocks/bonds) - historical S&P 500 ~10%
        'moderate': 0.075,      # 7.5% (60/40 allocation)
        'conservative': 0.055,  # 5.5% (40/60 allocation)
        'cash': 0.045,          # 4.5% (HYSA current rates 2024-2026)
        'default': 0.075        # Assume balanced 60/40
    }
    
    INFLATION_RATE = 0.03  # 3% long-term average (Federal Reserve target 2%)
    
    # Realistic velocity benchmarks (based on savings rate + returns)
    BENCHMARKS = {
        "elite": 20.0,         # 40%+ savings rate + strong returns
        "excellent": 15.0,     # 30%+ savings rate
        "strong": 12.0,        # 20%+ savings rate  
        "good": 8.0,           # 15%+ savings rate
        "fair": 5.0,           # 10%+ savings rate
        "building": 3.0,       # 5%+ savings rate
        "stagnant": 0.0        # <5% savings rate
    }
    
    def calculate_wealth_velocity(
        self, 
        user_data: Dict[str, Any],
        historical_data: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Calculate wealth velocity with proper financial analysis
        
        Methodology:
        1. Determine user's financial stage (debt, building, accelerating)
        2. Calculate actual verified savings rate
        3. Estimate portfolio returns based on asset allocation
        4. Compute velocity = (returns + new savings) / beginning net worth
        5. Provide stage-appropriate insights
        """
        
        # Extract key metrics
        net_worth = user_data.get('net_worth', 0)
        total_income = user_data.get('monthly_income', 0) + user_data.get('side_income', 0)
        annual_income = total_income * 12
        
        # Determine financial stage
        stage = self._determine_financial_stage(user_data)
        
        # Calculate based on stage
        if stage['stage'] == 'debt_payoff':
            return self._generate_debt_payoff_analysis(user_data, stage)
        
        elif stage['stage'] == 'foundation':
            return self._generate_foundation_analysis(user_data, stage)
        
        else:  # acceleration stage
            return self._generate_acceleration_analysis(user_data, stage, historical_data)
    
    def _determine_financial_stage(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Determine user's financial lifecycle stage
        
        Stages:
        1. Debt Payoff: Net worth < 0 OR high-interest debt > 3 months expenses
        2. Foundation: Net worth $0-$50K, building emergency fund + baseline savings
        3. Acceleration: Net worth > $50K, wealth compounding phase
        """
        net_worth = user_data.get('net_worth', 0)
        debt = user_data.get('debt', 0)
        monthly_expenses = user_data.get('monthly_expenses', 0)
        savings = user_data.get('savings', 0)
        emergency_fund_months = (savings / monthly_expenses) if monthly_expenses > 0 else 0
        
        # Stage 1: Debt Payoff Mode
        if net_worth < 0:
            return {
                'stage': 'debt_payoff',
                'reason': 'negative_net_worth',
                'debt_amount': debt,
                'priority': 'Eliminate debt before building wealth'
            }
        
        if debt > (monthly_expenses * 3) and debt > 5000:  # Significant debt
            return {
                'stage': 'debt_payoff',
                'reason': 'high_debt_burden',
                'debt_amount': debt,
                'priority': 'Pay down high-interest debt first'
            }
        
        # Stage 2: Foundation Building
        if net_worth < 50000:
            return {
                'stage': 'foundation',
                'net_worth': net_worth,
                'emergency_fund_months': emergency_fund_months,
                'priority': 'Build emergency fund (6 months) + start investing'
            }
        
        # Stage 3: Wealth Acceleration
        return {
            'stage': 'acceleration',
            'net_worth': net_worth,
            'priority': 'Maximize investment returns + tax optimization'
        }
    
    def _generate_debt_payoff_analysis(
        self, 
        user_data: Dict[str, Any], 
        stage: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Analysis for users in debt payoff mode
        Focus: Debt elimination timeline, not wealth velocity
        """
        debt = user_data.get('debt', 0)
        monthly_income = user_data.get('monthly_income', 0) + user_data.get('side_income', 0)
        monthly_expenses = user_data.get('monthly_expenses', 0)
        monthly_plan_contributions = user_data.get('monthly_plan_contributions', 0)
        
        # Calculate debt payoff capacity
        monthly_surplus = monthly_income - monthly_expenses - monthly_plan_contributions
        
        # Assume 15% APR average for consumer debt (credit cards)
        debt_interest_rate = 0.15
        
        if monthly_surplus <= 0:
            months_to_debt_free = None
            debt_payoff_date = "Unable to pay off debt with current budget"
        else:
            # Calculate months to debt free (with interest)
            # Formula: n = -log(1 - (r*P/A)) / log(1+r) where r=monthly rate, P=principal, A=payment
            monthly_rate = debt_interest_rate / 12
            if monthly_surplus > (debt * monthly_rate):
                months_to_debt_free = round(
                    -1 * (
                        (1 - (monthly_rate * debt / monthly_surplus)) / 
                        (1 + monthly_rate)
                    ) / 12, 1
                )
            else:
                months_to_debt_free = None
                debt_payoff_date = "Payment doesn't cover interest - increase payments"
        
        return {
            "stage": "Debt Payoff Mode",
            "velocity": 0.0,  # No wealth velocity while in debt
            "real_velocity": 0.0,
            "trend": "debt_reduction",
            "momentum": "debt_focused",
            "income_velocity_ratio": 0.0,
            "percentile": 0,
            "benchmark": {
                "category": "Debt Reduction Phase",
                "description": "Focus on eliminating debt before building wealth",
                "color": "#EF4444"
            },
            "acceleration": {
                "status": "not_applicable",
                "change": 0,
                "trend": "debt_payoff_mode"
            },
            "projections": {
                "one_year": 0,
                "three_years": 0,
                "five_years": 0,
                "ten_years": 0
            },
            "metrics": {
                "monthly_wealth_gain": 0,
                "annual_wealth_gain": 0,
                "years_to_double": None,
                "velocity_vs_inflation": 0,
                "debt_amount": round(debt, 2),
                "monthly_debt_payment_capacity": round(monthly_surplus, 2),
                "months_to_debt_free": months_to_debt_free,
                "debt_free_year": None if not months_to_debt_free else 2026 + (months_to_debt_free / 12)
            },
            "stage_specific_message": f"You have ${debt:,.0f} in debt. Focus on paying this off before building wealth. With ${monthly_surplus:,.0f}/month available, you could be debt-free in {months_to_debt_free or 'N/A'} months.",
            "recommendations": [
                "Stop all non-essential investing until debt is eliminated",
                "Build a small $1,000 emergency fund first",
                f"Pay ${monthly_surplus:,.0f}/month toward highest interest debt",
                "Once debt-free, redirect payments to wealth building"
            ]
        }
    
    def _generate_foundation_analysis(
        self, 
        user_data: Dict[str, Any], 
        stage: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Analysis for users building their foundation (net worth $0-$50K)
        Focus: Dollar-based growth, not percentages
        
        FIXED: Properly handle low net worth scenarios
        - Use TOTAL ASSETS (not net worth) as the base for return calculations
        - Net worth affects percentage, but actual dollars matter more
        """
        net_worth = user_data.get('net_worth', 0)
        savings = user_data.get('savings', 0)
        investments = user_data.get('investments', 0)
        debt = user_data.get('debt', 0)
        monthly_income = user_data.get('monthly_income', 0) + user_data.get('side_income', 0)
        monthly_expenses = user_data.get('monthly_expenses', 0)
        monthly_plan_contributions = user_data.get('monthly_plan_contributions', 0)
        annual_income = monthly_income * 12
        
        # CRITICAL: Use TOTAL ASSETS for return calculation (debt doesn't reduce your returns)
        total_assets = savings + investments
        
        # Emergency fund status
        emergency_fund_target = monthly_expenses * 6
        emergency_fund_progress = (savings / emergency_fund_target * 100) if emergency_fund_target > 0 else 0
        
        # Calculate actual monthly wealth building
        monthly_verified_savings = monthly_plan_contributions
        annual_verified_savings = monthly_verified_savings * 12
        
        # Calculate expected returns on TOTAL ASSETS (not net worth)
        # Because $10K in savings earns the same whether you have debt or not
        if total_assets > 0:
            # Determine allocation
            investment_ratio = investments / total_assets if total_assets > 0 else 0.1
            cash_ratio = 1 - investment_ratio
            
            # Blended return rate
            blended_rate = (investment_ratio * self.ASSET_RETURNS['moderate'] + 
                           cash_ratio * self.ASSET_RETURNS['cash'])
            
            expected_annual_return = total_assets * blended_rate
        else:
            expected_annual_return = 0
        
        # Total annual wealth growth (returns + new savings)
        total_annual_growth = expected_annual_return + annual_verified_savings
        
        # FIXED: Calculate velocity with proper logic
        # If net worth is very low (<$5K), use alternative calculation
        if net_worth < 5000 and net_worth > 0:
            # For low net worth, focus on absolute dollar growth
            # Treat it as if you had $10K net worth to avoid crazy percentages
            normalized_base = 10000
            velocity = (total_annual_growth / normalized_base) * 100
        elif net_worth > 0:
            velocity = (total_annual_growth / net_worth) * 100
            # Cap at 50% for foundation stage (still aggressive but realistic)
            velocity = min(velocity, 50.0)
        else:
            velocity = 0.0
        
        real_velocity = velocity - self.INFLATION_RATE
        
        # Savings rate (what actually matters in foundation stage)
        savings_rate = (monthly_verified_savings / monthly_income * 100) if monthly_income > 0 else 0
        
        # Benchmark based on savings rate (more relevant than velocity)
        if savings_rate >= 20:
            benchmark_category = "Excellent Foundation Building"
            benchmark_color = "#10B981"
            percentile = 80
        elif savings_rate >= 15:
            benchmark_category = "Strong Foundation Building"
            benchmark_color = "#00D4FF"
            percentile = 70
        elif savings_rate >= 10:
            benchmark_category = "Good Foundation Building"
            benchmark_color = "#F59E0B"
            percentile = 60
        elif savings_rate >= 5:
            benchmark_category = "Fair Foundation Building"
            benchmark_color = "#F59E0B"
            percentile = 50
        else:
            benchmark_category = "Needs Improvement"
            benchmark_color = "#EF4444"
            percentile = 30
        
        # Projections based on continued contributions
        # Use ACTUAL net worth for projections (this is correct)
        projections = self._calculate_realistic_projections(
            net_worth if net_worth > 0 else 0,
            annual_verified_savings,
            blended_rate if total_assets > 0 else self.ASSET_RETURNS['default']
        )
        
        return {
            "stage": "Foundation Building",
            "velocity": round(velocity, 2),
            "real_velocity": round(real_velocity, 2),
            "trend": "up" if monthly_verified_savings > 0 else "stagnant",
            "momentum": self._get_momentum(savings_rate),
            "income_velocity_ratio": round((total_annual_growth / annual_income * 100), 2) if annual_income > 0 else 0,
            "percentile": percentile,
            "benchmark": {
                "category": benchmark_category,
                "description": f"Saving {savings_rate:.1f}% of income",
                "color": benchmark_color
            },
            "acceleration": {
                "status": "building",
                "change": 0,
                "trend": "foundation_stage"
            },
            "projections": projections,
            "metrics": {
                "monthly_wealth_gain": round(total_annual_growth / 12, 2),
                "annual_wealth_gain": round(total_annual_growth, 2),
                "years_to_double": round(72 / velocity, 1) if velocity > 0 else None,
                "velocity_vs_inflation": round(velocity - self.INFLATION_RATE, 2),
                "savings_rate": round(savings_rate, 2),
                "emergency_fund_progress": round(emergency_fund_progress, 1),
                "emergency_fund_target": round(emergency_fund_target, 2),
                "monthly_savings_amount": round(monthly_verified_savings, 2),
                # NEW: Foundation-specific metrics
                "total_assets": round(total_assets, 2),
                "net_worth": round(net_worth, 2),
                "debt_amount": round(debt, 2),
                "annual_dollar_growth": round(total_annual_growth, 2),
                "years_to_50k": round((50000 - net_worth) / total_annual_growth, 1) if total_annual_growth > 0 and net_worth < 50000 else 0
            },
            "stage_specific_message": self._get_foundation_message(
                net_worth, 
                total_annual_growth, 
                savings_rate, 
                debt,
                total_assets
            ),
            "velocity_warning": {
                "show": True,
                "message": f"⚠️ With net worth under $50K, focus on dollar amounts not percentages. You're adding ${total_annual_growth:,.0f}/year which is {benchmark_category.lower()}!"
            },
            "recommendations": self._get_foundation_recommendations(
                emergency_fund_progress, 
                savings_rate,
                monthly_verified_savings,
                debt,
                net_worth
            )
        }
    
    def _generate_acceleration_analysis(
        self, 
        user_data: Dict[str, Any], 
        stage: Dict[str, Any],
        historical_data: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Analysis for users in wealth acceleration mode (net worth > $50K)
        Focus: Velocity percentage becomes meaningful here
        """
        net_worth = user_data.get('net_worth', 0)
        savings = user_data.get('savings', 0)
        investments = user_data.get('investments', 0)
        monthly_income = user_data.get('monthly_income', 0) + user_data.get('side_income', 0)
        monthly_plan_contributions = user_data.get('monthly_plan_contributions', 0)
        annual_income = monthly_income * 12
        
        # Determine asset allocation
        total_assets = savings + investments
        investment_ratio = investments / total_assets if total_assets > 0 else 0.6
        
        # Expected return based on allocation
        if investment_ratio >= 0.8:
            expected_return_rate = self.ASSET_RETURNS['aggressive']
        elif investment_ratio >= 0.5:
            expected_return_rate = self.ASSET_RETURNS['moderate']
        else:
            expected_return_rate = self.ASSET_RETURNS['conservative']
        
        # Calculate growth components
        expected_investment_returns = total_assets * expected_return_rate
        annual_new_contributions = monthly_plan_contributions * 12
        total_annual_growth = expected_investment_returns + annual_new_contributions
        
        # Velocity calculation
        velocity = (total_annual_growth / net_worth * 100) if net_worth > 0 else 0
        velocity = min(velocity, 30.0)  # Cap at 30% (unrealistic beyond this)
        
        real_velocity = velocity - self.INFLATION_RATE
        
        # Benchmark
        benchmark = self._get_benchmark_category(velocity)
        percentile = self._calculate_percentile(velocity)
        
        # Savings rate
        savings_rate = (monthly_plan_contributions / monthly_income * 100) if monthly_income > 0 else 0
        
        # Projections
        projections = self._calculate_realistic_projections(
            net_worth,
            annual_new_contributions,
            expected_return_rate
        )
        
        # Acceleration (if historical data available)
        if historical_data and 'velocity_6mo_ago' in historical_data:
            velocity_change = velocity - historical_data['velocity_6mo_ago']
            if velocity_change > 2:
                accel_status = "accelerating"
                accel_trend = "improving"
            elif velocity_change < -2:
                accel_status = "decelerating"
                accel_trend = "declining"
            else:
                accel_status = "stable"
                accel_trend = "steady"
        else:
            accel_status = "unknown"
            accel_trend = "insufficient_data"
            velocity_change = 0
        
        return {
            "stage": "Wealth Acceleration",
            "velocity": round(velocity, 2),
            "real_velocity": round(real_velocity, 2),
            "trend": "up" if velocity > 0 else "stagnant",
            "momentum": self._get_momentum(savings_rate),
            "income_velocity_ratio": round((total_annual_growth / annual_income * 100), 2) if annual_income > 0 else 0,
            "percentile": percentile,
            "benchmark": benchmark,
            "acceleration": {
                "status": accel_status,
                "change": round(velocity_change, 2),
                "trend": accel_trend
            },
            "projections": projections,
            "metrics": {
                "monthly_wealth_gain": round(total_annual_growth / 12, 2),
                "annual_wealth_gain": round(total_annual_growth, 2),
                "years_to_double": round(72 / velocity, 1) if velocity > 0 else None,
                "velocity_vs_inflation": round(real_velocity, 2),
                "expected_return_rate": round(expected_return_rate * 100, 2),
                "investment_allocation": round(investment_ratio * 100, 1)
            },
            "stage_specific_message": f"You're in wealth acceleration mode with ${net_worth:,.0f}. Your portfolio is growing at {velocity:.1f}% annually.",
            "recommendations": [
                f"Continue ${monthly_plan_contributions:,.0f}/month contributions",
                f"Your {investment_ratio*100:.0f}% equity allocation is generating {expected_return_rate*100:.1f}% expected returns",
                "Consider tax-loss harvesting and Roth conversions",
                "Review asset allocation annually"
            ]
        }
    
    def _calculate_realistic_projections(
        self,
        current_net_worth: float,
        annual_contribution: float,
        expected_return: float
    ) -> Dict[str, float]:
        """
        Calculate realistic future value projections
        FV = PV(1+r)^n + PMT * [((1+r)^n - 1) / r]
        """
        results = {}
        
        for years, label in [(1, "one_year"), (3, "three_years"), (5, "five_years"), (10, "ten_years")]:
            # Future value of current assets
            fv_current = current_net_worth * ((1 + expected_return) ** years)
            
            # Future value of annual contributions (ordinary annuity)
            if expected_return > 0:
                fv_contributions = annual_contribution * (((1 + expected_return) ** years - 1) / expected_return)
            else:
                fv_contributions = annual_contribution * years
            
            total_fv = fv_current + fv_contributions
            results[label] = round(total_fv, 2)
        
        return results
    
    def _get_momentum(self, savings_rate: float) -> str:
        """Determine momentum based on savings rate"""
        if savings_rate >= 40:
            return "explosive"
        elif savings_rate >= 25:
            return "strong"
        elif savings_rate >= 15:
            return "moderate"
        elif savings_rate >= 5:
            return "weak"
        else:
            return "stagnant"
    
    def _calculate_percentile(self, velocity: float) -> int:
        """Estimate percentile based on velocity"""
        if velocity >= 20:
            return 95
        elif velocity >= 15:
            return 90
        elif velocity >= 12:
            return 80
        elif velocity >= 10:
            return 70
        elif velocity >= 8:
            return 60
        elif velocity >= 5:
            return 50
        else:
            return 40
    
    def _get_benchmark_category(self, velocity: float) -> Dict[str, str]:
        """Get benchmark category"""
        if velocity >= self.BENCHMARKS["elite"]:
            return {
                "category": "Elite Wealth Builder",
                "description": "Top 5% wealth accumulation rate",
                "color": "#10B981"
            }
        elif velocity >= self.BENCHMARKS["excellent"]:
            return {
                "category": "Excellent",
                "description": "Top 10% wealth accumulation rate",
                "color": "#10B981"
            }
        elif velocity >= self.BENCHMARKS["strong"]:
            return {
                "category": "Strong",
                "description": "Top 20% wealth accumulation rate",
                "color": "#00D4FF"
            }
        elif velocity >= self.BENCHMARKS["good"]:
            return {
                "category": "Good",
                "description": "Above average wealth building",
                "color": "#F59E0B"
            }
        elif velocity >= self.BENCHMARKS["fair"]:
            return {
                "category": "Fair",
                "description": "Moderate wealth building",
                "color": "#F59E0B"
            }
        else:
            return {
                "category": "Needs Improvement",
                "description": "Below average wealth building",
                "color": "#EF4444"
            }
    
    def _get_foundation_message(
        self,
        net_worth: float,
        annual_growth: float,
        savings_rate: float,
        debt: float,
        total_assets: float
    ) -> str:
        """Generate contextual message for foundation stage"""
        
        if debt > 0 and net_worth < 5000:
            return (
                f"You have ${total_assets:,.0f} in assets but ${debt:,.0f} in debt (net worth: ${net_worth:,.0f}). "
                f"You're saving ${annual_growth:,.0f}/year ({savings_rate:.1f}% rate). "
                f"Consider paying off debt faster to accelerate wealth building."
            )
        elif net_worth < 5000:
            return (
                f"You're in early foundation building with ${net_worth:,.0f} net worth. "
                f"You're adding ${annual_growth:,.0f}/year ({savings_rate:.1f}% savings rate) - "
                f"keep this up and you'll hit $50K in ~{(50000 - net_worth) / annual_growth:.1f} years!"
            )
        else:
            return (
                f"You're building your foundation with ${net_worth:,.0f} in net worth. "
                f"You're saving ${annual_growth:,.0f}/year ({savings_rate:.1f}% savings rate). "
                f"At this pace, you'll reach wealth acceleration stage ($50K+) soon!"
            )
    
    def _get_foundation_recommendations(
        self, 
        ef_progress: float, 
        savings_rate: float,
        monthly_savings: float,
        debt: float = 0,
        net_worth: float = 0
    ) -> list:
        """Generate stage-appropriate recommendations"""
        recs = []
        
        # Debt-specific recommendations
        if debt > 0:
            if debt > monthly_savings * 12:
                recs.append(f"⚠️ High debt: Consider allocating extra funds to pay off ${debt:,.0f} faster")
            else:
                recs.append(f"✓ Manageable debt level - maintain current payoff plan")
        
        # Emergency fund
        if ef_progress < 100:
            recs.append(f" Priority: Complete emergency fund ({ef_progress:.0f}% funded)")
        else:
            recs.append(f"✓ Emergency fund fully funded - excellent!")
        
        # Savings rate optimization
        if savings_rate < 10:
            recs.append(f" Increase savings rate to 10%+ (currently {savings_rate:.1f}%)")
        elif savings_rate < 15:
            recs.append(f" Increase savings rate to 15%+ for faster wealth building (currently {savings_rate:.1f}%)")
        elif savings_rate >= 20:
            recs.append(f" Excellent {savings_rate:.1f}% savings rate - you're in top 20%!")
        
        # Investment recommendations
        if monthly_savings == 0:
            recs.append("Start with at least $100/month to retirement accounts")
        elif monthly_savings < 500:
            recs.append(f" Consider increasing retirement contributions beyond ${monthly_savings:,.0f}/month")
        
        # Tax-advantaged accounts
        recs.append(" Maximize Roth IRA contributions if income qualified")
        recs.append(" Ensure you're capturing full employer 401k match")
        
        # Milestone tracking
        if net_worth < 10000:
            recs.append(f" Next milestone: $10,000 net worth (currently ${net_worth:,.0f})")
        elif net_worth < 25000:
            recs.append(f"Next milestone: $25,000 net worth (currently ${net_worth:,.0f})")
        elif net_worth < 50000:
            recs.append(f" Next milestone: $50,000 net worth to reach acceleration stage (currently ${net_worth:,.0f})")
        
        return recs