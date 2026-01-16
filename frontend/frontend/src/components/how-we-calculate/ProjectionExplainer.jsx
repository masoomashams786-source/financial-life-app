import { Box, Typography, Paper, Divider, Chip, Stack, Alert, Grid } from "@mui/material";
import { TrendingUp, Info, ShowChart } from "@mui/icons-material";
import ExplainerSection from "./ExplainerSection";

export default function ProjectionExplainer() {
  const colors = {
    primary: "#0A2540",
    accent: "#00D4FF",
    success: "#10B981",
    danger: "#EF4444",
    warning: "#F59E0B",
  };

  return (
    <Stack spacing={4}>
      {/* Header */}
      <Box>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: `${colors.success}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TrendingUp sx={{ fontSize: 24, color: colors.success }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={800} color={colors.primary}>
              Net Worth Projections
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Where your wealth could be in the future
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* What It Is */}
      <ExplainerSection
        title="What It Measures"
        content={
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Net Worth Projections estimate what your total wealth could look like in <strong>1, 5, 10, or 30 years</strong> if you keep saving and investing at your current pace. We show you <strong>three scenarios</strong>: best case, most likely, and worst case.
          </Typography>
        }
      />

      {/* What We Use */}
      <ExplainerSection
        title="Data We Use"
        content={
          <Stack spacing={1.5}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: colors.accent,
                }}
              />
              <Typography variant="body2">
                <strong>Your current net worth</strong> (starting point)
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: colors.accent,
                }}
              />
              <Typography variant="body2">
                <strong>Monthly savings</strong> you're contributing to investments
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: colors.accent,
                }}
              />
              <Typography variant="body2">
                <strong>Expected investment returns</strong> based on 100 years of stock market history
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: colors.accent,
                }}
              />
              <Typography variant="body2">
                <strong>Inflation rate</strong> (3% historical average)
              </Typography>
            </Box>
          </Stack>
        }
      />

      {/* The 3 Scenarios */}
      <ExplainerSection
        title="The Three Scenarios"
        content={
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  bgcolor: `${colors.success}08`,
                  border: `2px solid ${colors.success}30`,
                  borderRadius: 2,
                  height: "100%",
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                  <TrendingUp sx={{ color: colors.success, fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight={800} color={colors.success}>
                    Best Case
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 1.5 }}>
                  Markets perform well (like 2010-2020)
                </Typography>
                <Divider sx={{ mb: 1.5 }} />
                <Typography variant="caption" color="text.secondary" display="block">
                  Investment Return Rate:
                </Typography>
                <Typography variant="h6" fontWeight={700} color={colors.success}>
                  10% per year
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  bgcolor: `${colors.accent}08`,
                  border: `2px solid ${colors.accent}30`,
                  borderRadius: 2,
                  height: "100%",
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                  <ShowChart sx={{ color: colors.accent, fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight={800} color={colors.accent}>
                    Predicted
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 1.5 }}>
                  Normal market (long-term average)
                </Typography>
                <Divider sx={{ mb: 1.5 }} />
                <Typography variant="caption" color="text.secondary" display="block">
                  Investment Return Rate:
                </Typography>
                <Typography variant="h6" fontWeight={700} color={colors.accent}>
                  7% per year
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  bgcolor: `${colors.danger}08`,
                  border: `2px solid ${colors.danger}30`,
                  borderRadius: 2,
                  height: "100%",
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                  <ShowChart sx={{ color: colors.danger, fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight={800} color={colors.danger}>
                    Worst Case
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 1.5 }}>
                  Recession or bear market (like 2008)
                </Typography>
                <Divider sx={{ mb: 1.5 }} />
                <Typography variant="caption" color="text.secondary" display="block">
                  Investment Return Rate:
                </Typography>
                <Typography variant="h6" fontWeight={700} color={colors.danger}>
                  3% per year
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        }
      />

      {/* How It Works - Example */}
      <ExplainerSection
        title="How It Works (Example)"
        content={
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: "#f8fafc",
              border: "1px solid #e5e7eb",
              borderRadius: 2,
            }}
          >
            <Stack spacing={2.5}>
              <Typography variant="subtitle2" fontWeight={700} color={colors.primary}>
                Starting Point (Today):
              </Typography>

              <Box
                display="grid"
                gridTemplateColumns="1fr auto"
                gap={1}
                sx={{ bgcolor: "white", p: 2, borderRadius: 1 }}
              >
                <Typography variant="body2">Current net worth:</Typography>
                <Typography variant="body2" fontWeight={700}>
                  $50,000
                </Typography>

                <Typography variant="body2">Monthly savings:</Typography>
                <Typography variant="body2" fontWeight={700}>
                  $500
                </Typography>

                <Typography variant="body2">Annual savings:</Typography>
                <Typography variant="body2" fontWeight={700}>
                  $6,000/year
                </Typography>
              </Box>

              <Divider />

              <Typography variant="subtitle2" fontWeight={700} color={colors.primary}>
                10-Year Projection:
              </Typography>

              <Stack spacing={2}>
                {/* Best Case */}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "white",
                    borderRadius: 1,
                    border: `2px solid ${colors.success}30`,
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Chip
                      label="Best Case (10% returns)"
                      size="small"
                      sx={{
                        bgcolor: `${colors.success}15`,
                        color: colors.success,
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Year 1: $50,000 grows to $55,000, plus $6,000 saved = $61,000
                    <br />
                    Year 2: $61,000 grows to $67,100, plus $6,000 saved = $73,100
                    <br />
                    ... (continues for 10 years)
                  </Typography>
                  <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #e5e7eb" }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Net Worth After 10 Years:
                    </Typography>
                    <Typography variant="h5" fontWeight={900} color={colors.success}>
                      $156,000
                    </Typography>
                  </Box>
                </Box>

                {/* Predicted Case */}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "white",
                    borderRadius: 1,
                    border: `2px solid ${colors.accent}30`,
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Chip
                      label="Predicted (7% returns)"
                      size="small"
                      sx={{
                        bgcolor: `${colors.accent}15`,
                        color: colors.accent,
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Same calculation, but with 7% annual returns instead of 10%
                  </Typography>
                  <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #e5e7eb" }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Net Worth After 10 Years:
                    </Typography>
                    <Typography variant="h5" fontWeight={900} color={colors.accent}>
                      $139,000
                    </Typography>
                  </Box>
                </Box>

                {/* Worst Case */}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "white",
                    borderRadius: 1,
                    border: `2px solid ${colors.danger}30`,
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Chip
                      label="Worst Case (3% returns)"
                      size="small"
                      sx={{
                        bgcolor: `${colors.danger}15`,
                        color: colors.danger,
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Same calculation, but with only 3% annual returns (recession scenario)
                  </Typography>
                  <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #e5e7eb" }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Net Worth After 10 Years:
                    </Typography>
                    <Typography variant="h5" fontWeight={900} color={colors.danger}>
                      $118,000
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Stack>
          </Paper>
        }
      />

      {/* What You See */}
      <ExplainerSection
        title="What You See in Your Dashboard"
        content={
          <Stack spacing={2}>
            <Box>
              <Chip
                label="Line Chart"
                size="small"
                sx={{
                  bgcolor: `${colors.accent}15`,
                  color: colors.accent,
                  fontWeight: 700,
                  mb: 1,
                }}
              />
              <Typography variant="body2">
                A graph showing three lines (best, predicted, worst) plotting your net worth from today through retirement age.
              </Typography>
            </Box>

            <Box>
              <Chip
                label="Year-by-Year Breakdown"
                size="small"
                sx={{
                  bgcolor: `${colors.primary}15`,
                  color: colors.primary,
                  fontWeight: 700,
                  mb: 1,
                }}
              />
              <Typography variant="body2">
                Detailed table showing your net worth, income, expenses, and savings for each year.
              </Typography>
            </Box>

            <Box>
              <Chip
                label="Retirement Income"
                size="small"
                sx={{
                  bgcolor: `${colors.success}15`,
                  color: colors.success,
                  fontWeight: 700,
                  mb: 1,
                }}
              />
              <Typography variant="body2">
                Estimated monthly income you could withdraw in retirement using the <strong>4% rule</strong> (industry standard: withdraw 4% of your portfolio annually).
              </Typography>
            </Box>

            <Box>
              <Chip
                label="Milestone Tracking"
                size="small"
                sx={{
                  bgcolor: `${colors.warning}15`,
                  color: colors.warning,
                  fontWeight: 700,
                  mb: 1,
                }}
              />
              <Typography variant="body2">
                When you'll hit key milestones like becoming debt-free, reaching $100K, $500K, or $1M net worth.
              </Typography>
            </Box>
          </Stack>
        }
      />

      {/* Why These Numbers */}
      <ExplainerSection
        title="Where These Return Rates Come From"
        content={
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: "#f8fafc",
              border: "1px solid #e5e7eb",
              borderRadius: 2,
            }}
          >
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  📊 Historical Data (1926-2024)
                </Typography>
                <Typography variant="body2">
                  • S&P 500 (stocks): <strong>~10% average annual return</strong>
                  <br />• Bonds: <strong>~5% average annual return</strong>
                  <br />• Balanced portfolio (60/40): <strong>~7% average</strong>
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  🔄 Why We Show Three Scenarios
                </Typography>
                <Typography variant="body2">
                  Markets don't go up 7% every year. Some years are +30%, others are -20%. Over long periods (10+ years), it averages out to ~7%. We show you:
                  <br />• <strong>Best:</strong> Above-average markets
                  <br />• <strong>Predicted:</strong> Historical average
                  <br />• <strong>Worst:</strong> Below-average or recessionary markets
                </Typography>
              </Box>
            </Stack>
          </Paper>
        }
      />

      {/* Important Notes */}
      <Alert
        severity="warning"
        icon={<Info />}
        sx={{
          borderRadius: 2,
          bgcolor: `${colors.warning}08`,
          border: `1px solid ${colors.warning}30`,
          "& .MuiAlert-icon": {
            color: colors.warning,
          },
        }}
      >
        <Typography variant="body2" fontWeight={600} gutterBottom>
          Critical Disclaimer
        </Typography>
        <Typography variant="body2">
          • These are <strong>estimates based on historical averages</strong>, not guarantees
          <br />
          • Your actual returns <strong>will vary</strong> year to year (sometimes +20%, sometimes -10%)
          <br />
          • Past performance does NOT guarantee future results
          <br />
          • Market crashes, recessions, and bull markets all affect final outcomes
          <br />
          • This is <strong>educational modeling</strong>, not financial advice or a promise
          <br />• Think of these as "what could happen IF you stay consistent" scenarios
        </Typography>
      </Alert>
    </Stack>
  );
}