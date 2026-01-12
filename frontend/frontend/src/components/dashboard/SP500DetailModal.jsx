import React, { useState } from "react";
import useSWR from "swr";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  alpha,
  Slide,
} from "@mui/material";
import {
  Close,
  TrendingUp,
  TrendingDown,
  Refresh,
  ShowChart,
  InfoOutlined,
  Warning,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { sp500Fetcher } from "../../api/sp500";

// Slide up transition
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * SP500DetailModal - Full-featured modal with chart and statistics
 * @param {boolean} open - Modal open state
 * @param {function} onClose - Close handler
 * @param {object} currentData - Current S&P 500 data from parent
 */
export default function SP500DetailModal({ open, onClose, currentData }) {
  const [period, setPeriod] = useState("1mo");

  const colors = {
    primary: "#0A2540",
    success: "#10B981",
    danger: "#EF4444",
    accent: "#00D4FF",
    neutral: "#64748b",
    chartLine: "#00D4FF",
  };

  // Fetch historical data only when modal is open
  const {
    data: historicalData,
    error: historicalError,
    isLoading: historicalLoading,
    mutate: refreshHistorical,
  } = useSWR(
    open ? `/sp500/historical?period=${period}&interval=1d` : null,
    sp500Fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000,
      shouldRetryOnError: true,
      errorRetryCount: 2,
    }
  );

  const handlePeriodChange = (event, newPeriod) => {
    if (newPeriod !== null) {
      setPeriod(newPeriod);
    }
  };

  const handleRefresh = () => {
    refreshHistorical();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
  };

  const getMarketStatusChip = (status) => {
    const statusConfig = {
      open: { label: "Market Open", color: colors.success, bgcolor: alpha(colors.success, 0.1) },
      closed: { label: "Market Closed", color: colors.neutral, bgcolor: alpha(colors.neutral, 0.1) },
      pre_market: { label: "Pre-Market", color: colors.accent, bgcolor: alpha(colors.accent, 0.1) },
      post_market: { label: "After Hours", color: colors.accent, bgcolor: alpha(colors.accent, 0.1) },
    };

    const config = statusConfig[status] || statusConfig.closed;

    return (
      <Chip
        label={config.label}
        size="small"
        sx={{
          bgcolor: config.bgcolor,
          color: config.color,
          fontWeight: 700,
          fontSize: "0.75rem",
          height: 24,
          borderRadius: 1.5,
        }}
      />
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <Box
        sx={{
          bgcolor: "white",
          p: 1.5,
          border: "1px solid #e0e0e0",
          borderRadius: 1.5,
          boxShadow: 3,
        }}
      >
        <Typography variant="caption" display="block" fontWeight={600} mb={0.5}>
          {payload[0].payload.date}
        </Typography>
        <Typography variant="caption" display="block" color={colors.accent} fontWeight={600}>
          Close: {formatCurrency(payload[0].value)}
        </Typography>
      </Box>
    );
  };

  if (!currentData) return null;

  const isPositive = currentData?.change >= 0;
  const isMockData = currentData?.mock === true;
  const isStaleData = currentData?.stale === true;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            pb: 2,
            borderBottom: "1px solid #f0f0f0",
            bgcolor: alpha(colors.primary, 0.02),
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Box display="flex" alignItems="center" gap={1.5} mb={0.5}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    bgcolor: alpha(colors.accent, 0.12),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ShowChart sx={{ fontSize: 22, color: colors.accent }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={800} sx={{ color: colors.primary, letterSpacing: "-0.01em" }}>
                    S&P 500 Index
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {currentData?.ticker} • US Market Benchmark
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              {currentData?.market_status && getMarketStatusChip(currentData.market_status)}
              <Tooltip title="Refresh data">
                <IconButton size="small" onClick={handleRefresh} sx={{ color: colors.neutral }}>
                  <Refresh fontSize="small" />
                </IconButton>
              </Tooltip>
              <IconButton onClick={onClose} size="small" sx={{ color: colors.neutral }}>
                <Close fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Warning for mock/stale data */}
          {(isMockData || isStaleData) && (
            <Alert
              severity="info"
              variant="outlined"
              sx={{ mt: 2, borderRadius: 2, fontSize: "0.8rem", py: 0.5 }}
              icon={<Warning sx={{ fontSize: 18 }} />}
            >
              {isMockData
                ? "⚠️ Displaying sample data - Live data temporarily unavailable"
                : "📊 Showing cached data - Will update when market reopens"}
            </Alert>
          )}
        </Box>

        {/* Current Price Section */}
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography
            variant="h3"
            fontWeight={900}
            sx={{
              color: colors.primary,
              letterSpacing: "-0.02em",
              mb: 1,
            }}
          >
            {formatCurrency(currentData?.current_price || 0)}
          </Typography>

          <Box display="flex" alignItems="center" gap={1.5}>
            {isPositive ? (
              <TrendingUp sx={{ fontSize: 24, color: colors.success }} />
            ) : (
              <TrendingDown sx={{ fontSize: 24, color: colors.danger }} />
            )}
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ color: isPositive ? colors.success : colors.danger }}
            >
              {formatCurrency(Math.abs(currentData?.change || 0))}
            </Typography>
            <Chip
              label={formatPercent(currentData?.percent_change || 0)}
              sx={{
                height: 28,
                fontSize: "0.85rem",
                fontWeight: 700,
                bgcolor: isPositive ? alpha(colors.success, 0.12) : alpha(colors.danger, 0.12),
                color: isPositive ? colors.success : colors.danger,
              }}
            />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Previous Close: <strong>{formatCurrency(currentData?.previous_close || 0)}</strong>
          </Typography>
        </Box>

        {/* Chart Section */}
        <Box sx={{ px: 3, pb: 2 }}>
          {/* Period Selector */}
          <Box mb={2}>
            <ToggleButtonGroup
              value={period}
              exclusive
              onChange={handlePeriodChange}
              size="small"
              sx={{
                "& .MuiToggleButton-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  px: 2,
                  py: 0.75,
                  border: "1px solid #e0e0e0",
                  "&.Mui-selected": {
                    bgcolor: colors.accent,
                    color: "white",
                    "&:hover": {
                      bgcolor: colors.accent,
                    },
                  },
                },
              }}
            >
              <ToggleButton value="1mo">1 Month</ToggleButton>
              <ToggleButton value="3mo">3 Months</ToggleButton>
              <ToggleButton value="6mo">6 Months</ToggleButton>
              <ToggleButton value="1y">1 Year</ToggleButton>
              <ToggleButton value="ytd">YTD</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Chart */}
          <Box
            sx={{
              width: "100%",
              height: 300,
              bgcolor: alpha(colors.primary, 0.02),
              borderRadius: 2,
              p: 2,
            }}
          >
            {historicalLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress size={32} sx={{ color: colors.accent }} />
              </Box>
            ) : historicalError ? (
              <Alert severity="info" variant="outlined" sx={{ borderRadius: 2 }}>
                Chart temporarily unavailable - Displaying current price only
              </Alert>
            ) : historicalData?.data ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData.data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: colors.neutral }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                    stroke={colors.neutral}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: colors.neutral }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                    stroke={colors.neutral}
                    domain={["auto", "auto"]}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="close"
                    stroke={colors.chartLine}
                    strokeWidth={3}
                    dot={false}
                    animationDuration={500}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : null}
          </Box>
        </Box>

        {/* Statistics Section */}
        {historicalData?.statistics && (
          <Box sx={{ px: 3, pb: 3 }}>
            <Typography variant="subtitle2" fontWeight={700} mb={2} color={colors.primary}>
              Period Statistics
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  p: 2,
                  bgcolor: alpha(colors.success, 0.05),
                  borderRadius: 2,
                  border: `1px solid ${alpha(colors.success, 0.2)}`,
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem", fontWeight: 600 }}>
                  HIGH
                </Typography>
                <Typography variant="h6" fontWeight={800} sx={{ color: colors.success }}>
                  {formatCurrency(historicalData.statistics.high)}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  bgcolor: alpha(colors.danger, 0.05),
                  borderRadius: 2,
                  border: `1px solid ${alpha(colors.danger, 0.2)}`,
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem", fontWeight: 600 }}>
                  LOW
                </Typography>
                <Typography variant="h6" fontWeight={800} sx={{ color: colors.danger }}>
                  {formatCurrency(historicalData.statistics.low)}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  bgcolor: alpha(colors.neutral, 0.05),
                  borderRadius: 2,
                  border: `1px solid ${alpha(colors.neutral, 0.2)}`,
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem", fontWeight: 600 }}>
                  AVERAGE
                </Typography>
                <Typography variant="h6" fontWeight={800} sx={{ color: colors.neutral }}>
                  {formatCurrency(historicalData.statistics.mean)}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  bgcolor: alpha(colors.accent, 0.05),
                  borderRadius: 2,
                  border: `1px solid ${alpha(colors.accent, 0.2)}`,
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem", fontWeight: 600 }}>
                  VOLATILITY
                </Typography>
                <Typography variant="h6" fontWeight={800} sx={{ color: colors.accent }}>
                  {historicalData.statistics.volatility.toFixed(2)}%
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Footer */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderTop: "1px solid #f0f0f0",
            bgcolor: alpha(colors.primary, 0.02),
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <InfoOutlined sx={{ fontSize: 16, color: colors.neutral }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
            Data provided by Yahoo Finance • Updates every 5 minutes • Last updated: {new Date(currentData?.timestamp).toLocaleTimeString()}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}