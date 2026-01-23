"""
Financial Insight Engine
Personalized financial analysis based on CFP standards & Federal Reserve benchmarks
Pure algorithmic analysis – no UI logic
"""

from typing import Dict, List, Any


class InsightEngine:
    def __init__(self):
        self.BENCHMARKS = {
            "25-34": {"median_net_worth": 14000, "median_savings_rate": 0.05, "top_10_savings_rate": 0.20},
            "35-44": {"median_net_worth": 91000, "median_savings_rate": 0.08, "top_10_savings_rate": 0.25},
            "45-54": {"median_net_worth": 168000, "median_savings_rate": 0.12, "top_10_savings_rate": 0.30},
        }

    # ================= PUBLIC API ================= #

    def analyze_financial_profile(self, user_data: Dict[str, Any], projections: Dict[str, Any] = None) -> Dict[str, Any]:
        metrics = self._calculate_core_metrics(user_data)

        return {
            "metrics": metrics,
            "health_score": self._calculate_health_score(metrics, user_data),
            "strengths": self._identify_strengths(metrics, user_data),
            "vulnerabilities": self._identify_vulnerabilities(metrics, user_data),
            "immediate_actions": self._generate_immediate_actions(metrics, user_data),
            "alerts": self._generate_alerts(metrics),
            "benchmarks": self._compare_to_benchmarks(metrics, user_data),
        }

    # ================= METRICS ================= #

    def _calculate_core_metrics(self, u: Dict[str, Any]) -> Dict[str, Any]:
        monthly_income = u.get("monthly_income", 0)
        side_income = u.get("side_income", 0)
        total_income = monthly_income + side_income
        monthly_expenses = u.get("monthly_expenses", 0)
        savings = u.get("savings", 0)
        investments = u.get("investments", 0)
        debt = u.get("debt", 0)
        
        # Calculate plan contributions (money going to retirement/investment accounts)
        plans = u.get("plans", [])
        plan_contributions = sum(p.get('monthly_contribution', 0) for p in plans)
        
        # Calculate monthly surplus (what's left after expenses)
        monthly_surplus = total_income - monthly_expenses
        
        #  CORRECT: Savings rate = what % of income you're saving/investing
        # This includes ALL contributions to financial plans (401k, IRA, etc.)
        savings_rate = plan_contributions / total_income if total_income > 0 else 0
        
        # Emergency fund coverage in months
        months_covered = savings / monthly_expenses if monthly_expenses > 0 else 0
        
        # Debt-to-income ratio (annual debt / annual income)
        annual_income = total_income * 12
        debt_to_income = debt / annual_income if annual_income > 0 else 0
        
        # Side income percentage
        side_income_pct = side_income / total_income if total_income > 0 else 0

        return {
            "monthly_income": monthly_income,
            "side_income": side_income,
            "total_income": total_income,
            "monthly_expenses": monthly_expenses,
            "savings": savings,
            "investments": investments,
            "debt": debt,
            "monthly_surplus": monthly_surplus,
            "plan_contributions": plan_contributions,
            "savings_rate": savings_rate,  
            "months_covered": months_covered,
            "debt_to_income": debt_to_income,
            "side_income_pct": side_income_pct,
            "net_worth": savings + investments - debt,
        }

    # ================= HEALTH SCORE ================= #

    def _calculate_health_score(self, m: Dict[str, Any], u: Dict[str, Any]) -> Dict[str, Any]:
        score = 0
        breakdown = {}

        def add(name, val, maxv, status):
            nonlocal score
            score += val
            breakdown[name] = {"score": val, "max": maxv, "status": status}

        #  1. Emergency Fund (20 points) - EXACT MATCH TO YOUR CRITERIA
        months = m["months_covered"]
        if months >= 6:
            add("emergency_fund", 20, 20, "excellent")
        elif months >= 3:
            add("emergency_fund", 15, 20, "good")
        elif months >= 1:
            add("emergency_fund", 10, 20, "fair")
        else:
            add("emergency_fund", 5, 20, "poor")

        #  2. Debt Management (25 points) - EXACT MATCH TO YOUR CRITERIA
        dti = m["debt_to_income"]
        if m["debt"] == 0:
            add("debt_management", 25, 25, "excellent")
        elif dti < 0.10:
            add("debt_management", 22, 25, "excellent")
        elif dti < 0.20:
            add("debt_management", 18, 25, "good")
        elif dti <= 0.36:
            add("debt_management", 15, 25, "fair")
        else:
            add("debt_management", 8, 25, "poor")

        # 3. Savings Rate (20 points) - EXACT MATCH TO YOUR CRITERIA
        sr = m["savings_rate"]
        if sr >= 0.40:
            add("savings_rate", 20, 20, "elite")
        elif sr >= 0.30:
            add("savings_rate", 18, 20, "excellent")
        elif sr >= 0.20:
            add("savings_rate", 15, 20, "good")
        elif sr >= 0.10:
            add("savings_rate", 10, 20, "fair")
        else:
            add("savings_rate", 5, 20, "poor")

        #  4. Investment Diversification (20 points) - EXACT MATCH TO YOUR CRITERIA
        div_score = self._calculate_diversification_score(u.get("plans", []), m["investments"])
        status = "excellent" if div_score >= 18 else "good" if div_score >= 12 else "fair" if div_score >= 6 else "poor"
        add("investment_diversification", div_score, 20, status)

        # 5. Income Stability (15 points) - EXACT MATCH TO YOUR CRITERIA
        income_score = 10  # Base for having main income source
        if m["side_income_pct"] >= 0.05:
            income_score = 15
        status = "excellent" if income_score == 15 else "good"
        add("income_stability", income_score, 15, status)

        # Overall rating
        rating = (
            "Excellent" if score >= 85
            else "Good" if score >= 70
            else "Fair" if score >= 55
            else "Needs Improvement"
        )

        return {"score": score, "rating": rating, "breakdown": breakdown}

    # Investment Diversification Scoring - EXACT MATCH TO YOUR CRITERIA
    def _calculate_diversification_score(self, plans: List[Dict], investments: float) -> int:
        """
        Calculate investment diversification score (0-20 points)
        
        Criteria (EXACT MATCH):
        - Have taxable investments: +8 points
        - Have retirement account (401k/IRA): +8 points  
        - Have 2+ different plan types: +4 points
        """
        score = 0
        
        # +8 points for taxable investments
        if investments > 0:
            score += 8
        
        # +8 points for retirement account
        retirement_types = {'Roth IRA', 'Traditional 401k', 'Roth 401k', 'Solo 401k'}
        has_retirement = any(p.get('plan_type') in retirement_types for p in plans)
        if has_retirement:
            score += 8
        
        # +4 points for 2+ different plan types
        unique_plans = len(set(p.get('plan_type') for p in plans))
        if unique_plans >= 2:
            score += 4
        
        return score

    # ================= STRENGTHS ================= #

    def _identify_strengths(self, m, u):
        s = []

        # Savings rate strength (now using correct calculation)
        if m["savings_rate"] >= 0.40:
            s.append({"title": "Elite Savings Rate", "description": f"You're saving {m['savings_rate']:.0%} of your income monthly - top 10% nationally", "category": "savings"})
        elif m["savings_rate"] >= 0.20:
            s.append({"title": "Strong Savings Habit", "description": f"Saving {m['savings_rate']:.0%} of income exceeds national average", "category": "savings"})

        if m["months_covered"] >= 6:
            s.append({"title": "Fully Funded Emergency Fund", "description": f"{m['months_covered']:.1f} months of expenses covered", "category": "emergency"})

        if m["debt"] == 0:
            s.append({"title": "Debt-Free", "description": "No debt allows maximum flexibility for wealth building", "category": "debt"})
        elif m["debt_to_income"] < 0.10:
            s.append({"title": "Low Debt Burden", "description": f"Debt-to-income ratio of {m['debt_to_income']:.0%} is excellent", "category": "debt"})

        div_score = self._calculate_diversification_score(u.get("plans", []), m["investments"])
        if div_score >= 15:
            s.append({"title": "Well-Diversified Portfolio", "description": f"Investment diversification score: {div_score}/20", "category": "investments"})

        if m["side_income_pct"] >= 0.05:
            s.append({"title": "Income Diversification", "description": f"{m['side_income_pct']:.0%} of income from side sources provides financial resilience", "category": "income"})

        return s

    # ================= VULNERABILITIES ================= #

    def _identify_vulnerabilities(self, m, u):
        v = []

        if m["months_covered"] < 3:
            target = m["monthly_expenses"] * 6
            gap = target - m["savings"]
            severity = "high" if m["months_covered"] < 1 else "medium"
            v.append({
                "title": "Emergency Fund Critically Low", 
                "severity": severity, 
                "description": f"Only {m['months_covered']:.1f} months coverage. Target: 6 months (${target:,.0f})", 
                "gap": gap
            })

        # Now using correct savings_rate
        if m["savings_rate"] < 0.10:
            v.append({
                "title": "Low Savings Rate", 
                "severity": "medium", 
                "description": f"Only saving {m['savings_rate']:.0%} of monthly income (Target: 20%+)"
            })

        if m["debt_to_income"] > 0.36:
            severity = "high" if m["debt_to_income"] > 0.50 else "medium"
            v.append({
                "title": "High Debt-to-Income Ratio", 
                "severity": severity, 
                "description": f"{m['debt_to_income']:.0%} exceeds recommended 36% threshold"
            })

        div_score = self._calculate_diversification_score(u.get("plans", []), m["investments"])
        if div_score < 12:
            v.append({
                "title": "Incomplete Investment Diversification", 
                "severity": "medium", 
                "description": f"Diversification score is {div_score}/20. Consider adding retirement accounts or multiple investment types"
            })

        if m["side_income_pct"] == 0:
            v.append({
                "title": "Single Point of Income Failure", 
                "severity": "low", 
                "description": "No side income — vulnerable if primary income is lost"
            })

        return v

    # ================= ACTIONS ================= #

    def _generate_immediate_actions(self, m, u):
        a = []

        if m["months_covered"] < 6:
            target = m["monthly_expenses"] * 6
            gap = target - m["savings"]
            months = gap / m["monthly_surplus"] if m["monthly_surplus"] > 0 else None
            
            a.append({
                "priority": 1,
                "title": "Build Emergency Fund",
                "description": f"Increase from ${m['savings']:,.0f} to ${target:,.0f}",
                "action_steps": [
                    f"Redirect ${m['monthly_surplus']:,.0f}/month to high-yield savings",
                    f"Target: Fully funded in {months:.0f} months" if months else "Review budget to increase surplus",
                    "Keep in FDIC-insured account with 4.5%+ APY"
                ],
                "timeline": f"{months:.0f} months" if months else "Ongoing",
                "impact": "Protects against job loss, medical emergencies, car repairs",
                "category": "emergency_fund"
            })

        if m["savings_rate"] < 0.20:
            target_savings = m["total_income"] * 0.20
            current_savings = m["plan_contributions"]
            gap = target_savings - current_savings
            
            a.append({
                "priority": 2,
                "title": "Increase Savings Rate",
                "description": f"Currently saving {m['savings_rate']:.0%}, target: 20%",
                "action_steps": [
                    f"Increase monthly savings by ${gap:,.0f}",
                    "Automate transfers on payday",
                    "Review budget for expense cuts"
                ],
                "timeline": "Start immediately",
                "impact": f"Reach 20% savings rate (${target_savings:,.0f}/month)",
                "category": "savings"
            })

        if m["debt"] > 0 and m["debt_to_income"] > 0.20:
            months_to_payoff = m["debt"] / m["monthly_surplus"] if m["monthly_surplus"] > 0 else None
            a.append({
                "priority": 3,
                "title": "Reduce Debt Burden",
                "description": f"Pay down ${m['debt']:,.0f} balance",
                "action_steps": [
                    "Use debt avalanche method (highest interest first)",
                    f"Allocate ${min(m['monthly_surplus'], m['debt']):,.0f}/month to debt",
                    f"Debt-free in {months_to_payoff:.0f} months" if months_to_payoff else "Increase income or reduce expenses"
                ],
                "timeline": f"{months_to_payoff:.0f} months" if months_to_payoff else "Ongoing",
                "impact": f"Frees ${m['monthly_surplus']:,.0f}/month for investing",
                "category": "debt"
            })

        return a

    # ================= ALERTS ================= #

    def _generate_alerts(self, m):
        alerts = []
        if m["months_covered"] < 2:
            alerts.append({
                "type": "critical", 
                "title": "⚠️ Emergency Fund Dangerously Low", 
                "message": "One unexpected expense could derail your financial plan",
                "action": "Priority: Build to 6 months expenses immediately"
            })
        if m["debt_to_income"] > 0.50:
            alerts.append({
                "type": "critical", 
                "title": "⚠️ Debt Burden Excessive", 
                "message": f"{m['debt_to_income']:.0%} debt-to-income is unsustainable",
                "action": "Consider debt consolidation or credit counseling"
            })
        return alerts

    # ================= BENCHMARKS ================= #

    def _compare_to_benchmarks(self, m, u):
        age = u.get("age", 30)
        group = "25-34" if age < 35 else "35-44" if age < 45 else "45-54"
        b = self.BENCHMARKS[group]
        
        return {
            "age_group": group,
            "net_worth": {
                "user": m["net_worth"], 
                "median": b["median_net_worth"],
                "percentile": self._calculate_percentile(m["net_worth"], b["median_net_worth"])
            },
            "savings_rate": {
                "user": m["savings_rate"], 
                "median": b["median_savings_rate"], 
                "top_10": b["top_10_savings_rate"],
                "percentile": self._calculate_percentile(m["savings_rate"], b["median_savings_rate"])
            },
        }
    
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