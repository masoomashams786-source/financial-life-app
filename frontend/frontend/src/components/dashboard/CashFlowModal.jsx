import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Grid,
  Paper,
  Stack,
  alpha,
  Divider,
} from "@mui/material";
import { Close, TrendingUp, TrendingDown, AccountBalanceWallet } from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export default function CashFlowModal({ open, onClose, cashFlow, breakdown }) {
  const colors = {
    success: "#10B981",
    danger: "#EF4444",
    warning: "#F59E0B",
    accent: "#00D4FF",
    primary: "#0A2540",
    purple: "#8B5CF6",
    orange: "#F59E0B",
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value));
  };

  const status = cashFlow > 0 ? "surplus" : cashFlow < 0 ? "deficit" : "neutral";
  const statusColor = status === "surplus" ? colors.success : status === "deficit" ? colors.danger : colors.warning;

  // Income breakdown data for pie chart
  const incomeData = [
    { name: "Net Income", value: breakdown.netIncome, color: colors.accent },
    { name: "Side Income", value: breakdown.sideIncome, color: colors.purple },
  ].filter(item => item.value > 0);

  // Expense breakdown data for pie chart
  const expenseData = [
    { name: "Monthly Expenses", value: breakdown.monthlyExpenses, color: colors.danger },
    { name: "Plan Contributions", value: breakdown.planContributions, color: colors.orange },
  ].filter(item => item.value > 0);

  // Annual comparison data for bar chart
  const annualData = [
    {
      category: "Income",
      amount: breakdown.totalIncome * 12,
      fill: colors.success,
    },
    {
      category: "Expenses",
      amount: breakdown.totalExpenses * 12,
      fill: colors.danger,
    },
    {
      category: "Net Flow",
      amount: Math.abs(cashFlow * 12),
      fill: statusColor,
    },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <Paper
        elevation={3}
        sx={{
          p: 1.5,
          bgcolor: "rgba(255, 255, 255, 0.98)",
          border: "1px solid #e0e0e0",
        }}
      >
        <Typography variant="body2" fontWeight={600}>
          {payload[0].name}
        </Typography>
        <Typography variant="body2" color={payload[0].fill}>
          {formatCurrency(payload[0].value)}
        </Typography>
      </Paper>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: "#f8fafc",
          backgroundImage: "linear-gradient(to bottom right, #f8fafc 0%, #e2e8f0 100%)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, #1e3a8a 100%)`,
          p: 5,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            right: -30,
            top: -30,
            opacity: 0.1,
          }}
        >
          <AccountBalanceWallet sx={{ fontSize: 150, color: "white" }} />
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="flex-start" position="relative" zIndex={1}>
          <Box>
            <Typography variant="h5" fontWeight={800} color="white" gutterBottom>
              Cash Flow Analysis
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
              Detailed breakdown of your monthly and annual cash flow
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: "white",
              bgcolor: "rgba(255, 255, 255, 0.1)",
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </Box>

      <DialogContent sx={{  p: 3, position: "relative", zIndex: 3,display: "flex",
    justifyContent: "center" }}>
        <Stack spacing={8}>
          {/* Summary Cards */}
          <Grid container spacing={2}>
            {/* Monthly Cash Flow */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(statusColor, 0.1)} 0%, ${alpha(statusColor, 0.05)} 100%)`,
                  border: `2px solid ${alpha(statusColor, 0.3)}`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    right: -10,
                    bottom: -10,
                    opacity: 0.15,
                  }}
                >
                  {status === "surplus" ? (
                    <TrendingUp sx={{ fontSize: 80, color: statusColor }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 80, color: statusColor }} />
                  )}
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    fontSize: "0.7rem",
                    letterSpacing: "0.08em",
                  }}
                >
                  Monthly Cash Flow
                </Typography>
                <Typography variant="h4" fontWeight={900} sx={{ color: statusColor, mt: 1 }}>
                  {cashFlow < 0 ? "-" : "+"}
                  {formatCurrency(cashFlow)}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5, display: "block" }}>
                  {status === "surplus" ? "Building wealth" : status === "deficit" ? "Spending exceeds income" : "Breaking even"}
                </Typography>
              </Paper>
            </Grid>

            {/* Total Income */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(colors.success, 0.1)} 0%, ${alpha(colors.success, 0.05)} 100%)`,
                  border: `2px solid ${alpha(colors.success, 0.3)}`,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    fontSize: "0.7rem",
                    letterSpacing: "0.08em",
                  }}
                >
                  Total Monthly Income
                </Typography>
                <Typography variant="h4" fontWeight={900} sx={{ color: colors.success, mt: 1 }}>
                  {formatCurrency(breakdown.totalIncome)}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.success, mt: 0.5, display: "block", fontWeight: 600 }}>
                  {formatCurrency(breakdown.totalIncome * 12)} annually
                </Typography>
              </Paper>
            </Grid>

            {/* Total Expenses */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(colors.danger, 0.1)} 0%, ${alpha(colors.danger, 0.05)} 100%)`,
                  border: `2px solid ${alpha(colors.danger, 0.3)}`,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    fontSize: "0.7rem",
                    letterSpacing: "0.08em",
                  }}
                >
                  Total Monthly Expenses
                </Typography>
                <Typography variant="h4" fontWeight={900} sx={{ color: colors.danger, mt: 1 }}>
                  {formatCurrency(breakdown.totalExpenses)}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.danger, mt: 0.5, display: "block", fontWeight: 600 }}>
                  {formatCurrency(breakdown.totalExpenses * 12)} annually
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Charts Section */}
         
          <Grid container spacing={4}>
            {/* Income Breakdown Pie Chart */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: "white",
                  border: "1px solid #e5e7eb",
                  height: "100%",
                }}
              >
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Income Breakdown
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={incomeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {incomeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <Stack spacing={1} mt={2}>
                  {incomeData.map((item, idx) => (
                    <Box key={idx} display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: item.color,
                          }}
                        />
                        <Typography variant="body2">{item.name}</Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={700}>
                        {formatCurrency(item.value)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>

            {/* Expense Breakdown Pie Chart */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: "white",
                  border: "1px solid #e5e7eb",
                  height: "100%",
                }}
              >
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Expense Breakdown
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <Stack spacing={1} mt={2}>
                  {expenseData.map((item, idx) => (
                    <Box key={idx} display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: item.color,
                          }}
                        />
                        <Typography variant="body2">{item.name}</Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={700}>
                        {formatCurrency(item.value)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          {/* Annual Comparison Bar Chart */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: "white",
              border: "1px solid #e5e7eb",
            }}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Annual Cash Flow Comparison
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={annualData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 12, fontWeight: 600 }}
                  stroke="#6b7280"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  stroke="#6b7280"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>

          {/* Annual Projection Summary */}
         
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(statusColor, 0.05)} 0%, ${alpha(statusColor, 0.02)} 100%)`,
              border: `1px solid ${alpha(statusColor, 0.2)}`,
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box >
                <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>
                  Annual Projection
                </Typography>
                <Typography variant="h5" fontWeight={800} sx={{ color: statusColor }}>
                  {cashFlow < 0 ? "-" : "+"}
                  {formatCurrency(cashFlow * 12)} per year
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  bgcolor: alpha(statusColor, 0.15),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: statusColor,
                }}
              >
                {status === "surplus" ? (
                  <TrendingUp sx={{ fontSize: 32 }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 32 }} />
                )}
              </Box>
            </Box>
          </Paper>
         
        </Stack>
      </DialogContent>
    </Dialog>
  );
}