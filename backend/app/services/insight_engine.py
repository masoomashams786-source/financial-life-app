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
        income = u.get("monthly_income", 0) + u.get("side_income", 0)
        expenses = u.get("monthly_expenses", 0)
        savings = u.get("savings", 0)
        investments = u.get("investments", 0)
        debt = u.get("debt", 0)
        plans = u.get("plans", [])

        surplus = income - expenses
        savings_rate_capacity = surplus / income if income else 0
        actual_savings_rate = savings / (income * 12) if income else 0
        months_covered = savings / expenses if expenses else 0
        dti = (debt / (income * 12)) if income else 0

        return {
            "income": income,
            "expenses": expenses,
            "savings": savings,
            "investments": investments,
            "debt": debt,
            "surplus": surplus,
            "capacity_rate": savings_rate_capacity,
            "actual_savings_rate": actual_savings_rate,
            "months_covered": months_covered,
            "debt_to_income": dti,
            "net_worth": savings + investments - debt,
        }

    # ================= HEALTH SCORE ================= #

    def _calculate_health_score(self, m: Dict[str, Any], u: Dict[str, Any]) -> Dict[str, Any]:
        score = 0
        breakdown = {}

        def add(name, val, maxv):
            nonlocal score
            score += val
            breakdown[name] = {"score": val, "max": maxv}

        # Emergency Fund (25)
        if m["months_covered"] >= 6: add("emergency_fund", 25, 25)
        elif m["months_covered"] >= 3: add("emergency_fund", 18, 25)
        elif m["months_covered"] >= 1: add("emergency_fund", 10, 25)
        else: add("emergency_fund", 5, 25)

        # Savings (25)
        if m["actual_savings_rate"] >= 0.20: add("savings", 25, 25)
        elif m["actual_savings_rate"] >= 0.10: add("savings", 18, 25)
        elif m["actual_savings_rate"] > 0: add("savings", 10, 25)
        else: add("savings", 0, 25)

        # Debt (20)
        if m["debt_to_income"] <= 0.36: add("debt", 20, 20)
        elif m["debt_to_income"] <= 0.50: add("debt", 10, 20)
        else: add("debt", 5, 20)

        # Investments & Diversification (20) ✅ Fixed version
        diversification_score = self._calculate_diversification_score(
            u.get("plans", []),
            m["investments"]
        )
        add("diversification", diversification_score, 20)

        # Income Stability (10)
        if m["income"] > 0: add("income", 10, 10)
        else: add("income", 0, 10)

        rating = "Excellent" if score >= 80 else "Good" if score >= 65 else "Fair" if score >= 50 else "Needs Improvement"
        return {"score": score, "rating": rating, "breakdown": breakdown}

    # ================= NEW HELPER ================= #
    def _calculate_diversification_score(self, plans, investments):
        score = 0

        # +8: Taxable investments
        if investments > 0:
            score += 8

        # +8: Retirement account (401k / IRA / Roth)
        retirement_keywords = ("401k", "ira", "roth")
        has_retirement = any(
            any(k in p["plan_type"].lower() for k in retirement_keywords)
            for p in plans
        )
        if has_retirement:
            score += 8

        # +4: Two or more different plan types
        if len({p["plan_type"] for p in plans}) >= 2:
            score += 4

        return min(score, 20)

    # ================= STRENGTHS ================= #

    def _identify_strengths(self, m, u):
        s = []

        if m["actual_savings_rate"] >= 0.20:
            s.append({"title": "Elite Savings Rate", "description": f"Your {m['actual_savings_rate']:.0%} savings rate puts you in the top 10% nationally", "category": "savings"})
        elif m["capacity_rate"] >= 0.25 and m["savings"] == 0:
            s.append({"title": "High Savings Potential", "description": "Strong surplus but no savings yet — you can build wealth quickly", "category": "savings"})

        if m["months_covered"] >= 6:
            s.append({"title": "Fully Funded Emergency Fund", "description": f"{m['months_covered']:.1f} months of expenses covered", "category": "emergency"})

        if m["debt_to_income"] <= 0.36:
            s.append({"title": "Low Debt Burden", "description": f"Debt-to-income ratio of {m['debt_to_income']:.0%} is excellent", "category": "debt"})

        # Updated: Use new diversification score for description
        diversification_score = self._calculate_diversification_score(
            u.get("plans", []),
            m["investments"]
        )
        if diversification_score > 0:
            s.append({"title": "Diversified Investments", "description": f"Investment diversification score: {diversification_score}/20", "category": "investments"})

        return s

    # ================= VULNERABILITIES ================= #

    def _identify_vulnerabilities(self, m, u):
        v = []

        if m["months_covered"] < 3:
            gap = (u.get("monthly_expenses", 0) * 6) - m["savings"]
            v.append({"title": "Emergency Fund Critically Low", "severity": "high", "description": f"Only {m['months_covered']:.1f} months coverage. Target: 6 months (${'%0.0f' % (u.get('monthly_expenses',0)*6)})", "gap": gap})

        if m["actual_savings_rate"] < 0.10:
            v.append({"title": "Low Savings Rate", "severity": "medium", "description": f"{m['actual_savings_rate']:.0%} savings rate limits wealth accumulation (Target: 20%+)"})

        if m["debt_to_income"] > 0.36:
            v.append({"title": "High Debt-to-Income Ratio", "severity": "high", "description": f"{m['debt_to_income']:.0%} exceeds recommended 36% threshold"})

        # Updated vulnerability check for diversification
        diversification_score = self._calculate_diversification_score(
            u.get("plans", []),
            m["investments"]
        )
        if diversification_score < 20:
            v.append({"title": "Incomplete Investment Diversification", "severity": "medium", "description": f"Diversification score is {diversification_score}/20, consider adding taxable investments, retirement accounts, or multiple plan types"})

        if u.get("side_income", 0) == 0:
            v.append({"title": "Single Point of Income Failure", "severity": "low", "description": "No side income — vulnerable if primary income is lost"})

        return v

    # ================= ACTIONS ================= #

    def _generate_immediate_actions(self, m, u):
        a = []

        if m["months_covered"] < 6:
            target = u.get("monthly_expenses", 0) * 6
            gap = target - m["savings"]
            months = gap / m["surplus"] if m["surplus"] > 0 else None
            a.append({
                "priority": 1,
                "title": "Build Emergency Fund",
                "description": f"Increase from ${m['savings']:,.0f} to ${target:,.0f}",
                "steps": [
                    f"Redirect ${m['surplus']:,.0f}/month to high-yield savings",
                    f"Fully funded in {months:.0f} months" if months else "Increase surplus first",
                ],
            })

        if m["actual_savings_rate"] == 0 and m["surplus"] > 0:
            a.append({"priority": 2, "title": "Start Saving Automatically", "description": "Automate monthly transfers to savings & investments"})

        return a

    # ================= ALERTS ================= #

    def _generate_alerts(self, m):
        alerts = []
        if m["months_covered"] < 2:
            alerts.append({"type": "critical", "title": "⚠️ Emergency Fund Dangerously Low", "message": "One unexpected expense could derail your financial plan"})
        if m["debt_to_income"] > 0.50:
            alerts.append({"type": "critical", "title": "⚠️ Debt Burden Excessive", "message": "Debt level is unsustainable"})
        return alerts

    # ================= BENCHMARKS ================= #

    def _compare_to_benchmarks(self, m, u):
        age = u.get("age", 30)
        group = "25-34" if age < 35 else "35-44" if age < 45 else "45-54"
        b = self.BENCHMARKS[group]
        return {
            "age_group": group,
            "net_worth": {"user": m["net_worth"], "median": b["median_net_worth"]},
            "savings_rate": {"user": m["actual_savings_rate"], "median": b["median_savings_rate"], "top_10": b["top_10_savings_rate"]},
        }
