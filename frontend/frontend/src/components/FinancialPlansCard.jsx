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
} from "@mui/material";
import {
  AccountBalance,
  TrendingUp,
  ArrowForward,
  AddCircleOutline,
} from "@mui/icons-material";
import { financialPlansFetcher } from "../api/financialPlans";

export default function FinancialPlansCard() {
  const { data: summary, error, isLoading } = useSWR("/financial-plans/summary", financialPlansFetcher);
  const navigate = useNavigate();

  const colors = {
    primary: "#0A2540",
    accent: "#00D4FF",
    success: "#10B981",
    border: "#E6E9F0",
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
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Alert severity="error">Failed to load plans</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(10, 37, 64, 0.08)",
        border: `1px solid ${colors.border}`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <Box
            sx={{
              width: 8,
              height: 32,
              bgcolor: colors.success,
              borderRadius: 1,
            }}
          />
          <Typography variant="h6" fontWeight={700} color={colors.primary}>
            Financial Plans
          </Typography>
        </Box>

        {/* Summary Stats */}
        {summary && summary.total_plans > 0 ? (
          <Box>
            <Box display="flex" gap={2} mb={3}>
              {/* Total Value */}
              <Box
                flex={1}
                sx={{
                  bgcolor: "#F0F9FF",
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid #BAE6FD",
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <AccountBalance sx={{ fontSize: 20, color: colors.accent }} />
                  <Typography variant="caption" color="text.secondary">
                    Total Value
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={700} color={colors.primary}>
                  {formatCurrency(summary.total_value)}
                </Typography>
              </Box>

              {/* Active Plans */}
              <Box
                flex={1}
                sx={{
                  bgcolor: "#F0FDF4",
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid #BBF7D0",
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <TrendingUp sx={{ fontSize: 20, color: colors.success }} />
                  <Typography variant="caption" color="text.secondary">
                    Active Plans
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={700} color={colors.primary}>
                  {summary.total_plans}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Plan List */}
            <Box display="flex" flexDirection="column" gap={1} mb={2}>
              {summary.plans.slice(0, 3).map((plan) => (
                <Box
                  key={plan.id}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    p: 1.5,
                    bgcolor: "#F7F9FC",
                    borderRadius: 1,
                  }}
                >
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {plan.plan_type}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatCurrency(plan.current_value)}
                    </Typography>
                  </Box>
                  <Chip
                    label="Active"
                    size="small"
                    sx={{
                      bgcolor: colors.success,
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.7rem",
                    }}
                  />
                </Box>
              ))}
              {summary.total_plans > 3 && (
                <Typography variant="caption" color="text.secondary" textAlign="center">
                  +{summary.total_plans - 3} more plans
                </Typography>
              )}
            </Box>

            {/* View All Button */}
            <Button
              fullWidth
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={() => navigate("/financial-vehicles")}
              sx={{
                py: 1.5,
                bgcolor: colors.primary,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "#0d2f4f",
                },
              }}
            >
              Manage All Vehicles
            </Button>
          </Box>
        ) : (
          // No plans yet
          <Box textAlign="center" py={4}>
            <AddCircleOutline
              sx={{
                fontSize: 64,
                color: colors.border,
                mb: 2,
              }}
            />
            <Typography variant="body1" color="text.secondary" mb={1}>
              No financial plans yet
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={3}>
              Use the Calculator to run projections
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddCircleOutline />}
              onClick={() => navigate("/financial-vehicles")}
              sx={{
                bgcolor: colors.primary,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "#0d2f4f",
                },
              }}
            >
              Explore Financial Vehicles
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}