import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Stack,
  alpha,
} from "@mui/material";
import {
  AccountBalance,
  TrendingUp,
  ArrowForward,
  AddCircleOutline,
} from "@mui/icons-material";
import { financialPlansFetcher } from "../api/financialPlans";

export default function FinancialPlansCard() {
  const {
    data: summary,
    error,
    isLoading,
  } = useSWR("/financial-plans/summary", financialPlansFetcher);
  const navigate = useNavigate();

  const colors = {
    primary: "#0A2540",
    accent: "#00D4FF",
    success: "#10B981",
    border: "#f1f5f9",
    surface: "#ffffff",
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <Card sx={{ borderRadius: 4, border: `1px solid ${colors.border}`, height: '100%' }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <CircularProgress size={32} thickness={5} sx={{ color: colors.accent }} />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ borderRadius: 4, border: `1px solid ${colors.border}` }}>
        <CardContent>
          <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
            Failed to load plans
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 12px 24px -10px rgba(10, 37, 64, 0.1)",
        border: `1px solid ${colors.border}`,
        bgcolor: colors.surface,
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 20px 32px -12px rgba(10, 37, 64, 0.15)",
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box display="flex" alignItems="center" gap={1.5} mb={3}>
          <Box
            sx={{
              width: 6,
              height: 24,
              bgcolor: colors.accent,
              borderRadius: 3,
            }}
          />
          <Typography variant="h6" fontWeight={800} sx={{ color: colors.primary, letterSpacing: "-0.01em" }}>
            Financial Plans
          </Typography>
        </Box>

        {summary && summary.total_plans > 0 ? (
          <Box>
            {/* Summary Stats */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
              <Box
                flex={1}
                sx={{
                  bgcolor: alpha(colors.accent, 0.04),
                  p: 2,
                  borderRadius: 3,
                  border: `1px solid ${alpha(colors.accent, 0.1)}`,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                  <AccountBalance sx={{ fontSize: 16, color: colors.accent }} />
                  <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Total Value
                  </Typography>
                </Stack>
                <Typography variant="h5" fontWeight={800} color={colors.primary}>
                  {formatCurrency(summary.total_value)}
                </Typography>
              </Box>

              <Box
                flex={1}
                sx={{
                  bgcolor: alpha(colors.success, 0.04),
                  p: 2,
                  borderRadius: 3,
                  border: `1px solid ${alpha(colors.success, 0.1)}`,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                  <TrendingUp sx={{ fontSize: 16, color: colors.success }} />
                  <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Active
                  </Typography>
                </Stack>
                <Typography variant="h5" fontWeight={800} color={colors.primary}>
                  {summary.total_plans}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 3, opacity: 0.6 }} />

            {/* Plan List */}
            <Stack spacing={1.5} mb={3}>
              {summary.plans.slice(0, 3).map((plan) => (
                <Box
                  key={plan.id}
                  sx={{
                    p: 2,
                    bgcolor: "#f8fafc",
                    borderRadius: 2,
                    border: "1px solid #edf2f7",
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" fontWeight={700} color={colors.primary}>
                      {plan.plan_type}
                    </Typography>
                    <Chip
                      label="Active"
                      size="small"
                      sx={{
                        bgcolor: alpha(colors.success, 0.1),
                        color: colors.success,
                        fontWeight: 700,
                        fontSize: "0.65rem",
                        height: 20,
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Cash Value: <Box component="span" fontWeight={700} color="text.primary">{formatCurrency(plan.cash_value)}</Box>
                    </Typography>
                    {plan.income_rate > 0 && (
                      <Typography variant="caption" color={colors.success} display="block" fontWeight={600}>
                        Income withdraw: {formatCurrency(plan.income_rate)}/yr from age {plan.income_start_age}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
              {summary.total_plans > 3 && (
                <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ pt: 1, fontWeight: 500 }}>
                  + {summary.total_plans - 3} additional plans in portfolio
                </Typography>
              )}
            </Stack>

            <Button
              fullWidth
              variant="contained"
              disableElevation
              endIcon={<ArrowForward />}
              onClick={() => navigate("/financial-vehicles")}
              sx={{
                py: 1.8,
                bgcolor: colors.primary,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.95rem",
                "&:hover": {
                  bgcolor: "#1a365d",
                },
              }}
            >
              Manage Portfolio
            </Button>
          </Box>
        ) : (
          /* Empty State */
          <Box textAlign="center" py={6}>
            <Box
              sx={{
                display: 'inline-flex',
                p: 2,
                borderRadius: '50%',
                bgcolor: '#f1f5f9',
                mb: 2
              }}
            >
              <AddCircleOutline sx={{ fontSize: 40, color: "#cbd5e1" }} />
            </Box>
            <Typography variant="h6" fontWeight={700} color={colors.primary} gutterBottom>
              Start Planning
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 200, mx: 'auto' }}>
              You haven't added any financial vehicles yet.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate("/financial-vehicles")}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                px: 4,
                borderColor: colors.primary,
                color: colors.primary,
                "&:hover": { borderColor: "#1a365d", bgcolor: alpha(colors.primary, 0.04) }
              }}
            >
              Explore Vehicles
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}