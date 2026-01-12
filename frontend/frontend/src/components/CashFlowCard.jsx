import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Stack,
  alpha,
  Tooltip,
  Chip,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  AccountBalanceWallet,
  ShowChart,
  InfoOutlined,
} from "@mui/icons-material";
import { getFinancialSnapshot } from "../api/financialSnapshot";
import useSWR from "swr";
import { financialPlansFetcher } from "../api/financialPlans";

export default function CashFlowCard() {
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cashFlow, setCashFlow] = useState(0);
  const [breakdown, setBreakdown] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    planContributions: 0,
  });

  // Fetch financial plans for contributions
  const { data: plans } = useSWR("/financial-plans", financialPlansFetcher);

  const colors = {
    primary: "#0A2540",
    accent: "#00D4FF",
    success: "#10B981",
    danger: "#EF4444",
    warning: "#F59E0B",
    border: "#f1f5f9",
    surface: "#FFFFFF",
    softBg: "#F8FAFC",
  };

  useEffect(() => {
    fetchCashFlowData();
  }, [plans]);

  const fetchCashFlowData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getFinancialSnapshot();
      const data = response.data;
      setSnapshot(data);

      // Calculate total income
      const totalIncome = (data.net_income || 0) + (data.side_income || 0);

      // Calculate plan contributions
      const planContributions = plans
        ? plans.reduce((sum, plan) => sum + (plan.monthly_contribution || 0), 0)
        : 0;

      // Calculate total expenses (including plan contributions)
      const totalExpenses = (data.monthly_expenses || 0) + planContributions;

      // Calculate net cash flow
      const netCashFlow = totalIncome - totalExpenses;

      setCashFlow(netCashFlow);
      setBreakdown({
        totalIncome,
        totalExpenses,
        planContributions,
      });
    } catch (err) {
      setError("Failed to load cash flow data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value));
  };

  const getCashFlowStatus = () => {
    if (cashFlow > 0) {
      return {
        status: "positive",
        color: colors.success,
        icon: <TrendingUp sx={{ fontSize: 32 }} />,
        label: "Surplus",
        bgColor: alpha(colors.success, 0.08),
        message: "You're building wealth",
      };
    } else if (cashFlow < 0) {
      return {
        status: "negative",
        color: colors.danger,
        icon: <TrendingDown sx={{ fontSize: 32 }} />,
        label: "Deficit",
        bgColor: alpha(colors.danger, 0.08),
        message: "Spending exceeds income",
      };
    } else {
      return {
        status: "neutral",
        color: colors.warning,
        icon: <ShowChart sx={{ fontSize: 32 }} />,
        label: "Break Even",
        bgColor: alpha(colors.warning, 0.08),
        message: "Income equals expenses",
      };
    }
  };

  const status = getCashFlowStatus();

  if (loading) {
    return (
      <Card
        sx={{
          borderRadius: 4,
          border: `1px solid ${colors.border}`,
          boxShadow: "none",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 10,
          }}
        >
          <CircularProgress
            thickness={5}
            size={40}
            sx={{ color: colors.accent }}
          />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        sx={{
          borderRadius: 4,
          border: `1px solid ${colors.border}`,
          boxShadow: "none",
        }}
      >
        <CardContent>
          <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
            {error}
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
        overflow: "visible",
        position: "relative",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 20px 32px -12px rgba(10, 37, 64, 0.15)",
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        {/* Header Section */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <Box
                sx={{
                  width: 6,
                  height: 24,
                  bgcolor: status.color,
                  borderRadius: 3,
                }}
              />
              <Typography
                variant="h6"
                fontWeight={800}
                sx={{ color: colors.primary, letterSpacing: "-0.01em" }}
              >
                Monthly Cash Flow
              </Typography>
              <Tooltip
                title="Net cash flow = Total Income - (Expenses + Plan Contributions)"
                arrow
                placement="top"
              >
                <InfoOutlined
                  sx={{ fontSize: 16, color: "text.secondary", ml: 0.5 }}
                />
              </Tooltip>
            </Box>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {status.message}
            </Typography>
          </Box>
          <Chip
            label={status.label}
            size="small"
            sx={{
              bgcolor: status.bgColor,
              color: status.color,
              fontWeight: 800,
              fontSize: "0.7rem",
              height: 24,
              borderRadius: 1.5,
            }}
          />
        </Stack>

        {/* Main Cash Flow Display */}
        <Box
          sx={{
            bgcolor: status.bgColor,
            borderRadius: 3,
            p: 3,
            mb: 3,
            border: `2px solid ${alpha(status.color, 0.2)}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background Icon */}
          <Box
            sx={{
              position: "absolute",
              right: -10,
              top: -10,
              opacity: 0.1,
              transform: "rotate(15deg)",
            }}
          >
            <AccountBalanceWallet sx={{ fontSize: 120, color: status.color }} />
          </Box>

          {/* Content */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ position: "relative", zIndex: 1 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "16px",
                bgcolor: colors.surface,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: status.color,
                boxShadow: `0 4px 12px ${alpha(status.color, 0.2)}`,
                flexShrink: 0,
              }}
            >
              {status.icon}
            </Box>

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  display: "block",
                  mb: 0.5,
                }}
              >
                Net Flow
              </Typography>
              <Box display="flex" alignItems="baseline" gap={1}>
                <Typography
                  variant="h4"
                  fontWeight={900}
                  sx={{
                    color: status.color,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  {cashFlow < 0 ? "-" : "+"}
                  {formatCurrency(cashFlow)}
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  sx={{ color: "text.secondary" }}
                >
                  /month
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Box>

        {/* Breakdown Section */}
        <Stack spacing={1.5}>
          {/* Total Income */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1.5,
              bgcolor: alpha(colors.success, 0.04),
              borderRadius: 2,
              border: `1px solid ${alpha(colors.success, 0.1)}`,
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  bgcolor: colors.surface,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: colors.success,
                }}
              >
                <TrendingUp sx={{ fontSize: 16 }} />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 600,
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Total Income
                </Typography>
                <Typography variant="body2" fontWeight={700} color={colors.success}>
                  {formatCurrency(breakdown.totalIncome)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Total Expenses */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1.5,
              bgcolor: alpha(colors.danger, 0.04),
              borderRadius: 2,
              border: `1px solid ${alpha(colors.danger, 0.1)}`,
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  bgcolor: colors.surface,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: colors.danger,
                }}
              >
                <TrendingDown sx={{ fontSize: 16 }} />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 600,
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Total Expenses
                </Typography>
                <Typography variant="body2" fontWeight={700} color={colors.danger}>
                  {formatCurrency(breakdown.totalExpenses)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Plan Contributions (if any) */}
          {breakdown.planContributions > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1.5,
                bgcolor: alpha(colors.accent, 0.04),
                borderRadius: 2,
                border: `1px solid ${alpha(colors.accent, 0.1)}`,
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    bgcolor: colors.surface,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: colors.accent,
                  }}
                >
                  <AccountBalanceWallet sx={{ fontSize: 16 }} />
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 600,
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Plan Contributions
                  </Typography>
                  <Typography variant="body2" fontWeight={700} color={colors.accent}>
                    {formatCurrency(breakdown.planContributions)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Stack>

        {/* Annual Projection */}
        <Box
          sx={{
            mt: 3,
            pt: 2,
            borderTop: `1px solid ${colors.border}`,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                textTransform: "uppercase",
                fontSize: 10,
                letterSpacing: "0.05em",
              }}
            >
              Annual Projection
            </Typography>
            <Typography
              variant="body2"
              fontWeight={800}
              sx={{ color: cashFlow >= 0 ? colors.success : colors.danger }}
            >
              {cashFlow < 0 ? "-" : "+"}
              {formatCurrency(cashFlow * 12)}/year
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}