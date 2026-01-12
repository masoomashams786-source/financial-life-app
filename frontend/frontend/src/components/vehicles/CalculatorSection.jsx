import { InfoOutlined } from "@mui/icons-material";
import { Alert, Box, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculatorSchema } from "./validationSchema";
import { mutate } from "swr";
import { compareMultiplePlans } from "../../api/calculator";
import { createFinancialPlan } from "../../api/financialPlans";
import { PLAN_CHARACTERISTICS } from "./config";
import PlanSelectionBoard from "./PlanSelectionBoard";
import ProjectionResultsView from "./ProjectionResultsView";
import SavePlanConfirmationDialog from "./SavePlanConfirmationDialog";
import { createCalculationPayload } from "./utils";

export default function CalculatorSection() {
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSaveDialogOpen, setSaveDialogOpen] = useState(false);
  const [planToSave, setPlanToSave] = useState(null);
  const [isSaving, setSaving] = useState(false);
  // Initialize React Hook Form
  const form = useForm({
    resolver: zodResolver(calculatorSchema),
    mode: "onChange",
    defaultValues: {
      current_age: "",
      monthly_contribution: "",
      years_to_contribute: "",
      income_start_age: "",
      income_end_age: "",
      current_value: "0",
      tax_rate: "0.25",
      inflation_rate: "0.03",
    },
  });

  // Debug: Check form state
  console.log("Form state:", form.formState);
  console.log("Form errors:", form.formState.errors);
  console.log("Form VALUES:", form.watch());
  // ========================================

  console.log("Results: ", results);

  const handlePlanToggle = (plan) => {
    setSelectedPlans((prev) =>
      prev.includes(plan) ? prev.filter((p) => p !== plan) : [...prev, plan]
    );
  };

  const validateInputs = (formData) => {
    // Check if at least one plan is selected
    if (selectedPlans.length === 0) {
      return "Please select at least one plan to compare";
    }

    // Check contribution limits for selected plans
    const monthlyContribution = parseFloat(formData.monthly_contribution);
    const annualContribution = monthlyContribution * 12;

    for (const plan of selectedPlans) {
      const characteristics = PLAN_CHARACTERISTICS[plan];
      if (
        characteristics.contributionLimit &&
        annualContribution > characteristics.contributionLimit
      ) {
        return `${plan} has a contribution limit of $${characteristics.contributionLimit.toLocaleString()}/year. Your monthly contribution of $${monthlyContribution.toLocaleString()} exceeds this ($${annualContribution.toLocaleString()}/year).`;
      }
    }

    return null;
  };

  const handleCalculate = async () => {
    // First, trigger React Hook Form validation (Zod schema)
    const isFormValid = await form.trigger();

    if (!isFormValid) {
      setError("Please fix the validation errors before calculating.");
      return;
    }

    // Get current form values
    const formData = form.getValues();

    console.log("Form data being validated:", formData);

    // Then validate business rules (contribution limits, selected plans)
    const validationError = validateInputs(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = createCalculationPayload(selectedPlans, formData);
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

  const handleSaveConfirm = async () => {
    setSaving(true);
    try {
      console.log("-------------Start of handleSaveConfirmation -------");
      console.log(planToSave);
      console.log("----------End of HandlesaveConfirmation -------------");
      const planCase = planToSave[planToSave.scenario];
      const formData = form.getValues();

      await createFinancialPlan({
        plan_type: planToSave.plan_type,
        current_value: formData.current_value,
        cash_value: planCase.cash_value,
        monthly_contribution: parseFloat(formData.monthly_contribution),
        total_contribution_amount: planCase.total_contributed,
        years_to_contribute: parseInt(formData.years_to_contribute),
        income_start_age: parseInt(formData.income_start_age),
        income_end_age: parseInt(formData.income_end_age),
        user_current_age: parseInt(formData.current_age),
        income_rate: planCase.annual_income_after_tax,
      });
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

  const handleSavePlan = (plan, caseType) => {
    setSaveDialogOpen(true);
    setPlanToSave({
      ...plan,
      scenario: caseType,
    });
  };

  return (
    <Box sx={{ bgcolor: "#e4eaf0ff", p: 4 }}>
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

      <Box
        sx={{ display: "grid", gap: 1, gridTemplateColumns: "repeat(2, 1fr)" }}
      >
        {/* Left: Inputs */}
        <Grid item xs={6}>
          <PlanSelectionBoard
            control={form.control}
            selectedPlans={selectedPlans}
            handlePlanToggle={handlePlanToggle}
            handleCalculate={handleCalculate}
            loading={loading}
            error={error}
          />
        </Grid>

        {/* Right: Results */}
        <Grid item xs={6}>
          <ProjectionResultsView
            projections={results}
            handleSavePlan={handleSavePlan}
            formValues={form.watch()}
          />
        </Grid>
      </Box>

      {/* Save Confirmation Dialog */}
      <SavePlanConfirmationDialog
        isOpen={isSaveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        planToSave={planToSave}
        onSavePlan={handleSaveConfirm}
        isSaving={isSaving}
      />
    </Box>
  );
}
