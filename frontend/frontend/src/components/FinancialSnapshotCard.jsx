import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Stack,
  alpha,
} from "@mui/material";
import {
  AccountBalanceWallet,
  ShoppingCart,
  Savings,
  TrendingUp,
  CreditCard,
  AttachMoney,
  Edit,
  Cake,
} from "@mui/icons-material";
import { getFinancialSnapshot } from "../api/financialSnapshot";
import UpdateSnapshotModal from "./UpdateSnapshotModal";

export default function FinancialSnapshotCard() {
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const colors = {
    primary: "#0A2540",
    accent: "#00D4FF",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    border: "#f1f5f9",
    surface: "#FFFFFF",
    softBg: "#F8FAFC",
  };

  useEffect(() => {
    fetchSnapshot();
  }, []);

  const fetchSnapshot = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getFinancialSnapshot();
      setSnapshot(response.data);
    } catch (err) {
      setError("Failed to load financial data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSuccess = () => {
    setModalOpen(false);
    fetchSnapshot();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatValue = (item) => {
  if (item.label === "Current Age") {
    return item.value;  // Don't format age as currency
  }
  return formatCurrency(item.value);
};

  const snapshotItems = [
    {
      icon: <Cake sx={{ fontSize: 20 }} />, // Import Cake from @mui/icons-material
      label: "Current Age",
      value: snapshot?.age ?? "—",
      suffix: "years",
      color: colors.accent,
    },
    {
      icon: <AccountBalanceWallet sx={{ fontSize: 20 }} />,
      label: "Net Income",
      value: snapshot?.net_income || 0,
      suffix: "/mo",
      color: colors.success,
    },
    {
      icon: <ShoppingCart sx={{ fontSize: 20 }} />,
      label: "Expenses",
      value: snapshot?.monthly_expenses || 0,
      suffix: "/mo",
      color: colors.danger,
    },
    {
      icon: <Savings sx={{ fontSize: 20 }} />,
      label: "Savings",
      value: snapshot?.savings || 0,
      color: colors.warning,
    },
    {
      icon: <TrendingUp sx={{ fontSize: 20 }} />,
      label: "Investments",
      value: snapshot?.investments || 0,
      color: colors.accent,
    },
    {
      icon: <CreditCard sx={{ fontSize: 20 }} />,
      label: "Total Debt",
      value: snapshot?.debt || 0,
      color: colors.danger,
    },
    {
      icon: <AttachMoney sx={{ fontSize: 20 }} />,
      label: "Side Income",
      value: snapshot?.side_income || 0,
      suffix: "/mo",
      color: colors.success,
    },
  ];

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

  return (
    <>
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 12px 24px -10px rgba(10, 37, 64, 0.1)",
          border: `1px solid ${colors.border}`,
          bgcolor: colors.surface,
          overflow: "visible",
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          {/* Header Section */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
            mb={4}
          >
            <Box>
              <Typography
                variant="h6"
                fontWeight={800}
                sx={{
                  color: colors.primary,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                Financial Snapshot
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mt: 0.5 }}
              >
                Real-time overview of your assets and liabilities
              </Typography>
            </Box>
            <Button
              onClick={() => setModalOpen(true)}
              variant="contained"
              disableElevation
              startIcon={<Edit sx={{ fontSize: 16 }} />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                bgcolor: colors.primary,
                px: 3,
                "&:hover": { bgcolor: "#1a365d" },
              }}
            >
              Update
            </Button>
          </Stack>

          {error && (
            <Alert
              severity="error"
              variant="outlined"
              sx={{ mb: 3, borderRadius: 2 }}
            >
              {error}
            </Alert>
          )}

          {/* Responsive Grid Layout */}
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
            gap={2}
          >
            {snapshotItems.map((item, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: colors.softBg,
                  border: "1px solid transparent",
                  transition: "all 0.2s ease-in-out",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  "&:hover": {
                    bgcolor: "#FFFFFF",
                    borderColor: alpha(item.color, 0.3),
                    boxShadow: `0 8px 16px ${alpha(item.color, 0.08)}`,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    bgcolor: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                    color: item.color,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 400,
                      textTransform: "uppercase",
                      fontSize: 10,
                      letterSpacing: "0.05em",
                      display: "block",
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Box display="flex" alignItems="baseline" gap={0.5}>
                    <Typography
                      variant="body1"
                      fontWeight={800}
                      sx={{
                        color: colors.primary,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {formatValue(item)}
                      
                    </Typography>
                    {item.suffix && (
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        color="text.secondary"
                      >
                        {item.suffix}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        </CardContent>
      </Card>

      <UpdateSnapshotModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        currentData={snapshot}
        onSuccess={handleUpdateSuccess}
      />
    </>
  );
}
