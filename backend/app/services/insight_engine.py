"""
Financial Insight Engine
Generates health scores, strengths, vulnerabilities, and recommendations
Pure algorithmic analysis -
"""

from typing import Dict, List, Any


class InsightEngine:
    """
    Analyzes financial profile and generates actionable insights
    """
    
    def __init__(self):
        # National benchmarks by age group (Federal Reserve data)
        self.BENCHMARKS = {
            "25-34": {
                "median_net_worth": 14000,
                "median_income": 65000,
                "median_savings_rate": 0.05,
                "top_10_savings_rate": 0.20
            },
            "35-44": {
                "median_net_worth": 91000,
                "median_income": 80000,
                "median_savings_rate": 0.08,
                "top_10_savings_rate": 0.25
            },
            "45-54": {
                "median_net_worth": 168000,
                "median_income": 85000,
                "median_savings_rate": 0.12,
                "top_10_savings_rate": 0.30
            }
        }
    
    def analyze_financial_profile(
        self,
        user_data: Dict[str, Any],
        projections: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Complete financial analysis
        
        Args:
            user_data: Financial snapshot and plans
            projections: Optional projection data
            
        Returns:
            Complete analysis with score, insights, actions
        """
        
        # Calculate core metrics
        metrics = self._calculate_core_metrics(user_data)
        
        # Financial health score
        health_score = self._calculate_health_score(metrics)
        
        # Identify strengths
        strengths = self._identify_strengths(metrics, user_data)
        
        # Identify vulnerabilities
        vulnerabilities = self._identify_vulnerabilities(metrics, user_data)
        
        # Generate action plans
        immediate_actions = self._generate_immediate_actions(metrics, user_data)
        short_term_tactics = self._generate_short_term_tactics(metrics, user_data)
        long_term_strategy = self._generate_long_term_strategy(metrics, user_data, projections)
        
        # Critical alerts
        alerts = self._generate_alerts(metrics, user_data)
        
        # Benchmarking
        benchmarks = self._compare_to_benchmarks(metrics, user_data)
        
        return {
            "health_score": health_score,
            "metrics": metrics,
            "strengths": strengths,
            "vulnerabilities": vulnerabilities,
            "immediate_actions": immediate_actions,
            "short_term_tactics": short_term_tactics,
            "long_term_strategy": long_term_strategy,
            "alerts": alerts,
            "benchmarks": benchmarks
        }
    
    def _calculate_core_metrics(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate key financial metrics"""
        
        monthly_income = user_data.get('monthly_income', 0)
        side_income = user_data.get('side_income', 0)
        monthly_expenses = user_data.get('monthly_expenses', 0)
        savings = user_data.get('savings', 0)
        investments = user_data.get('investments', 0)
        debt = user_data.get('debt', 0)
        
        # Calculate plan values
        plan_values = sum(p.get('cash_value', 0) for p in user_data.get('plans', []))
        plan_contributions = sum(p.get('monthly_contribution', 0) for p in user_data.get('plans', []))
        
        total_monthly_income = monthly_income + side_income
        total_assets = savings + investments + plan_values
        net_worth = total_assets - debt
        
        # Cash flow
        monthly_surplus = total_monthly_income - monthly_expenses - plan_contributions
        annual_surplus = monthly_surplus * 12
        
        # Ratios
        savings_rate = (monthly_surplus / total_monthly_income) if total_monthly_income > 0 else 0
        debt_to_income = (debt / (total_monthly_income * 12)) if total_monthly_income > 0 else 0
        months_expenses_covered = (savings / monthly_expenses) if monthly_expenses > 0 else 0
        income_diversification = (side_income / total_monthly_income) if total_monthly_income > 0 else 0
        
        return {
            "monthly_income": monthly_income,
            "side_income": side_income,
            "total_monthly_income": total_monthly_income,
            "monthly_expenses": monthly_expenses,
            "plan_contributions": plan_contributions,
            "monthly_surplus": monthly_surplus,
            "annual_surplus": annual_surplus,
            "savings": savings,
            "investments": investments,
            "plan_values": plan_values,
            "total_assets": total_assets,
            "debt": debt,
            "net_worth": net_worth,
            "savings_rate": savings_rate,
            "debt_to_income": debt_to_income,
            "months_expenses_covered": months_expenses_covered,
            "income_diversification": income_diversification
        }
    
    def _calculate_health_score(self, metrics: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate Financial Health Score (0-100)
        Weighted scoring across 5 categories
        """
        
        score = 0
        breakdown = {}
        
        # 1. Emergency Fund / Liquidity (20 points)
        months = metrics['months_expenses_covered']
        if months >= 6:
            liquidity_score = 20
        elif months >= 3:
            liquidity_score = 15
        elif months >= 1:
            liquidity_score = 10
        else:
            liquidity_score = 5
        
        score += liquidity_score
        breakdown['liquidity'] = {
            "score": liquidity_score,
            "max": 20,
            "status": "excellent" if liquidity_score >= 18 else "good" if liquidity_score >= 15 else "fair" if liquidity_score >= 10 else "poor"
        }
        
        # 2. Debt Management (25 points)
        dti = metrics['debt_to_income']
        if dti == 0:
            debt_score = 25
        elif dti < 0.1:
            debt_score = 22
        elif dti < 0.2:
            debt_score = 18
        elif dti < 0.36:
            debt_score = 15
        else:
            debt_score = 8
        
        score += debt_score
        breakdown['debt_management'] = {
            "score": debt_score,
            "max": 25,
            "status": "excellent" if debt_score >= 22 else "good" if debt_score >= 18 else "fair" if debt_score >= 12 else "poor"
        }
        
        # 3. Savings Rate (20 points)
        sr = metrics['savings_rate']
        if sr >= 0.40:
            savings_score = 20
        elif sr >= 0.30:
            savings_score = 18
        elif sr >= 0.20:
            savings_score = 15
        elif sr >= 0.10:
            savings_score = 10
        else:
            savings_score = 5
        
        score += savings_score
        breakdown['savings_rate'] = {
            "score": savings_score,
            "max": 20,
            "status": "elite" if savings_score >= 18 else "excellent" if savings_score >= 15 else "good" if savings_score >= 10 else "poor"
        }
        
        # 4. Investment Diversification (20 points)
        num_plans = len([p for p in metrics.get('plans', [])])
        has_investments = metrics['investments'] > 0
        has_retirement_plan = any(
            p.get('plan_type') in ['401k', 'Roth IRA', 'Traditional 401k', 'Roth 401k', 'Solo 401k']
            for p in metrics.get('plans', [])
        )
        
        diversification_score = 0
        if has_investments:
            diversification_score += 8
        if has_retirement_plan:
            diversification_score += 8
        if num_plans >= 2:
            diversification_score += 4
        
        score += diversification_score
        breakdown['diversification'] = {
            "score": diversification_score,
            "max": 20,
            "status": "good" if diversification_score >= 15 else "fair" if diversification_score >= 10 else "poor"
        }
        
        # 5. Income Stability (15 points)
        stability_score = 10  # Base score for having income
        
        if metrics['income_diversification'] > 0.05:
            stability_score += 5  # Bonus for side income
        
        score += stability_score
        breakdown['income_stability'] = {
            "score": stability_score,
            "max": 15,
            "status": "excellent" if stability_score >= 13 else "good"
        }
        
        # Overall assessment
        if score >= 80:
            rating = "Excellent"
        elif score >= 70:
            rating = "Good"
        elif score >= 60:
            rating = "Fair"
        else:
            rating = "Needs Improvement"
        
        return {
            "score": min(score, 100),
            "rating": rating,
            "breakdown": breakdown
        }
    
    def _identify_strengths(self, metrics: Dict[str, Any], user_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Identify financial strengths"""
        
        strengths = []
        
        # Elite savings rate
        if metrics['savings_rate'] >= 0.40:
            strengths.append({
                "title": "Elite Savings Rate",
                "description": f"Your {metrics['savings_rate']:.0%} savings rate puts you in the top 10% of earners nationally",
                "icon": "trending_up",
                "category": "savings"
            })
        elif metrics['savings_rate'] >= 0.20:
            strengths.append({
                "title": "Strong Savings Habit",
                "description": f"Your {metrics['savings_rate']:.0%} savings rate exceeds the national average",
                "icon": "savings",
                "category": "savings"
            })
        
        # Income diversification
        if metrics['income_diversification'] > 0.05:
            strengths.append({
                "title": "Income Diversification",
                "description": f"{metrics['income_diversification']:.0%} of income from side hustle provides financial resilience",
                "icon": "account_balance",
                "category": "income"
            })
        
        # Low/no debt
        if metrics['debt'] == 0:
            strengths.append({
                "title": "Debt-Free",
                "description": "No debt allows maximum flexibility for wealth building",
                "icon": "check_circle",
                "category": "debt"
            })
        elif metrics['debt_to_income'] < 0.10:
            strengths.append({
                "title": "Low Debt Burden",
                "description": f"Debt-to-income ratio of {metrics['debt_to_income']:.0%} is excellent",
                "icon": "thumb_up",
                "category": "debt"
            })
        
        # Strong emergency fund
        if metrics['months_expenses_covered'] >= 6:
            strengths.append({
                "title": "Fully Funded Emergency Fund",
                "description": f"{metrics['months_expenses_covered']:.1f} months of expenses covered - excellent protection",
                "icon": "security",
                "category": "emergency_fund"
            })
        
        # High net worth for age
        age = user_data.get('age', 30)
        age_group = self._get_age_group(age)
        benchmark_net_worth = self.BENCHMARKS.get(age_group, {}).get('median_net_worth', 0)
        
        if metrics['net_worth'] > benchmark_net_worth * 2:
            strengths.append({
                "title": "Above-Average Net Worth",
                "description": f"Net worth of ${metrics['net_worth']:,.0f} exceeds median for your age group",
                "icon": "stars",
                "category": "net_worth"
            })
        
        return strengths
    
    def _identify_vulnerabilities(self, metrics: Dict[str, Any], user_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Identify financial vulnerabilities"""
        
        vulnerabilities = []
        
        # Low emergency fund
        if metrics['months_expenses_covered'] < 3:
            gap = (metrics['monthly_expenses'] * 6) - metrics['savings']
            months_to_fund = gap / metrics['monthly_surplus'] if metrics['monthly_surplus'] > 0 else float('inf')
            
            vulnerabilities.append({
                "title": "Emergency Fund Critically Low",
                "severity": "high" if metrics['months_expenses_covered'] < 1 else "medium",
                "description": f"Only {metrics['months_expenses_covered']:.1f} months coverage. Target: 6 months (${metrics['monthly_expenses'] * 6:,.0f})",
                "gap": gap,
                "months_to_fix": months_to_fund if months_to_fund != float('inf') else None,
                "icon": "warning",
                "category": "emergency_fund"
            })
        
        # High debt-to-income
        if metrics['debt_to_income'] > 0.36:
            vulnerabilities.append({
                "title": "High Debt-to-Income Ratio",
                "severity": "high" if metrics['debt_to_income'] > 0.50 else "medium",
                "description": f"{metrics['debt_to_income']:.0%} ratio exceeds recommended 36% threshold",
                "icon": "error",
                "category": "debt"
            })
        
        # Low savings rate
        if metrics['savings_rate'] < 0.10:
            vulnerabilities.append({
                "title": "Low Savings Rate",
                "severity": "medium",
                "description": f"{metrics['savings_rate']:.0%} savings rate limits wealth accumulation. Target: 20%+",
                "icon": "trending_down",
                "category": "savings"
            })
        
        # No retirement savings
        has_retirement = any(
            p.get('plan_type') in ['Max-Funded IUL', 'Whole Life (IBC)', 'Roth IRA', 'Traditional 401k', 'Roth 401k', 'Solo 401k']
            for p in user_data.get('plans', [])
        )
        
        if not has_retirement and user_data.get('age', 30) < 50:
            vulnerabilities.append({
                "title": "No Retirement Savings Plan",
                "severity": "medium",
                "description": "Starting retirement savings early maximizes compound growth",
                "icon": "schedule",
                "category": "retirement"
            })
        
        # Single income source
        if metrics['income_diversification'] == 0:
            vulnerabilities.append({
                "title": "Single Point of Income Failure",
                "severity": "low",
                "description": "No side income - vulnerable if primary income lost",
                "icon": "info",
                "category": "income"
            })
        
        return vulnerabilities
    
    def _generate_immediate_actions(self, metrics: Dict[str, Any], user_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate prioritized immediate actions (0-30 days)"""
        
        actions = []
        priority = 1
        
        # Emergency fund - highest priority if critical
        if metrics['months_expenses_covered'] < 6:
            target = metrics['monthly_expenses'] * 6
            gap = target - metrics['savings']
            months_to_fund = gap / metrics['monthly_surplus'] if metrics['monthly_surplus'] > 0 else None
            
            actions.append({
                "priority": priority,
                "title": "Build Emergency Fund",
                "description": f"Increase from ${metrics['savings']:,.0f} to ${target:,.0f}",
                "action_steps": [
                    f"Redirect ${metrics['monthly_surplus']:,.0f}/month to high-yield savings",
                    f"Target: Fully funded in {months_to_fund:.0f} months" if months_to_fund else "Review budget to increase surplus",
                    "Keep in FDIC-insured account with 4.5%+ APY"
                ],
                "timeline": f"{months_to_fund:.0f} months" if months_to_fund else "Ongoing",
                "impact": "Protects against job loss, medical emergencies, car repairs",
                "category": "emergency_fund"
            })
            priority += 1
        
        # Debt payoff (if exists and interest-bearing)
        if metrics['debt'] > 0:
            months_to_payoff = metrics['debt'] / metrics['monthly_surplus'] if metrics['monthly_surplus'] > 0 else None
            
            actions.append({
                "priority": priority,
                "title": "Eliminate Debt",
                "description": f"Pay off ${metrics['debt']:,.0f} balance",
                "action_steps": [
                    f"Use debt avalanche method (highest interest first)" if user_data.get('debt_interest_rate', 0) > 0 else "Pay strategically",
                    f"Allocate ${min(metrics['monthly_surplus'], metrics['debt']):,.0f}/month",
                    f"Debt-free in {months_to_payoff:.1f} months" if months_to_payoff else "Review payment strategy"
                ],
                "timeline": f"{months_to_payoff:.0f} months" if months_to_payoff else "Ongoing",
                "impact": f"Frees ${metrics['monthly_surplus']:,.0f}/month for investing",
                "category": "debt"
            })
            priority += 1
        
        return actions
    
    def _generate_short_term_tactics(self, metrics: Dict[str, Any], user_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate short-term tactics (3-12 months)"""
        
        tactics = []
        
        # Expense optimization
        tactics.append({
            "title": "Expense Audit & Optimization",
            "description": "Review monthly spending to identify $200-500 in savings opportunities",
            "action_steps": [
                "Track all expenses for 30 days",
                "Identify recurring subscriptions to cancel",
                "Negotiate bills (insurance, phone, internet)",
                "Redirect savings to investments"
            ],
            "timeline": "1-3 months",
            "potential_impact": f"${metrics['monthly_expenses'] * 0.1:,.0f}/month savings potential",
            "category": "expenses"
        })
        
        # Income scaling
        if metrics['side_income'] > 0:
            target_increase = metrics['side_income'] * 0.5
            tactics.append({
                "title": "Scale Side Income",
                "description": f"Grow side income from ${metrics['side_income']:,.0f} to ${metrics['side_income'] + target_increase:,.0f}/month",
                "action_steps": [
                    "Dedicate 5-10 hours/week to side hustle",
                    "Raise rates or increase client base",
                    "Automate/systematize operations"
                ],
                "timeline": "6-12 months",
                "potential_impact": f"${target_increase:,.0f}/month additional income",
                "category": "income"
            })
        
        return tactics
    
    def _generate_long_term_strategy(
        self,
        metrics: Dict[str, Any],
        user_data: Dict[str, Any],
        projections: Dict[str, Any] = None
    ) -> List[Dict[str, Any]]:
        """Generate long-term strategy (1-30 years)"""
        
        strategy = []
        
        age = user_data.get('age', 30)
        
        # Retirement planning
        strategy.append({
            "title": "Maximize Tax-Advantaged Retirement Accounts",
            "description": "Prioritize Roth IRA and 401(k) contributions for long-term growth",
            "action_steps": [
                "Open Roth IRA if not already (contribute $7,000/year)",
                "Increase 401(k) to capture full employer match",
                "Target 15% of gross income to retirement savings"
            ],
            "timeline": f"{65 - age} years to retirement",
            "category": "retirement"
        })
        
        # Investment diversification
        strategy.append({
            "title": "Build Diversified Investment Portfolio",
            "description": "Balance growth, stability, and liquidity across asset classes",
            "action_steps": [
                "Target allocation: 60% stocks / 30% bonds / 10% alternatives",
                "Use low-cost index funds (0.05% expense ratio)",
                "Rebalance quarterly"
            ],
            "timeline": "Ongoing",
            "category": "investments"
        })
        
        return strategy
    
    def _generate_alerts(self, metrics: Dict[str, Any], user_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate critical alerts"""
        
        alerts = []
        
        # Critical emergency fund
        if metrics['months_expenses_covered'] < 2:
            alerts.append({
                "type": "critical",
                "title": "⚠️ Emergency Fund Dangerously Low",
                "message": "One unexpected expense could derail your financial plan",
                "action": "Priority: Build to 6 months expenses immediately"
            })
        
        # High debt burden
        if metrics['debt_to_income'] > 0.50:
            alerts.append({
                "type": "critical",
                "title": "⚠️ Debt Burden Excessive",
                "message": f"{metrics['debt_to_income']:.0%} debt-to-income is unsustainable",
                "action": "Consider debt consolidation or credit counseling"
            })
        
        return alerts
    
    def _compare_to_benchmarks(self, metrics: Dict[str, Any], user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Compare to national averages"""
        
        age = user_data.get('age', 30)
        age_group = self._get_age_group(age)
        benchmark = self.BENCHMARKS.get(age_group, self.BENCHMARKS["25-34"])
        
        return {
            "age_group": age_group,
            "net_worth": {
                "user": metrics['net_worth'],
                "median": benchmark['median_net_worth'],
                "percentile": self._calculate_percentile(metrics['net_worth'], benchmark['median_net_worth'])
            },
            "savings_rate": {
                "user": metrics['savings_rate'],
                "median": benchmark['median_savings_rate'],
                "top_10": benchmark['top_10_savings_rate'],
                "percentile": self._calculate_percentile(metrics['savings_rate'], benchmark['median_savings_rate'])
            }
        }
    
    def _get_age_group(self, age: int) -> str:
        """Get age group for benchmarking"""
        if age < 35:
            return "25-34"
        elif age < 45:
            return "35-44"
        else:
            return "45-54"
    
    def _calculate_percentile(self, user_value: float, median_value: float) -> int:
        """Estimate percentile based on distance from median"""
        if median_value == 0:
            return 50
        
        ratio = user_value / median_value
        
        if ratio >= 2.0:
            return 90
        elif ratio >= 1.5:
            return 75
        elif ratio >= 1.0:
            return 60
        elif ratio >= 0.75:
            return 50
        elif ratio >= 0.50:
            return 40
        else:
            return 25