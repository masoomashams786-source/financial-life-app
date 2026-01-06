import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  ExpandMore,
  Calculate,
  TrendingUp,
  TrendingDown,
  ShowChart,
  CompareArrows,
  Save,
  InfoOutlined,
} from "@mui/icons-material";
import { compareMultiplePlans } from "../../api/calculator";
import { createFinancialPlan } from "../../api/financialPlans";
import { mutate } from "swr";

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
];

// Plan characteristics from the matrix (used for calculation validation)
const PLAN_CHARACTERISTICS = {
  "Max-Funded IUL": {
    taxFree: true,
    contributionLimit: null, // No limit
    marketProtection: true,
    description:
      "Tax-free growth via policy loans. Principal protected with 0% floor.",
  },
  "Whole Life (IBC)": {
    taxFree: true,
    contributionLimit: null,
    marketProtection: true,
    description: "Guaranteed growth 3-4%. Tax-free loans for Infinite Banking.",
  },
  "Roth IRA": {
    taxFree: true,
    contributionLimit: 7000,
    marketProtection: false,
    description: "Tax-free after 59½. $7K annual limit. Full market exposure.",
  },
  "Traditional 401k": {
    taxFree: false,
    contributionLimit: 23000,
    marketProtection: false,
    description: "Tax-deferred. Taxed on withdrawal. Market exposed.",
  },
  "Roth 401k": {
    taxFree: true,
    contributionLimit: 23000,
    marketProtection: false,
    description: "Tax-free withdrawals. $23K limit. Market risk.",
  },
  "Solo 401k": {
    taxFree: false, // Hybrid
    contributionLimit: 69000,
    marketProtection: false,
    description: "Self-employed. Up to $69K/year. Self-directed options.",
  },
  HSA: {
    taxFree: true,
    contributionLimit: 4150,
    marketProtection: false,
    description: "Triple tax-free for medical. $4,150 individual limit.",
  },
  "529 Plan": {
    taxFree: true, // For education
    contributionLimit: null,
    marketProtection: false,
    description: "Tax-free for education. 10% penalty for non-qualified use.",
  },
  "Real Estate": {
    taxFree: false,
    contributionLimit: null,
    marketProtection: false,
    description: "Depreciation benefits. 1031 exchanges. Illiquid.",
  },
  "Private Equity": {
    taxFree: false,
    contributionLimit: null,
    marketProtection: false,
    description:
      "High risk/reward. 5-10 year lock-ups. Accredited investors only.",
  },
  "CDs / Savings": {
    taxFree: false,
    contributionLimit: null,
    marketProtection: true,
    description: "FDIC insured. Low returns. Taxed as ordinary income.",
  },
  "Non-Qual Annuity": {
    taxFree: false,
    contributionLimit: null,
    marketProtection: true, // Depends on type
    description: "Tax-deferred. High fees. Surrender charges.",
  },
};

