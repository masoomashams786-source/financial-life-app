import { Calculate, ExpandMore, InfoOutlined } from "@mui/icons-material";
import { Controller } from "react-hook-form";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { PLAN_CHARACTERISTICS, PLAN_TYPES } from "./config";

const colors = {
  primary: "#0A2540",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  accent: "#00D4FF",
};

const PlanBadge = ({ plan, isSelected, onClick }) => {
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
        onClick={onClick}
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
};

const PlanConstrains = ({ plans }) => {
  const constraints = [];
  plans.forEach((plan) => {
    const char = PLAN_CHARACTERISTICS[plan];
    if (char.contributionLimit) {
      constraints.push(
        <Typography key={plan} variant="caption" display="block">
          • {plan}: ${char.contributionLimit.toLocaleString()}
          /year limit
        </Typography>
      );
    }
  });

  if (constraints.length === 0) {
    return null;
  }
  return (
    <Alert severity="warning" sx={{ mb: 3, fontSize: "0.85rem" }}>
      {constraints}
    </Alert>
  );
};

export default function PlanSelectionBoard({
  control,
  selectedPlans,
  handlePlanToggle,
  handleCalculate,
  loading,
  error,
}) {
  return (
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
          {PLAN_TYPES.map((plan) => (
            <PlanBadge
              key={plan}
              plan={plan}
              isSelected={selectedPlans.includes(plan)}
              onClick={() => handlePlanToggle(plan)}
            />
          ))}
        </Box>

        {/* Show selected plan warnings */}
        <PlanConstrains plans={selectedPlans} />

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" fontWeight={700} mb={3}>
          Step 2: Enter Your Details
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          {/* Personal Info */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography fontWeight={600}>Personal Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" flexDirection="column" gap={2}>
                {/* Current Age */}
                <Controller
                  name="current_age"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Current Age"
                      type="number"
                      required
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message || "Your age today"}
                    />
                  )}
                />

                {/* Monthly Contribution */}
                <Controller
                  name="monthly_contribution"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Monthly Contribution"
                      type="number"
                      required
                      error={!!fieldState.error}
                      helperText={
                        fieldState.error?.message ||
                        "Amount you'll contribute each month"
                      }
                      InputProps={{
                        startAdornment: (
                          <Typography sx={{ mr: 1 }}>$</Typography>
                        ),
                      }}
                    />
                  )}
                />

                {/* Years to Contribute */}
                <Controller
                  name="years_to_contribute"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Years to Contribute"
                      type="number"
                      required
                      error={!!fieldState.error}
                      helperText={
                        fieldState.error?.message ||
                        "How many years will you contribute?"
                      }
                    />
                  )}
                />

                {/* Income Start Age */}
                <Controller
                  name="income_start_age"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Income Start Age"
                      type="number"
                      required
                      error={!!fieldState.error}
                      helperText={
                        fieldState.error?.message ||
                        "Age when you start taking income"
                      }
                    />
                  )}
                />

                {/* Income End Age */}
                <Controller
                  name="income_end_age"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Income End Age"
                      type="number"
                      required
                      error={!!fieldState.error}
                      helperText={
                        fieldState.error?.message ||
                        "Age when income stops (life expectancy)"
                      }
                    />
                  )}
                />

                {/* Current Account Value */}
                <Controller
                  name="current_value"
                  control={control}
                  defaultValue="0"
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Current Account Value"
                      type="number"
                      error={!!fieldState.error}
                      helperText={
                        fieldState.error?.message ||
                        "Starting balance (0 if new account)"
                      }
                      InputProps={{
                        startAdornment: (
                          <Typography sx={{ mr: 1 }}>$</Typography>
                        ),
                      }}
                    />
                  )}
                />

                {/* Tax Rate */}
                <Controller
                  name="tax_rate"
                  control={control}
                  defaultValue="0.25"
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="Tax Rate"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    >
                      <MenuItem value="0.10">10% (Low bracket)</MenuItem>
                      <MenuItem value="0.22">22% (Middle bracket)</MenuItem>
                      <MenuItem value="0.25">25% (Upper-middle)</MenuItem>
                      <MenuItem value="0.32">32% (High bracket)</MenuItem>
                      <MenuItem value="0.37">37% (Top bracket)</MenuItem>
                    </TextField>
                  )}
                />

                {/* Inflation Rate */}
                <Controller
                  name="inflation_rate"
                  control={control}
                  defaultValue="0.03"
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="Inflation Rate"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    >
                      <MenuItem value="0.02">2% (Low inflation)</MenuItem>
                      <MenuItem value="0.03">3% (Historical average)</MenuItem>
                      <MenuItem value="0.04">4% (Elevated)</MenuItem>
                    </TextField>
                  )}
                />
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
  );
}
