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
  LinearProgress,
  Chip,
  Alert,
} from "@mui/material";
import {
  Close,
  TrendingUp,
  TrendingDown,
  Speed,
  Timeline,
  Assessment,
  EmojiEvents,
   InfoOutlined,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
 
} from "recharts";

export default function WealthVelocityModal({ open, onClose, data }) {
  const colors = {
    success: "#10B981",
    danger: "#EF4444",
    warning: "#F59E0B",
    accent: "#00D4FF",
    primary: "#0A2540",
    purple: "#8B5CF6",
  };

  if (!data) return null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  {data.stage_specific_message && (
  <Alert severity="info" sx={{ mb: 3 }}>
    {data.stage_specific_message}
  </Alert>
)}

// Replace recommendations section:
{data.recommendations && data.recommendations.length > 0 && (
  <Paper sx={{ p: 2.5, mt: 3 }}>
    <Typography variant="h6" fontWeight={700} gutterBottom>
      Recommendations
    </Typography>
    {data.recommendations.map((rec, idx) => (
      <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
        • {rec}
      </Typography>
    ))}
  </Paper>
)}

  // Projection data for line chart
  const projectionData = [
    { year: "Current", value: data.projections.one_year / 1.142 },
    { year: "1 Year", value: data.projections.one_year },
    { year: "3 Years", value: data.projections.three_years },
    { year: "5 Years", value: data.projections.five_years },
    { year: "10 Years", value: data.projections.ten_years },
  ];

  // Benchmark comparison radar chart
  const benchmarkData = [
    {
      metric: "Velocity",
      value: Math.min((data.velocity / 15) * 100, 100),
      fullMark: 100,
    },
    {
      metric: "Momentum",
      value:
        data.momentum === "explosive"
          ? 100
          : data.momentum === "strong"
          ? 80
          : data.momentum === "moderate"
          ? 60
          : data.momentum === "weak"
          ? 40
          : 20,
      fullMark: 100,
    },
    {
      metric: "Acceleration",
      value: data.acceleration.status === "accelerating" ? 80 : data.acceleration.status === "stable" ? 50 : 20,
      fullMark: 100,
    },
    {
      metric: "Percentile",
      value: data.percentile,
      fullMark: 100,
    },
    {
      metric: "Real Growth",
      value: Math.min((data.real_velocity / 12) * 100, 100),
      fullMark: 100,
    },
  ];

  // Monthly wealth gain breakdown
  const monthlyGainData = [
    {
      month: "Investment Returns",
      amount: data.metrics.monthly_wealth_gain * 0.6,
      fill: colors.accent,
    },
    {
      month: "Contributions",
      amount: data.metrics.monthly_wealth_gain * 0.4,
      fill: colors.success,
    },
  ];

  const velocityColor =
    data.velocity >= 12
      ? colors.success
      : data.velocity >= 5
      ? colors.accent
      : data.velocity >= 0
      ? colors.warning
      : colors.danger;

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
          {payload[0].payload.year || payload[0].name}
        </Typography>
        <Typography variant="body2" color={velocityColor}>
          {formatCurrency(payload[0].value)}
        </Typography>
      </Paper>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: "#f8fafc",
          backgroundImage:
            "linear-gradient(to bottom right, #f8fafc 0%, #e2e8f0 100%)",
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
          <Speed sx={{ fontSize: 150, color: "white" }} />
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          position="relative"
          zIndex={1}
        >
          <Box>
            
            <Typography variant="h5" fontWeight={800} color="white" gutterBottom>
              Wealth Velocity Analysis
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              Detailed breakdown of your wealth accumulation rate and projections
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

      <DialogContent sx={{ p: 3 }}>
        
        
          {/* FOUNDATION STAGE WARNING - Show prominently */}
          {data.velocity_warning && data.velocity_warning.show && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha('#F59E0B', 0.1)} 0%, ${alpha('#F59E0B', 0.05)} 100%)`,
                border: `2px solid ${alpha('#F59E0B', 0.3)}`,
              }}
            >
              <Box display="flex" alignItems="flex-start" gap={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    bgcolor: alpha('#F59E0B', 0.15),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <InfoOutlined sx={{ fontSize: 28, color: '#F59E0B' }} />
                </Box>
                <Box flex={1}>
                  <Typography variant="h6" fontWeight={800} color="#92400E" gutterBottom>
                    Focus on Dollar Amounts, Not Percentages
                  </Typography>
                  <Typography variant="body2" color="#78350F" sx={{ mb: 2 }}>
                    {data.velocity_warning.message}
                  </Typography>
                  {data.metrics.annual_dollar_growth && (
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: alpha('#F59E0B', 0.1),
                        borderRadius: 2,
                        mt: 2,
                      }}
                    >
                      <Typography variant="caption" color="#78350F" fontWeight={700} display="block">
                        WHAT REALLY MATTERS:
                      </Typography>
                      <Typography variant="h5" fontWeight={900} color="#92400E">
                        ${formatCurrency(data.metrics.annual_dollar_growth)}/year
                      </Typography>
                      <Typography variant="caption" color="#78350F">
                        Absolute wealth gain • {data.metrics.savings_rate?.toFixed(1)}% savings rate
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Paper>
          )}

          {/* Stage-specific message */}
          {data.stage_specific_message && (
            <Alert 
              severity="info" 
              icon={<Assessment />}
              sx={{ 
                borderRadius: 2,
                '& .MuiAlert-message': { width: '100%' }
              }}
            >
              <Typography variant="body2">{data.stage_specific_message}</Typography>
            </Alert>
          )}

          {/* Key Metrics Row */}
        <Stack spacing={3}>
          {/* Key Metrics Row */}
          <Grid container spacing={2}>
            {/* Wealth Velocity */}
            <Grid item xs={12} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(
                    velocityColor,
                    0.1
                  )} 0%, ${alpha(velocityColor, 0.05)} 100%)`,
                  border: `2px solid ${alpha(velocityColor, 0.3)}`,
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
                  {data.trend === "up" ? (
                    <TrendingUp sx={{ fontSize: 80, color: velocityColor }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 80, color: velocityColor }} />
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
                  Wealth Velocity
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight={900}
                  sx={{ color: velocityColor, mt: 1 }}
                >
                  {formatPercentage(data.velocity)}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    mt: 0.5,
                    display: "block",
                  }}
                >
                  Annual wealth growth rate
                </Typography>
              </Paper>
            </Grid>

            {/* Real Velocity (Inflation Adjusted) */}
            <Grid item xs={12} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(
                    colors.accent,
                    0.1
                  )} 0%, ${alpha(colors.accent, 0.05)} 100%)`,
                  border: `2px solid ${alpha(colors.accent, 0.3)}`,
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
                  Real Growth
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight={900}
                  sx={{ color: colors.accent, mt: 1 }}
                >
                  {formatPercentage(data.real_velocity)}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: colors.accent,
                    mt: 0.5,
                    display: "block",
                    fontWeight: 600,
                  }}
                >
                  After inflation ({formatPercentage(3)})
                </Typography>
              </Paper>
            </Grid>

            {/* Percentile Ranking */}
            <Grid item xs={12} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(
                    colors.purple,
                    0.1
                  )} 0%, ${alpha(colors.purple, 0.05)} 100%)`,
                  border: `2px solid ${alpha(colors.purple, 0.3)}`,
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
                  Percentile
                </Typography>
                <Box display="flex" alignItems="baseline" gap={0.5} mt={1}>
                  <Typography variant="h4" fontWeight={900} sx={{ color: colors.purple }}>
                    {data.percentile}
                  </Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ color: colors.purple }}>
                    th
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    mt: 0.5,
                    display: "block",
                  }}
                >
                  {data.benchmark.description}
                </Typography>
              </Paper>
            </Grid>

            {/* Monthly Wealth Gain */}
            <Grid item xs={12} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(
                    colors.success,
                    0.1
                  )} 0%, ${alpha(colors.success, 0.05)} 100%)`,
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
                  Monthly Gain
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight={900}
                  sx={{ color: colors.success, mt: 1 }}
                >
                  {formatCurrency(data.metrics.monthly_wealth_gain)}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: colors.success,
                    mt: 0.5,
                    display: "block",
                    fontWeight: 600,
                  }}
                >
                  {formatCurrency(data.metrics.annual_wealth_gain)}/year
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Benchmark Status Card */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(
                data.benchmark.color,
                0.05
              )} 0%, ${alpha(data.benchmark.color, 0.02)} 100%)`,
              border: `1px solid ${alpha(data.benchmark.color, 0.2)}`,
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                  <EmojiEvents sx={{ fontSize: 28, color: data.benchmark.color }} />
                  <Typography variant="h6" fontWeight={800}>
                    {data.benchmark.category} Performance
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {data.benchmark.description}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                  Momentum: <Chip label={data.momentum.toUpperCase()} size="small" sx={{ 
                    ml: 0.5, 
                    height: 20, 
                    fontSize: "0.7rem",
                    bgcolor: alpha(data.benchmark.color, 0.15),
                    color: data.benchmark.color
                  }} />
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  bgcolor: alpha(data.benchmark.color, 0.15),
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: data.benchmark.color,
                }}
              >
                <Typography variant="h5" fontWeight={900}>
                  {data.percentile}
                </Typography>
                <Typography variant="caption" fontWeight={600}>
                  %ile
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Charts Section */}
          <Grid container spacing={3}>
            {/* Wealth Projection Chart */}
            <Grid item xs={12} md={8}>
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
                  <Timeline sx={{ mr: 1, verticalAlign: "middle" }} />
                  Wealth Projection at Current Velocity
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={projectionData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={velocityColor} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={velocityColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="year"
                      tick={{ fontSize: 12, fontWeight: 600 }}
                      stroke="#6b7280"
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => formatCurrency(value)}
                      stroke="#6b7280"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={velocityColor}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <Box mt={2} p={2} bgcolor="#f9fafb" borderRadius={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        5-Year Projection
                      </Typography>
                      <Typography variant="body1" fontWeight={700}>
                        {formatCurrency(data.projections.five_years)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        10-Year Projection
                      </Typography>
                      <Typography variant="body1" fontWeight={700}>
                        {formatCurrency(data.projections.ten_years)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>

            {/* Performance Radar Chart */}
            <Grid item xs={12} md={4}>
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
                  <Assessment sx={{ mr: 1, verticalAlign: "middle" }} />
                  Performance Metrics
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={benchmarkData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis
                      dataKey="metric"
                      tick={{ fontSize: 11, fontWeight: 600 }}
                      stroke="#6b7280"
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fontSize: 10 }}
                      stroke="#6b7280"
                    />
                    <Radar
                      name="Your Performance"
                      dataKey="value"
                      stroke={velocityColor}
                      fill={velocityColor}
                      fillOpacity={0.5}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>

          {/* Key Insights */}
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
              Key Insights
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Box p={2} bgcolor="#f0f9ff" borderRadius={2}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    DOUBLING TIME
                  </Typography>
                  <Typography variant="h6" fontWeight={800} color={colors.accent}>
                    {data.metrics.years_to_double
                      ? `${data.metrics.years_to_double} years`
                      : "N/A"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    At current velocity, your wealth doubles every{" "}
                    {data.metrics.years_to_double || "N/A"} years
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box p={2} bgcolor="#f0fdf4" borderRadius={2}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    INCOME VELOCITY RATIO
                  </Typography>
                  <Typography variant="h6" fontWeight={800} color={colors.success}>
                    {data.income_velocity_ratio.toFixed(0)}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Wealth growing at {data.income_velocity_ratio.toFixed(0)}% of your income
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box p={2} bgcolor="#fef3c7" borderRadius={2}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    ACCELERATION STATUS
                  </Typography>
                  <Typography variant="h6" fontWeight={800} color={colors.warning}>
                    {data.acceleration.status.toUpperCase()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {data.acceleration.trend === "improving"
                      ? "Velocity is increasing"
                      : data.acceleration.trend === "declining"
                      ? "Velocity is decreasing"
                      : "Maintaining steady pace"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}