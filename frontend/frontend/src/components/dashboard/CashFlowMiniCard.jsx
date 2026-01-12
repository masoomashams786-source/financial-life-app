import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  alpha,
  Chip,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  AccountBalanceWallet,
  ShowChart,
} from "@mui/icons-material";
import { getFinancialSnapshot } from "../../api/financialSnapshot";
import useSWR from "swr";
import { financialPlansFetcher } from "../../api/financialPlans";
import CashFlowModal from "./CashFlowModal";

export default function CashFlowMiniCard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cashFlow, setCashFlow] = useState(0);
  const [breakdown, setBreakdown] = useState({
    totalIncome: 0,
    netIncome: 0,
    sideIncome: 0,
    totalExpenses: 0,
    monthlyExpenses: 0,
    planContributions: 0,
  });

  const { data: plans } = useSWR("/financial-plans", financialPlansFetcher);

  const colors = {
    primary: "#0A2540",
    success: "#10B981",
    danger: "#EF4444",
    warning: "#F59E0B",
    accent: "#00D4FF",
    surface: "#FFFFFF",
  };

  useEffect(() => {
    fetchCashFlowData();
  }, [plans]);

  const fetchCashFlowData = async () => {
    setLoading(true);
    try {
      const response = await getFinancialSnapshot();
      const data = response.data;

      const netIncome = data.net_income || 0;
      const sideIncome = data.side_income || 0;
      const totalIncome = netIncome + sideIncome;

      const planContributions = plans
        ? plans.reduce((sum, plan) => sum + (plan.monthly_contribution || 0), 0)
        : 0;

      const monthlyExpenses = data.monthly_expenses || 0;
      const totalExpenses = monthlyExpenses + planContributions;
      const netCashFlow = totalIncome - totalExpenses;

      setCashFlow(netCashFlow);
      setBreakdown({
        totalIncome,
        netIncome,
        sideIncome,
        totalExpenses,
        monthlyExpenses,
        planContributions,
      });
    } catch (err) {
      console.error("Failed to fetch cash flow data:", err);
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
        color: colors.success,
        icon: <TrendingUp sx={{ fontSize: 18 }} />,
        label: "Surplus",
        bgColor: alpha(colors.success, 0.1),
      };
    } else if (cashFlow < 0) {
      return {
        color: colors.danger,
        icon: <TrendingDown sx={{ fontSize: 18 }} />,
        label: "Deficit",
        bgColor: alpha(colors.danger, 0.1),
      };
    } else {
      return {
        color: colors.warning,
        icon: <ShowChart sx={{ fontSize: 18 }} />,
        label: "Neutral",
        bgColor: alpha(colors.warning, 0.1),
      };
    }
  };

  const status = getCashFlowStatus();

  if (loading) {
    return (
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid #f1f5f9",
          bgcolor: colors.surface,
          height: "100%",
          minHeight: 140,
          cursor: "wait",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress
            size={28}
            thickness={5}
            sx={{ color: colors.accent }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5 }}>
            Loading...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card
        onClick={() => setModalOpen(true)}
        sx={{
          borderRadius: 3,
          boxShadow: "0 8px 16px -6px rgba(10, 37, 64, 0.12)",
          border: "1px solid #f1f5f9",
          bgcolor: colors.surface,
          height: "100%",
          minHeight: 140,
          width: "300px",

          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 20px 32px -8px rgba(10, 37, 64, 0.2)",
            borderColor: colors.accent,
          },
          "&:active": {
            transform: "translateY(-2px)",
          },
        }}
      >
        {/* Background Pattern */}

        {/* Dynamic Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            right: -15,
            top: -15,
            width: 160,
            height: 160,
            background: `radial-gradient(circle at center, ${alpha(
              status.color,
              0.12
            )} 0%, transparent 70%)`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 0,
          }}
        >
          <AccountBalanceWallet
            sx={{
              fontSize: 100,
              color: status.color,
              opacity: 0.08,
              transform: "rotate(-15deg)",
            }}
          />
        </Box>

        {/* Subtle Grid Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.03,
            backgroundImage: `linear-gradient(${colors.primary} 1px, transparent 1px), linear-gradient(90deg, ${colors.primary} 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
            zIndex: 0,
          }}
        />

        <CardContent
          sx={{
            p: 2.5,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Header */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={1.5}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 50,
                  height: 30,
                  borderRadius: "8px",
                  bgcolor: alpha(status.color, 0.1),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {status.icon}
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  sx={{ color: colors.primary, fontSize: "0.7rem" }}
                >
                  Cash Flow
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.65rem",
                    lineHeight: 1,
                  }}
                >
                  Monthly
                </Typography>
              </Box>
            </Box>

            <Chip
              label={status.label}
              size="small"
              sx={{
                height: 18,
                fontSize: "0.6rem",
                fontWeight: 800,
                bgcolor: status.bgColor,
                color: status.color,
              }}
            />
          </Box>

          {/* Amount - Large and Prominent */}
          <Box
            flex={1}
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Typography
              variant="h5"
              fontWeight={900}
              sx={{
                color: colors.primary,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                mb: 0.5,
              }}
            >
              {cashFlow < 0 ? "-" : "+"}
              {formatCurrency(cashFlow)}
            </Typography>

            {/* Status Indicator */}
            <Box display="flex" alignItems="center" gap={0.75}>
              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ color: status.color }}
              >
                {status.label}
              </Typography>
              <Chip
                label={`${formatCurrency(Math.abs(cashFlow * 12))}/yr`}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  bgcolor: alpha(status.color, 0.12),
                  color: status.color,
                }}
              />
            </Box>
          </Box>

          {/* Footer Hint */}
          <Box
            sx={{
              pt: 1.5,
              mt: 1.5,
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: colors.accent,
                fontWeight: 600,
                fontSize: "0.65rem",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <ShowChart sx={{ fontSize: 12 }} />
              Click for detailed view →
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <CashFlowModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        cashFlow={cashFlow}
        breakdown={breakdown}
      />
    </>
  );
}
