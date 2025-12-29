import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  Alert,
  CircularProgress,
  Grid,
} from "@mui/material";
import { createFinancialPlan, updateFinancialPlan } from "../../api/financialPlans";

const PLAN_TYPES = [
  "Max-Funded IUL",
  "Whole Life (IBC)",
  "Roth IRA",
  "Traditional 401k",
  "Roth 401k",
  "Solo 401k",
  "HSA",
  "529 Plan",
  "Real Estate",
  "Private Equity",
  "CDs / Savings",
  "Non-Qual Annuity",
  "Other",
];

export default function PlanFormModal({ open, onClose, plan, onSuccess }) {
  const [formData, setFormData] = useState({
    plan_type: "",
    current_value: "",
    cash_value: "",
    monthly_contribution: "",
    total_contribution_amount: "",
    years_to_contribute: "",
    income_start_age: "",
    income_end_age: "",
    user_current_age: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (plan) {
      // Editing existing plan
      setFormData({
        plan_type: plan.plan_type || "",
        current_value: plan.current_value || "",
        cash_value: plan.cash_value || "",
        monthly_contribution: plan.monthly_contribution || "",
        total_contribution_amount: plan.total_contribution_amount || "",
        years_to_contribute: plan.years_to_contribute || "",
        income_start_age: plan.income_start_age || "",
        income_end_age: plan.income_end_age || "",
        user_current_age: plan.user_current_age || "",
        notes: plan.notes || "",
      });
    } else {
      // Reset for new plan
      setFormData({
        plan_type: "",
        current_value: "",
        cash_value: "",
        monthly_contribution: "",
        total_contribution_amount: "",
        years_to_contribute: "",
        income_start_age: "",
        income_end_age: "",
        user_current_age: "",
        notes: "",
      });
    }
  }, [plan, open]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Convert strings to numbers
      const payload = {
        plan_type: formData.plan_type,
        current_value: parseFloat(formData.current_value) || 0,
        cash_value: parseFloat(formData.cash_value) || 0,
        monthly_contribution: parseFloat(formData.monthly_contribution) || 0,
        total_contribution_amount: parseFloat(formData.total_contribution_amount) || 0,
        years_to_contribute: parseInt(formData.years_to_contribute) || 0,
        income_start_age: parseInt(formData.income_start_age) || null,
        income_end_age: parseInt(formData.income_end_age) || null,
        user_current_age: parseInt(formData.user_current_age) || null,
        notes: formData.notes,
      };

      if (plan) {
        await updateFinancialPlan(plan.id, payload);
      } else {
        await createFinancialPlan(payload);
      }

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{plan ? "Edit Plan" : "Add New Plan"}</DialogTitle>

        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Plan Type"
                name="plan_type"
                value={formData.plan_type}
                onChange={handleChange}
                required
              >
                {PLAN_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Current Value"
                name="current_value"
                type="number"
                value={formData.current_value}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cash Value"
                name="cash_value"
                type="number"
                value={formData.cash_value}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Monthly Contribution"
                name="monthly_contribution"
                type="number"
                value={formData.monthly_contribution}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Contribution Amount"
                name="total_contribution_amount"
                type="number"
                value={formData.total_contribution_amount}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Years to Contribute"
                name="years_to_contribute"
                type="number"
                value={formData.years_to_contribute}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Your Current Age"
                name="user_current_age"
                type="number"
                value={formData.user_current_age}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Income Start Age"
                name="income_start_age"
                type="number"
                value={formData.income_start_age}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Income End Age"
                name="income_end_age"
                type="number"
                value={formData.income_end_age}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ minWidth: 100 }}
          >
            {loading ? <CircularProgress size={24} /> : plan ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}