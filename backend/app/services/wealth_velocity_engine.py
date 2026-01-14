"""
Wealth Velocity Engine
Calculates wealth accumulation velocity and momentum indicators
Based on institutional wealth management standards
"""

from typing import Dict, Any
from datetime import datetime, timedelta


class WealthVelocityEngine:
    """
    Professional wealth velocity calculator
    Measures how fast wealth is accumulating relative to income and time
    """
    BENCHMARKS = {
        "elite": 15.0,      # Top 5% wealth builders
        "excellent": 12.0,  # Top 10% wealth builders
        "strong": 8.0,      # Top 25% wealth builders
        "good": 5.0,        # Above median
        "fair": 3.0,        # At/below median
        "poor": 0.0         # Stagnating
    }
    
    def __init__(self):
        self.inflation_rate = 0.03  # 3% historical average
    
    def calculate_wealth_velocity(
        self, 
        user_data: Dict[str, Any],
        historical_data: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Calculate wealth velocity score and detailed metrics
        
        Args:
            user_data: Current financial snapshot
            historical_data: Past snapshots (if available)
            
        Returns:
            Complete wealth velocity analysis
        """
        
        # Current metrics
        current_net_worth = user_data.get('net_worth', 0)
        monthly_income = user_data.get('monthly_income', 0) + user_data.get('side_income', 0)
        annual_income = monthly_income * 12
        
        # Calculate velocity based on available data
        if historical_data and 'net_worth_6mo_ago' in historical_data:
            velocity = self._calculate_historical_velocity(
                current_net_worth,
                historical_data['net_worth_6mo_ago'],
                months=6
            )
        else:
            # Estimate velocity from current savings behavior
            velocity = self._estimate_velocity_from_current_data(user_data)
        
        # Adjust for inflation (real vs nominal growth)
        real_velocity = velocity - self.inflation_rate
        
        # Calculate momentum indicators
        momentum = self._calculate_momentum(user_data)
        
        # Income velocity ratio (wealth growth vs income)
        income_velocity_ratio = self._calculate_income_velocity_ratio(
            velocity,
            annual_income,
            current_net_worth
        )
        
        # Percentile ranking
        percentile = self._calculate_percentile(velocity)
        benchmark = self._get_benchmark_category(velocity)
        
        # Projection metrics
        projection = self._calculate_projections(
            current_net_worth,
            velocity,
            annual_income
        )
        
        # Wealth acceleration (is velocity increasing or decreasing)
        acceleration = self._calculate_acceleration(user_data, historical_data)
        
        return {
            "velocity": round(velocity, 2),
            "real_velocity": round(real_velocity, 2),
            "trend": "up" if velocity > 0 else "down",
            "momentum": momentum,
            "income_velocity_ratio": round(income_velocity_ratio, 2),
            "percentile": percentile,
            "benchmark": benchmark,
            "acceleration": acceleration,
            "projections": projection,
            "metrics": {
                "monthly_wealth_gain": round((current_net_worth * velocity / 100) / 12, 2),
                "annual_wealth_gain": round(current_net_worth * velocity / 100, 2),
                "years_to_double": round(72 / velocity, 1) if velocity > 0 else None,
                "velocity_vs_inflation": round(velocity - self.inflation_rate, 2)
            }
        }
    
    def _calculate_historical_velocity(
        self,
        current_nw: float,
        past_nw: float,
        months: int
    ) -> float:
        """Calculate velocity from historical data"""
        if past_nw == 0:
            return 0
        
        # Period growth rate
        period_growth = ((current_nw - past_nw) / past_nw) * 100
        
        # Annualize
        annual_velocity = period_growth * (12 / months)
        
        return annual_velocity
    
    def _estimate_velocity_from_current_data(self, user_data: Dict[str, Any]) -> float:
        """
        Estimate velocity when historical data unavailable
        Based on current savings rate and asset allocation
        """
        net_worth = user_data.get('net_worth', 0)
        monthly_income = user_data.get('monthly_income', 0) + user_data.get('side_income', 0)
        monthly_expenses = user_data.get('monthly_expenses', 0)
        savings = user_data.get('savings', 0)
        investments = user_data.get('investments', 0)
        
        if net_worth == 0 or monthly_income == 0:
            return 0
        
        # Calculate monthly surplus
        monthly_surplus = monthly_income - monthly_expenses
        
        # Estimate annual contribution
        annual_contribution = monthly_surplus * 12
        
        # Estimate return on existing assets (conservative 6% for mixed portfolio)
        existing_asset_growth = (savings + investments) * 0.06
        
        # Total estimated annual growth
        total_growth = annual_contribution + existing_asset_growth
        
        # Velocity = growth / net worth
        velocity = (total_growth / net_worth) * 100 if net_worth > 0 else 0
        
        return velocity
    
    def _calculate_momentum(self, user_data: Dict[str, Any]) -> str:
        """
        Calculate wealth building momentum
        Based on savings rate and asset allocation
        """
        savings_rate = user_data.get('savings_rate', 0)
        
        if savings_rate >= 0.40:
            return "explosive"
        elif savings_rate >= 0.25:
            return "strong"
        elif savings_rate >= 0.15:
            return "moderate"
        elif savings_rate >= 0.05:
            return "weak"
        else:
            return "stagnant"
    
    def _calculate_income_velocity_ratio(
        self,
        velocity: float,
        annual_income: float,
        net_worth: float
    ) -> float:
        """
        Ratio of wealth growth to income
        High ratio = wealth growing faster than income alone
        """
        if annual_income == 0:
            return 0
        
        annual_wealth_gain = net_worth * (velocity / 100)
        ratio = (annual_wealth_gain / annual_income) * 100
        
        return ratio
    
    def _calculate_percentile(self, velocity: float) -> int:
        """Estimate percentile based on velocity"""
        if velocity >= 15:
            return 95
        elif velocity >= 12:
            return 90
        elif velocity >= 8:
            return 75
        elif velocity >= 5:
            return 60
        elif velocity >= 3:
            return 50
        elif velocity >= 0:
            return 40
        else:
            return 25
    
    def _get_benchmark_category(self, velocity: float) -> Dict[str, str]:
        """Get benchmark category and description"""
        if velocity >= self.BENCHMARKS["elite"]:
            return {
                "category": "Elite",
                "description": "Top 5% of wealth builders",
                "color": "#10B981"
            }
        elif velocity >= self.BENCHMARKS["excellent"]:
            return {
                "category": "Excellent",
                "description": "Top 10% of wealth builders",
                "color": "#10B981"
            }
        elif velocity >= self.BENCHMARKS["strong"]:
            return {
                "category": "Strong",
                "description": "Top 25% of wealth builders",
                "color": "#00D4FF"
            }
        elif velocity >= self.BENCHMARKS["good"]:
            return {
                "category": "Good",
                "description": "Above median performance",
                "color": "#F59E0B"
            }
        elif velocity >= self.BENCHMARKS["fair"]:
            return {
                "category": "Fair",
                "description": "At/below median",
                "color": "#F59E0B"
            }
        else:
            return {
                "category": "Needs Improvement",
                "description": "Wealth stagnating",
                "color": "#EF4444"
            }
    
    def _calculate_projections(
        self,
        current_nw: float,
        velocity: float,
        annual_income: float
    ) -> Dict[str, Any]:
        """Project future wealth at current velocity"""
        if velocity <= 0:
            return {
                "one_year": current_nw,
                "three_years": current_nw,
                "five_years": current_nw,
                "ten_years": current_nw
            }
        
        # Compound growth formula: FV = PV * (1 + r)^n
        rate = velocity / 100
        
        return {
            "one_year": round(current_nw * (1 + rate), 2),
            "three_years": round(current_nw * ((1 + rate) ** 3), 2),
            "five_years": round(current_nw * ((1 + rate) ** 5), 2),
            "ten_years": round(current_nw * ((1 + rate) ** 10), 2)
        }
    
    def _calculate_acceleration(
        self,
        user_data: Dict[str, Any],
        historical_data: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Calculate if wealth velocity is accelerating or decelerating
        """
        if not historical_data or 'velocity_3mo_ago' not in historical_data:
            return {
                "status": "unknown",
                "change": 0,
                "trend": "insufficient data"
            }
        
        current_velocity = self._estimate_velocity_from_current_data(user_data)
        past_velocity = historical_data['velocity_3mo_ago']
        
        change = current_velocity - past_velocity
        
        if change > 1:
            status = "accelerating"
        elif change < -1:
            status = "decelerating"
        else:
            status = "stable"
        
        return {
            "status": status,
            "change": round(change, 2),
            "trend": "improving" if change > 0 else "declining" if change < 0 else "steady"
        }