export default function CalculatorSection() {
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [inputs, setInputs] = useState({
    current_age: "",
    monthly_contribution: "",
    years_to_contribute: "",
    income_start_age: "",
    income_end_age: "",
    current_value: "0",
    tax_rate: "0.25",
    inflation_rate: "0.03",
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [planToSave, setPlanToSave] = useState(null);
  const [saving, setSaving] = useState(false);

  const colors = {
    primary: "#0A2540",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    accent: "#00D4FF",
  };

  const handlePlanToggle = (plan) => {
    setSelectedPlans((prev) =>
      prev.includes(plan) ? prev.filter((p) => p !== plan) : [...prev, plan]
    );
  };

  const handleInputChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const validateInputs = () => {
    const monthlyContribution = parseFloat(inputs.monthly_contribution);
    const annualContribution = monthlyContribution * 12;

    // Check contribution limits for selected plans
    for (const plan of selectedPlans) {
      const characteristics = PLAN_CHARACTERISTICS[plan];
      if (
        characteristics.contributionLimit &&
        annualContribution > characteristics.contributionLimit
      ) {
        return `${plan} has a contribution limit of $${characteristics.contributionLimit.toLocaleString()}/year. Your monthly contribution of $${monthlyContribution.toLocaleString()} exceeds this ($${annualContribution.toLocaleString()}/year).`;
      }
    }

    // Age validations
    const currentAge = parseInt(inputs.current_age);
    const incomeStartAge = parseInt(inputs.income_start_age);
    const incomeEndAge = parseInt(inputs.income_end_age);
    const yearsToContribute = parseInt(inputs.years_to_contribute);

    if (incomeStartAge <= currentAge) {
      return "Income start age must be greater than current age.";
    }

    if (incomeEndAge <= incomeStartAge) {
      return "Income end age must be greater than income start age.";
    }

    if (currentAge + yearsToContribute > incomeStartAge) {
      return "You cannot contribute beyond your income start age.";
    }

    return null;
  };

  const handleCalculate = async () => {
    if (selectedPlans.length === 0) {
      setError("Please select at least one plan to compare");
      return;
    }

    if (
      !inputs.current_age ||
      !inputs.monthly_contribution ||
      !inputs.years_to_contribute ||
      !inputs.income_start_age ||
      !inputs.income_end_age
    ) {
      setError("Please fill in all required fields");
      return;
    }

    // Validate against plan rules
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        plans: selectedPlans,
        params: {
          current_age: parseInt(inputs.current_age),
          monthly_contribution: parseFloat(inputs.monthly_contribution),
          years_to_contribute: parseInt(inputs.years_to_contribute),
          income_start_age: parseInt(inputs.income_start_age),
          income_end_age: parseInt(inputs.income_end_age),
          current_value: parseFloat(inputs.current_value),
          tax_rate: parseFloat(inputs.tax_rate),
          inflation_rate: parseFloat(inputs.inflation_rate),
        },
      };

      const response = await compareMultiplePlans(payload);
      setResults(response.data.comparisons);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Calculation failed. Please check your inputs."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClick = (result, scenario) => {
  const scenarioData = result[scenario];
  
  setPlanToSave({
    plan_type: result.plan_type,
    scenario: scenario,
    current_value: scenarioData.cash_value,
    cash_value: scenarioData.cash_value,
    monthly_contribution: parseFloat(inputs.monthly_contribution),
    total_contribution_amount: scenarioData.total_contributed,
    years_to_contribute: parseInt(inputs.years_to_contribute),
    income_start_age: parseInt(inputs.income_start_age),
    income_end_age: parseInt(inputs.income_end_age),
    user_current_age: parseInt(inputs.current_age),
    income_rate: scenarioData.annual_income_after_tax, // This is the annual income rate
    notes: `${scenario.replace("_", " ")} projection. Tax: ${(parseFloat(inputs.tax_rate) * 100).toFixed(0)}%. Inflation: ${(parseFloat(inputs.inflation_rate) * 100).toFixed(0)}%.`,
  });
  setSaveDialogOpen(true);
};

  const handleSaveConfirm = async () => {
    setSaving(true);
    try {
      await createFinancialPlan(planToSave);
      // Invalidate SWR cache to refresh plans
      mutate("/financial-plans");
      mutate("/financial-plans/summary");
      setSaveDialogOpen(false);
      alert("Plan saved successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to save plan");
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Financial Plan Calculator
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Simulate different scenarios based on professional matrix rules, then
          save your chosen plan
        </Typography>
        <Alert severity="info" icon={<InfoOutlined />}>
          This calculator uses the exact rules from the Comparative Matrix.
          Contribution limits, tax advantages, and market protection are
          automatically applied based on each vehicle's characteristics.
        </Alert>
      </Box>

      <Grid container spacing={4}>
        {/* Left: Inputs */}
        <Grid item xs={12} lg={5}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Step 1: Select Plans to Compare
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mb={2}
              >
                Choose multiple plans to see side-by-side projections
              </Typography>

              <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
                {PLAN_TYPES.map((plan) => {
                  const isSelected = selectedPlans.includes(plan);
                  const characteristics = PLAN_CHARACTERISTICS[plan];
                  return (
                    <Tooltip
                      key={plan}
                      title={characteristics.description}
                      arrow
                      placement="top"
                    >
                      <Chip
                        label={plan}
                        onClick={() => handlePlanToggle(plan)}
                        color={isSelected ? "primary" : "default"}
                        variant={isSelected ? "filled" : "outlined"}
                        sx={{ fontWeight: 600 }}
                        icon={
                          characteristics.contributionLimit ? (
                            <InfoOutlined fontSize="small" />
                          ) : undefined
                        }
                      />
                    </Tooltip>
                  );
                })}
              </Box>

              {/* Show selected plan warnings */}
              {selectedPlans.length > 0 && (
                <Alert severity="warning" sx={{ mb: 3, fontSize: "0.85rem" }}>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    display="block"
                    mb={0.5}
                  >
                    Selected Plans Constraints:
                  </Typography>
                  {selectedPlans.map((plan) => {
                    const char = PLAN_CHARACTERISTICS[plan];
                    if (char.contributionLimit) {
                      return (
                        <Typography
                          key={plan}
                          variant="caption"
                          display="block"
                        >
                          • {plan}: ${char.contributionLimit.toLocaleString()}
                          /year limit
                        </Typography>
                      );
                    }
                    return null;
                  })}
                </Alert>
              )}

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" fontWeight={700} mb={3}>
                Step 2: Enter Your Details
              </Typography>

              <Box display="flex" flexDirection="column" gap={2}>
                {/* Personal Info */}
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography fontWeight={600}>
                      Personal Information
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box display="flex" flexDirection="column" gap={2}>
                      <TextField
                        fullWidth
                        label="Current Age"
                        name="current_age"
                        type="number"
                        value={inputs.current_age}
                        onChange={handleInputChange}
                        required
                        helperText="Your age today"
                      />
                      <TextField
                        fullWidth
                        label="Monthly Contribution"
                        name="monthly_contribution"
                        type="number"
                        value={inputs.monthly_contribution}
                        onChange={handleInputChange}
                        required
                        helperText="Amount you'll contribute each month"
                        InputProps={{
                          startAdornment: (
                            <Typography sx={{ mr: 1 }}>$</Typography>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Years to Contribute"
                        name="years_to_contribute"
                        type="number"
                        value={inputs.years_to_contribute}
                        onChange={handleInputChange}
                        required
                        helperText="How many years will you contribute?"
                      />
                    </Box>
                  </AccordionDetails>
                </Accordion>

                {/* Income Withdrawal */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography fontWeight={600}>
                      Income Withdrawal Phase
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box display="flex" flexDirection="column" gap={2}>
                      <TextField
                        fullWidth
                        label="Income Start Age"
                        name="income_start_age"
                        type="number"
                        value={inputs.income_start_age}
                        onChange={handleInputChange}
                        required
                        helperText="Age when you start taking income"
                      />
                      <TextField
                        fullWidth
                        label="Income End Age"
                        name="income_end_age"
                        type="number"
                        value={inputs.income_end_age}
                        onChange={handleInputChange}
                        required
                        helperText="Age when income stops (life expectancy)"
                      />
                    </Box>
                  </AccordionDetails>
                </Accordion>

                {/* Advanced Settings */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography fontWeight={600}>
                      Advanced Assumptions
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box display="flex" flexDirection="column" gap={2}>
                      <TextField
                        fullWidth
                        label="Current Account Value"
                        name="current_value"
                        type="number"
                        value={inputs.current_value}
                        onChange={handleInputChange}
                        helperText="Starting balance (0 if new account)"
                        InputProps={{
                          startAdornment: (
                            <Typography sx={{ mr: 1 }}>$</Typography>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        select
                        label="Tax Rate"
                        name="tax_rate"
                        value={inputs.tax_rate}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="0.10">10% (Low bracket)</MenuItem>
                        <MenuItem value="0.22">22% (Middle bracket)</MenuItem>
                        <MenuItem value="0.25">25% (Upper-middle)</MenuItem>
                        <MenuItem value="0.32">32% (High bracket)</MenuItem>
                        <MenuItem value="0.37">37% (Top bracket)</MenuItem>
                      </TextField>
                      <TextField
                        fullWidth
                        select
                        label="Inflation Rate"
                        name="inflation_rate"
                        value={inputs.inflation_rate}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="0.02">2% (Low inflation)</MenuItem>
                        <MenuItem value="0.03">
                          3% (Historical average)
                        </MenuItem>
                        <MenuItem value="0.04">4% (Elevated)</MenuItem>
                      </TextField>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <Calculate />
                  )
                }
                onClick={handleCalculate}
                disabled={loading || selectedPlans.length === 0}
                sx={{
                  mt: 3,
                  py: 1.5,
                  bgcolor: colors.primary,
                  fontWeight: 700,
                  fontSize: "1rem",
                  "&:hover": { bgcolor: "#0d2f4f" },
                }}
              >
                {loading ? "Calculating..." : "Calculate Projections"}
              </Button>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right: Results */}
        <Grid item xs={12} lg={7}>
          <Card sx={{ boxShadow: 3, minHeight: 600 }}>
            <CardContent>
              {!results ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  minHeight={500}
                >
                  <ShowChart sx={{ fontSize: 80, color: "#E0E0E0", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Select plans and click Calculate
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your projections will appear here
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {/* View Toggle */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                  >
                    <Typography variant="h6" fontWeight={700}>
                      Projection Results
                    </Typography>
                    <ToggleButtonGroup
                      value={viewMode}
                      exclusive
                      onChange={(e, newValue) =>
                        newValue && setViewMode(newValue)
                      }
                      size="small"
                    >
                      <ToggleButton value="table">
                        <CompareArrows sx={{ mr: 1 }} /> Comparison
                      </ToggleButton>
                      <ToggleButton value="detailed">
                        <ShowChart sx={{ mr: 1 }} /> Detailed
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>

                  {/* Table View */}
                  {viewMode === "table" && (
                    <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell
                              sx={{ fontWeight: 700, bgcolor: "#F7F9FC" }}
                            >
                              Plan Type
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: 700, bgcolor: "#F7F9FC" }}
                            >
                              Scenario
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: 700, bgcolor: "#F7F9FC" }}
                            >
                              Total Contributed
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: 700, bgcolor: "#F7F9FC" }}
                            >
                              Cash Value
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: 700, bgcolor: "#F7F9FC" }}
                            >
                              Annual Income
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: 700, bgcolor: "#F7F9FC" }}
                            >
                              Actions
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {results.map((result, idx) => (
                            <React.Fragment key={`${result.plan_type}-${idx}`}>
                              {/* Best Case */}
                              <TableRow>
                                <TableCell rowSpan={3} sx={{ fontWeight: 700 }}>
                                  {result.plan_type}
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label="Best"
                                    size="small"
                                    icon={<TrendingUp />}
                                    sx={{
                                      bgcolor: `${colors.success}20`,
                                      color: colors.success,
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(
                                    result.best_case.total_contributed
                                  )}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontWeight: 700,
                                    color: colors.success,
                                  }}
                                >
                                  {formatCurrency(result.best_case.cash_value)}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontWeight: 700,
                                    color: colors.success,
                                  }}
                                >
                                  {formatCurrency(
                                    result.best_case.annual_income_after_tax
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Tooltip title="Save this scenario to My Plans">
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleSaveClick(result, "best_case")
                                      }
                                      sx={{ color: colors.success }}
                                    >
                                      <Save fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>

                              {/* Average Case */}
                              <TableRow>
                                <TableCell>
                                  <Chip
                                    label="Average"
                                    size="small"
                                    icon={<ShowChart />}
                                    sx={{
                                      bgcolor: `${colors.accent}20`,
                                      color: colors.accent,
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(
                                    result.average_case.total_contributed
                                  )}
                                </TableCell>
                                <TableCell
                                  sx={{ fontWeight: 700, color: colors.accent }}
                                >
                                  {formatCurrency(
                                    result.average_case.cash_value
                                  )}
                                </TableCell>
                                <TableCell
                                  sx={{ fontWeight: 700, color: colors.accent }}
                                >
                                  {formatCurrency(
                                    result.average_case.annual_income_after_tax
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Tooltip title="Save this scenario to My Plans">
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleSaveClick(result, "average_case")
                                      }
                                      sx={{ color: colors.accent }}
                                    >
                                      <Save fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>

                              {/* Worst Case */}
                              <TableRow>
                                <TableCell>
                                  <Chip
                                    label="Worst"
                                    size="small"
                                    icon={<TrendingDown />}
                                    sx={{
                                      bgcolor: `${colors.danger}20`,
                                      color: colors.danger,
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(
                                    result.worst_case.total_contributed
                                  )}
                                </TableCell>
                                <TableCell
                                  sx={{ fontWeight: 700, color: colors.danger }}
                                >
                                  {formatCurrency(result.worst_case.cash_value)}
                                </TableCell>
                                <TableCell
                                  sx={{ fontWeight: 700, color: colors.danger }}
                                >
                                  {formatCurrency(
                                    result.worst_case.annual_income_after_tax
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Tooltip title="Save this scenario to My Plans">
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleSaveClick(result, "worst_case")
                                      }
                                      sx={{ color: colors.danger }}
                                    >
                                      <Save fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            </React.Fragment>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}

                  {/* Detailed View - keeping previous implementation */}
                  {viewMode === "detailed" && (
                    <Box display="flex" flexDirection="column" gap={3}>
                      {/* Same detailed view as before */}
                      {results.map((result, idx) => (
                        <Card key={idx} variant="outlined">
                          <CardContent>
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              mb={2}
                            >
                              <Typography variant="h6" fontWeight={700}>
                                {result.plan_type}
                              </Typography>
                              <Chip
                                label={
                                  PLAN_CHARACTERISTICS[result.plan_type].taxFree
                                    ? "Tax-Free"
                                    : "Taxable"
                                }
                                size="small"
                                color={
                                  PLAN_CHARACTERISTICS[result.plan_type].taxFree
                                    ? "success"
                                    : "warning"
                                }
                              />
                            </Box>
                            {/* Rest of detailed view cards */}
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              mb={2}
                            >
                              {
                                PLAN_CHARACTERISTICS[result.plan_type]
                                  .description
                              }
                            </Typography>

                            <Grid container spacing={2}>
                              {/* Best, Average, Worst cards with Save buttons */}
                              {["best_case", "average_case", "worst_case"].map(
                                (scenario) => (
                                  <Grid item xs={12} md={4} key={scenario}>
                                    <Box
                                      sx={{
                                        p: 2,
                                        bgcolor: `${
                                          scenario === "best_case"
                                            ? colors.success
                                            : scenario === "average_case"
                                            ? colors.accent
                                            : colors.danger
                                        }10`,
                                        borderRadius: 2,
                                        border: `2px solid ${
                                          scenario === "best_case"
                                            ? colors.success
                                            : scenario === "average_case"
                                            ? colors.accent
                                            : colors.danger
                                        }`,
                                      }}
                                    >
                                      <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        mb={2}
                                      >
                                        <Box
                                          display="flex"
                                          alignItems="center"
                                          gap={1}
                                        >
                                          {scenario === "best_case" && (
                                            <TrendingUp
                                              sx={{ color: colors.success }}
                                            />
                                          )}
                                          {scenario === "average_case" && (
                                            <ShowChart
                                              sx={{ color: colors.accent }}
                                            />
                                          )}
                                          {scenario === "worst_case" && (
                                            <TrendingDown
                                              sx={{ color: colors.danger }}
                                            />
                                          )}
                                          <Typography
                                            variant="subtitle1"
                                            fontWeight={700}
                                          >
                                            {scenario === "best_case"
                                              ? "Best"
                                              : scenario === "average_case"
                                              ? "Average"
                                              : "Worst"}{" "}
                                            Case
                                          </Typography>
                                        </Box>
                                        <IconButton
                                          size="small"
                                          onClick={() =>
                                            handleSaveClick(result, scenario)
                                          }
                                          sx={{
                                            bgcolor: "white",
                                            "&:hover": { bgcolor: "#f5f5f5" },
                                          }}
                                        >
                                          <Save fontSize="small" />
                                        </IconButton>
                                      </Box>
                                      <Box
                                        display="flex"
                                        flexDirection="column"
                                        gap={1}
                                      >
                                        <Box>
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                          >
                                            Total Contributed
                                          </Typography>
                                          <Typography
                                            variant="body1"
                                            fontWeight={600}
                                          >
                                            {formatCurrency(
                                              result[scenario].total_contributed
                                            )}
                                          </Typography>
                                        </Box>
                                        <Box>
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                          >
                                            Cash Value
                                          </Typography>
                                          <Typography
                                            variant="h6"
                                            fontWeight={700}
                                          >
                                            {formatCurrency(
                                              result[scenario].cash_value
                                            )}
                                          </Typography>
                                        </Box>
                                        <Box>
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                          >
                                            Annual Income
                                          </Typography>
                                          <Typography
                                            variant="h6"
                                            fontWeight={700}
                                          >
                                            {formatCurrency(
                                              result[scenario]
                                                .annual_income_after_tax
                                            )}
                                          </Typography>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Grid>
                                )
                              )}
                            </Grid>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  )}

                  {/* Methodology Note */}
                  <Alert severity="info" icon={<InfoOutlined />} sx={{ mt: 3 }}>
                    <Typography variant="body2" fontWeight={600} mb={0.5}>
                      How These Numbers Are Calculated:
                    </Typography>
                    <Typography variant="caption" display="block">
                      • <strong>Best Case:</strong> Above-average returns, low
                      volatility, favorable tax treatment
                    </Typography>
                    <Typography variant="caption" display="block">
                      • <strong>Average Case:</strong> Historical market
                      averages, typical policy costs
                    </Typography>
                    <Typography variant="caption" display="block">
                      • <strong>Worst Case:</strong> Below-average returns, high
                      volatility, conservative assumptions
                    </Typography>
                    <Typography variant="caption" display="block" mt={1}>
                      All scenarios account for:{" "}
                      {formatPercent(inputs.tax_rate)} tax rate,{" "}
                      {formatPercent(inputs.inflation_rate)} inflation,
                      plan-specific fees, and contribution limits.
                    </Typography>
                  </Alert>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Save Confirmation Dialog */}
      <Dialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Save Plan to My Plans</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            This will save the projected values to "My Current Plans" for
            tracking.
          </Alert>
          {planToSave && (
            <Box>
              <Typography variant="body2" gutterBottom>
                <strong>Plan:</strong> {planToSave.plan_type}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Scenario:</strong>{" "}
                {planToSave.scenario.replace("_", " ")}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Projected Cash Value:</strong>{" "}
                {formatCurrency(planToSave.cash_value)}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Annual Income:</strong>{" "}
                {formatCurrency(planToSave.annual_income_after_tax)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveConfirm}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} /> : <Save />}
          >
            {saving ? "Saving..." : "Save Plan"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
