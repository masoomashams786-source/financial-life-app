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
} from "@mui/material";
import {
  AccountBalanceWallet,
  ShoppingCart,
  Savings,
  TrendingUp,
  CreditCard,
  AttachMoney,
  Edit,
} from "@mui/icons-material";
import { getFinancialSnapshot } from "../api/financialSnapshot";
import UpdateSnapshotModal from "./UpdateSnapshotModal";

export default function FinancialSnapshotCard() {
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Premium Financial Palette
  const colors = {
    primary: "#0A2540",
    accent: "#00D4FF",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    border: "rgba(0, 0, 0, 0.06)",
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

  const snapshotItems = [
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
      <Card sx={{ borderRadius: 4, border: `1px solid ${colors.border}`, boxShadow: 'none' }}>
        <CardContent sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress thickness={5} size={40} sx={{ color: colors.accent }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card
        sx={{
          borderRadius: 5,
          boxShadow: "0 20px 40px rgba(0,0,0,0.04)",
          border: `1px solid ${colors.border}`,
          overflow: "visible",
          bgcolor: colors.surface,
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          {/* Header Section */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: colors.primary, letterSpacing: "-0.5px" }}>
                Financial Snapshot
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                Real-time overview of your assets and liabilities
              </Typography>
            </Box>
            <Button
              onClick={() => setModalOpen(true)}
              variant="outlined"
              startIcon={<Edit sx={{ fontSize: 16 }} />}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 700,
                borderColor: colors.border,
                color: colors.primary,
                "&:hover": { bgcolor: colors.softBg, borderColor: colors.primary },
              }}
            >
              Update
            </Button>
          </Box>

          {error && (
            <Alert severity="error" variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Grid Layout for Items */}
          <Box 
            display="grid" 
            gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} 
            gap={2.5}
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
                  "&:hover": {
                    bgcolor: "#FFFFFF",
                    borderColor: item.color,
                    boxShadow: `0 10px 20px -10px ${item.color}30`,
                    transform: "translateY(-2px)"
                  }
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "12px",
                      bgcolor: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, textTransform: "uppercase", fontSize: 10, letterSpacing: 0.5 }}>
                      {item.label}
                    </Typography>
                    <Box display="flex" alignItems="baseline" gap={0.5}>
                      <Typography variant="h6" fontWeight={800} sx={{ color: colors.primary, lineHeight: 1.2 }}>
                        {formatCurrency(item.value)}
                      </Typography>
                      {item.suffix && (
                        <Typography variant="caption" fontWeight={600} color="text.secondary">
                          {item.suffix}
                        </Typography>
                      )}
                    </Box>
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