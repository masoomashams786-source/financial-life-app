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
  Typography,
  Divider,
  IconButton,
  InputAdornment,
  Chip,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Close, Save, TrendingUp } from "@mui/icons-material";
import {
  createFinancialPlan,
  updateFinancialPlan,
} from "../../api/financialPlans";

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

const SINGLE_PLAN_LIMIT = [
  "Roth IRA",
  "Traditional 401k",
  "Roth 401k",
  "Solo 401k",
  "HSA",
];

export default function PlanFormModal({
  open,
  onClose,
  plan,
  onSuccess,
  existingPlans = [],
}) {
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
    income_rate: "",
    notes: "",
    // Employer match fields
    employer_match_enabled: false,
    user_annual_salary: "",
    employer_match_percentage: 0,
    employer_match_cap: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [calculatedCashValue, setCalculatedCashValue] = useState(0);

  const colors = {
    primary: "#0A2540",
    accent: "#00D4FF",
    border: "#f1f5f9",
  };

  // Populate form on edit
  useEffect(() => {
    if (plan) {
      setFormData({
        ...formData,
        plan_type: plan.plan_type || "",
        current_value: plan.current_value || "",
        cash_value: plan.cash_value || "",
        monthly_contribution: plan.monthly_contribution || "",
        total_contribution_amount: plan.total_contribution_amount || "",
        years_to_contribute: plan.years_to_contribute || "",
        income_start_age: plan.income_start_age || "",
        income_end_age: plan.income_end_age || "",
        user_current_age: plan.user_current_age || "",
        income_rate: plan.income_rate || "",
        notes: plan.notes || "",
        employer_match_enabled: plan.employer_match_enabled || false,
        user_annual_salary: plan.user_annual_salary || "",
        employer_match_percentage: plan.employer_match_percentage || 0,
        employer_match_cap: plan.employer_match_cap || 0,
      });
    } else {
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
        income_rate: "",
        notes: "",
        employer_match_enabled: false,
        user_annual_salary: "",
        employer_match_percentage: 0,
        employer_match_cap: 0,
      });
    }
  }, [plan, open]);

  // Calculate suggested cash value
  useEffect(() => {
    const total = parseFloat(formData.total_contribution_amount) || 0;
    const interestRate = 0.05;
    const years = parseFloat(formData.years_to_contribute) || 0;

    if (total > 0 && years > 0) {
      const futureValue = total * Math.pow(1 + interestRate, years);
      setCalculatedCashValue(futureValue);
    } else {
      setCalculatedCashValue(0);
    }
  }, [formData.total_contribution_amount, formData.years_to_contribute]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateMatch = () => {
    if (
      !formData.employer_match_enabled ||
      !formData.user_annual_salary ||
      !formData.employer_match_percentage ||
      !formData.employer_match_cap
    )
      return 0;

    const annualContribution =
      parseFloat(formData.monthly_contribution) * 12 || 0;
    const employeeContributionRate = annualContribution / formData.user_annual_salary;
    const matchedRate = Math.min(employeeContributionRate, formData.employer_match_cap);
    const employerMatch =
      formData.user_annual_salary * matchedRate * formData.employer_match_percentage;
    return employerMatch;
  };

  const validateForm = () => {
    if (SINGLE_PLAN_LIMIT.includes(formData.plan_type)) {
      const hasDuplicate = existingPlans.some(
        (p) => p.plan_type === formData.plan_type && (!plan || p.id !== plan.id)
      );
      if (hasDuplicate) {
        return `You can only have one ${formData.plan_type} plan. You already have this plan in your account.`;
      }
    }

    if (!formData.plan_type) return "Plan type is required";
    if (!formData.current_value) return "Current value is required";
    if (!formData.cash_value) return "Cash value is required";
    if (!formData.monthly_contribution) return "Monthly contribution is required";
    if (!formData.years_to_contribute) return "Years to contribute is required";
    if (!formData.user_current_age) return "Current age is required";
    if (!formData.income_start_age) return "Income start age is required";
    if (!formData.income_end_age) return "Income end age is required";
    if (!formData.income_rate) return "Income rate is required";

    const currentAge = parseInt(formData.user_current_age);
    const incomeStartAge = parseInt(formData.income_start_age);
    const incomeEndAge = parseInt(formData.income_end_age);

    if (incomeStartAge <= currentAge) return "Income start age must be greater than current age";
    if (incomeEndAge <= incomeStartAge) return "Income end age must be greater than income start age";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        plan_type: formData.plan_type,
        current_value: parseFloat(formData.current_value) || 0,
        cash_value: parseFloat(formData.cash_value) || 0,
        monthly_contribution: parseFloat(formData.monthly_contribution) || 0,
        total_contribution_amount: parseFloat(formData.total_contribution_amount) || 0,
        years_to_contribute: parseInt(formData.years_to_contribute) || 0,
        income_start_age: parseInt(formData.income_start_age),
        income_end_age: parseInt(formData.income_end_age),
        user_current_age: parseInt(formData.user_current_age),
        income_rate: parseFloat(formData.income_rate) || 0,
        notes: formData.notes,
        // Employer match
        employer_match_enabled: formData.employer_match_enabled,
        user_annual_salary: parseFloat(formData.user_annual_salary) || 0,
        employer_match_percentage: parseFloat(formData.employer_match_percentage) || 0,
        employer_match_cap: parseFloat(formData.employer_match_cap) || 0,
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

  const useSuggestedCashValue = () => {
    setFormData({
      ...formData,
      cash_value: calculatedCashValue.toFixed(2),
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, boxShadow: "0 24px 48px rgba(0,0,0,0.2)" } }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 3, 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        bgcolor: colors.primary,
        color: "white"
      }}>
        <Box>
          <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2 }}>
            {plan ? "Edit Financial Plan" : "Add New Financial Plan"}
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
            {plan ? "Update your plan details" : "Create a comprehensive financial strategy"}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 4, bgcolor: "#fafafa" }}>
          {error && (
            <Alert severity="error" variant="filled" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Plan Type */}
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Plan Type"
                name="plan_type"
                value={formData.plan_type}
                onChange={handleChange}
                required
                InputProps={{ sx: { borderRadius: 2, bgcolor: "white" } }}
                helperText={
                  SINGLE_PLAN_LIMIT.includes(formData.plan_type)
                    ? "⚠️ You can only have ONE of this plan type (legal limit)"
                    : "You can have multiple of this plan type"
                }
              >
                {PLAN_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                    {SINGLE_PLAN_LIMIT.includes(type) && (
                      <Chip label="Single" size="small" sx={{ ml: 1, height: 20, fontSize: "0.7rem" }} />
                    )}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Personal Information Section */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                  Personal Information
                </Typography>
              </Divider>
            </Grid>

            {/* Current Age */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Your Current Age"
                name="user_current_age"
                type="number"
                value={formData.user_current_age}
                onChange={handleChange}
                required
                helperText="Your age today"
                InputProps={{ sx: { borderRadius: 2, bgcolor: "white" } }}
              />
            </Grid>

            {/* Years to Contribute */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Years to Contribute"
                name="years_to_contribute"
                type="number"
                value={formData.years_to_contribute}
                onChange={handleChange}
                required
                helperText="How many years will you contribute?"
                InputProps={{ sx: { borderRadius: 2, bgcolor: "white" } }}
              />
            </Grid>

            {/* Financial Details Section */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                  Financial Details
                </Typography>
              </Divider>
            </Grid>

            {/* Current Value */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Current Value"
                name="current_value"
                type="number"
                value={formData.current_value}
                onChange={handleChange}
                required
                helperText="Current worth of the plan"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Typography sx={{ color: "text.secondary", fontWeight: 700 }}>$</Typography></InputAdornment>,
                  sx: { borderRadius: 2, bgcolor: "white" }
                }}
              />
            </Grid>

            {/* Monthly Contribution */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Monthly Contribution"
                name="monthly_contribution"
                type="number"
                value={formData.monthly_contribution}
                onChange={handleChange}
                required
                helperText="Amount per month"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Typography sx={{ color: "text.secondary", fontWeight: 700 }}>$</Typography></InputAdornment>,
                  sx: { borderRadius: 2, bgcolor: "white" }
                }}
              />
            </Grid>

            {/* Total Contribution Amount */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Contribution Amount"
                name="total_contribution_amount"
                type="number"
                value={formData.total_contribution_amount}
                onChange={handleChange}
                helperText="Sum of all contributions"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Typography sx={{ color: "text.secondary", fontWeight: 700 }}>$</Typography></InputAdornment>,
                  sx: { borderRadius: 2, bgcolor: "white" }
                }}
              />
            </Grid>

            {/* Cash Value */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Whole Cash Value"
                name="cash_value"
                type="number"
                value={formData.cash_value}
                onChange={handleChange}
                required
                helperText="Total contribution + interest - costs"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Typography sx={{ color: "text.secondary", fontWeight: 700 }}>$</Typography></InputAdornment>,
                  sx: { borderRadius: 2, bgcolor: "white" }
                }}
              />
              {calculatedCashValue > 0 && (
                <Button
                  size="small"
                  onClick={() => setFormData({ ...formData, cash_value: calculatedCashValue.toFixed(2) })}
                  startIcon={<TrendingUp />}
                  sx={{ mt: 1, textTransform: "none", fontSize: "0.75rem", fontWeight: 600, color: colors.accent, "&:hover": { bgcolor: "rgba(0, 212, 255, 0.08)" } }}
                >
                  Use suggested: ${calculatedCashValue.toFixed(0)}
                </Button>
              )}
            </Grid>

            {/* Employer Match Section */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="caption">Employer Match (401k only)</Typography>
              </Divider>
            </Grid>

            {['Traditional 401k', 'Roth 401k', 'Solo 401k'].includes(formData.plan_type) && (
              <>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.employer_match_enabled}
                        onChange={(e) => setFormData({ ...formData, employer_match_enabled: e.target.checked })}
                      />
                    }
                    label="My employer offers matching contributions"
                  />
                </Grid>

                {formData.employer_match_enabled && (
                  <>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Annual Salary"
                        name="user_annual_salary"
                        type="number"
                        value={formData.user_annual_salary}
                        onChange={handleChange}
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        helperText="Your gross annual salary"
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Match Percentage"
                        name="employer_match_percentage"
                        type="number"
                        value={formData.employer_match_percentage * 100}
                        onChange={(e) =>
                          setFormData({ ...formData, employer_match_percentage: parseFloat(e.target.value) / 100 })
                        }
                        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                        helperText="e.g., 50% means $0.50 per $1.00"
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Match Cap"
                        name="employer_match_cap"
                        type="number"
                        value={formData.employer_match_cap * 100}
                        onChange={(e) =>
                          setFormData({ ...formData, employer_match_cap: parseFloat(e.target.value) / 100 })
                        }
                        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                        helperText="Max % of salary matched (e.g., 6%)"
                      />
                    </Grid>

                    {formData.user_annual_salary && formData.employer_match_percentage && formData.employer_match_cap && (
                      <Grid item xs={12}>
                        <Alert severity="success" icon={<TrendingUp />}>
                          <Typography variant="body2" fontWeight={600}>
                            Estimated Employer Match: ${calculateMatch().toLocaleString()}/year
                          </Typography>
                          <Typography variant="caption">
                            This is FREE money! Make sure to contribute at least {(formData.employer_match_cap * 100).toFixed(0)}% to get full match.
                          </Typography>
                        </Alert>
                      </Grid>
                    )}
                  </>
                )}
              </>
            )}

            {/* Income Withdrawal Details Section */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                  Income Withdrawal Details
                </Typography>
              </Divider>
            </Grid>

            {/* Income Start Age */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Income Start Age"
                name="income_start_age"
                type="number"
                value={formData.income_start_age}
                onChange={handleChange}
                required
                helperText="Age to start withdrawals"
                InputProps={{ sx: { borderRadius: 2, bgcolor: "white" } }}
              />
            </Grid>

            {/* Income End Age */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Income End Age"
                name="income_end_age"
                type="number"
                value={formData.income_end_age}
                onChange={handleChange}
                required
                helperText="Age to stop withdrawals"
                InputProps={{ sx: { borderRadius: 2, bgcolor: "white" } }}
              />
            </Grid>

            {/* Income Rate */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Annual Income Rate"
                name="income_rate"
                type="number"
                value={formData.income_rate}
                onChange={handleChange}
                required
                helperText="$ per year from policy"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  sx: { borderRadius: 2, bgcolor: "white" },
                }}
              />
            </Grid>

            {/* Notes */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes (Optional)"
                name="notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                helperText="Additional details about this plan"
                InputProps={{ sx: { borderRadius: 2, bgcolor: "white" } }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, bgcolor: "white", borderTop: `1px solid ${colors.border}` }}>
          <Button onClick={onClose} disabled={loading} sx={{ color: "text.secondary", fontWeight: 600, textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={!loading && <Save />}
            sx={{ minWidth: 120, borderRadius: 2, py: 1, textTransform: "none", fontWeight: 700, bgcolor: colors.primary, boxShadow: "0 4px 12px rgba(10, 37, 64, 0.2)", "&:hover": { bgcolor: "#1a365d" } }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : (plan ? "Update Plan" : "Create Plan")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
