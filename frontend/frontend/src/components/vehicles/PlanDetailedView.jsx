import {
    Save,
    ShowChart,
    TrendingDown,
    TrendingUp
} from "@mui/icons-material";
import {
    Box,
    Card,
    CardContent,
    Chip,
    Grid,
    IconButton,
    Typography
} from "@mui/material";
import { PLAN_CHARACTERISTICS } from "./config";
import { formatPercent } from "./utils";

const colors = {
  primary: "#0A2540",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  accent: "#00D4FF",
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function PlanDetailedView({ plan, onSavePlan }) {
  const handleSaveClick = (result, scenario) => {
    onSavePlan(result, scenario);
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* Same detailed view as before */}
      {plan.map((result, idx) => (
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
              {PLAN_CHARACTERISTICS[result.plan_type].description}
            </Typography>

            <Grid container spacing={2}>
              {/* Best, Average, Worst cards with Save buttons */}
              {["best_case", "average_case", "worst_case"].map((scenario) => (
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
                      <Box display="flex" alignItems="center" gap={1}>
                        {scenario === "best_case" && (
                          <TrendingUp sx={{ color: colors.success }} />
                        )}
                        {scenario === "average_case" && (
                          <ShowChart sx={{ color: colors.accent }} />
                        )}
                        {scenario === "worst_case" && (
                          <TrendingDown sx={{ color: colors.danger }} />
                        )}
                        <Typography variant="subtitle1" fontWeight={700}>
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
                        onClick={() => handleSaveClick(result, scenario)}
                        sx={{
                          bgcolor: "white",
                          "&:hover": { bgcolor: "#f5f5f5" },
                        }}
                      >
                        <Save fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Total Contributed
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {formatCurrency(result[scenario].total_contributed)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Cash Value
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {formatCurrency(result[scenario].cash_value)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Annual Income
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {formatCurrency(
                            result[scenario].annual_income_after_tax
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
