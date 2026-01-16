import { Box, Typography, Paper, Divider, Chip, Stack, Alert, Grid, LinearProgress } from "@mui/material";
import { LocalHospital, Info, CheckCircle } from "@mui/icons-material";
import ExplainerSection from "./ExplainerSection";

export default function HealthScoreExplainer() {
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
            <LocalHospital sx={{ fontSize: 24, color: colors.success }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={800} color={colors.primary}>
              Financial Health Score
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Like a credit score, but for overall financial wellness
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* What It Is */}
      <ExplainerSection
        title="What It Measures"
        content={
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Your Financial Health Score is a <strong>0-100 rating</strong> that measures how strong your overall financial foundation is. It looks at five key areas that financial advisors use to assess financial stability.
          </Typography>
        }
      />

      {/* The 5 Categories */}
      <ExplainerSection
        title="The 5 Categories (100 Points Total)"
        content={
          <Stack spacing={2}>
            {/* Category 1 */}
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                bgcolor: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: 2,
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                <Typography variant="subtitle2" fontWeight={800} color={colors.primary}>
                  1. Emergency Fund (20 points)
                </Typography>
                <Chip
                  label="20 pts"
                  size="small"
                  sx={{
                    bgcolor: `${colors.accent}15`,
                    color: colors.accent,
                    fontWeight: 700,
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Do you have enough cash saved to cover 6 months of expenses?
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">6+ months saved:</Typography>
                    <Typography variant="caption" fontWeight={700} color={colors.success}>
                      20/20 points ✓
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">3-6 months saved:</Typography>
                    <Typography variant="caption" fontWeight={700}>15/20 points</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">1-3 months saved:</Typography>
                    <Typography variant="caption" fontWeight={700}>10/20 points</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">Less than 1 month:</Typography>
                    <Typography variant="caption" fontWeight={700} color={colors.danger}>
                      5/20 points ✗
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Paper>

            {/* Category 2 */}
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                bgcolor: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: 2,
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                <Typography variant="subtitle2" fontWeight={800} color={colors.primary}>
                  2. Debt Management (25 points)
                </Typography>
                <Chip
                  label="25 pts"
                  size="small"
                  sx={{
                    bgcolor: `${colors.accent}15`,
                    color: colors.accent,
                    fontWeight: 700,
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Is your debt low compared to your annual income?
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">No debt (debt-free):</Typography>
                    <Typography variant="caption" fontWeight={700} color={colors.success}>
                      25/25 points ✓
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">Debt &lt; 10% of income:</Typography>
                    <Typography variant="caption" fontWeight={700}>22/25 points</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">Debt 10-20% of income:</Typography>
                    <Typography variant="caption" fontWeight={700}>18/25 points</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">Debt 20-36% of income:</Typography>
                    <Typography variant="caption" fontWeight={700}>15/25 points</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">Debt &gt; 36% of income:</Typography>
                    <Typography variant="caption" fontWeight={700} color={colors.danger}>
                      8/25 points ✗
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Paper>

            {/* Category 3 */}
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                bgcolor: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: 2,
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                <Typography variant="subtitle2" fontWeight={800} color={colors.primary}>
                  3. Savings Rate (20 points)
                </Typography>
                <Chip
                  label="20 pts"
                  size="small"
                  sx={{
                    bgcolor: `${colors.accent}15`,
                    color: colors.accent,
                    fontWeight: 700,
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                What percentage of your income are you saving/investing each month?
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">Saving 40%+ of income:</Typography>
                    <Typography variant="caption" fontWeight={700} color={colors.success}>
                      20/20 points ✓ (Elite)
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">Saving 30-39%:</Typography>
                    <Typography variant="caption" fontWeight={700}>18/20 points</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">Saving 20-29%:</Typography>
                    <Typography variant="caption" fontWeight={700}>15/20 points</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">Saving 10-19%:</Typography>
                    <Typography variant="caption" fontWeight={700}>10/20 points</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">Saving less than 10%:</Typography>
                    <Typography variant="caption" fontWeight={700} color={colors.danger}>
                      5/20 points ✗
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Paper>

            {/* Category 4 */}
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                bgcolor: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: 2,
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                <Typography variant="subtitle2" fontWeight={800} color={colors.primary}>
                  4. Investment Diversification (20 points)
                </Typography>
                <Chip
                  label="20 pts"
                  size="small"
                  sx={{
                    bgcolor: `${colors.accent}15`,
                    color: colors.accent,
                    fontWeight: 700,
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Do you have multiple types of investments and retirement accounts?
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">Have taxable investments:</Typography>
                    <Typography variant="caption" fontWeight={700}>+8 points</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">Have retirement account (401k/IRA):</Typography>
                    <Typography variant="caption" fontWeight={700}>+8 points</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">Have 2+ different plan types:</Typography>
                    <Typography variant="caption" fontWeight={700}>+4 points</Typography>
                  </Box>
                </Stack>
                <Divider sx={{ my: 1.5 }} />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" fontWeight={700}>Maximum possible:</Typography>
                  <Typography variant="caption" fontWeight={700} color={colors.success}>
                    20/20 points ✓
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Category 5 */}
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                bgcolor: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: 2,
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                <Typography variant="subtitle2" fontWeight={800} color={colors.primary}>
                  5. Income Stability (15 points)
                </Typography>
                <Chip
                  label="15 pts"
                  size="small"
                  sx={{
                    bgcolor: `${colors.accent}15`,
                    color: colors.accent,
                    fontWeight: 700,
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Do you have backup income sources beyond your main job?
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">Have main income source:</Typography>
                    <Typography variant="caption" fontWeight={700}>10/15 points (base)</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">Have side income (5%+ of total):</Typography>
                    <Typography variant="caption" fontWeight={700} color={colors.success}>
                      +5 points (15/15 total) ✓
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Paper>
          </Stack>
        }
      />

      {/* Example Calculation */}
      <ExplainerSection
        title="Example: How Your Score Is Calculated"
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
                Your Financial Situation:
              </Typography>

              <Box
                sx={{
                  p: 2,
                  bgcolor: "white",
                  borderRadius: 1,
                }}
              >
                <Stack spacing={1.5}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Emergency fund:</Typography>
                    <Typography variant="body2" fontWeight={700}>
                      $18,000 (6 months expenses)
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Debt:</Typography>
                    <Typography variant="body2" fontWeight={700}>
                      $0 (debt-free)
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Savings rate:</Typography>
                    <Typography variant="body2" fontWeight={700}>
                      15% of income
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Investments:</Typography>
                    <Typography variant="body2" fontWeight={700}>
                      $30,000 in brokerage
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Retirement account:</Typography>
                    <Typography variant="body2" fontWeight={700}>
                      $20,000 in 401k
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Side income:</Typography>
                    <Typography variant="body2" fontWeight={700}>
                      None
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Divider />

              <Typography variant="subtitle2" fontWeight={700} color={colors.primary}>
                Score Breakdown:
              </Typography>

              <Stack spacing={1.5}>
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Typography variant="body2">Emergency Fund (6+ months):</Typography>
                    <Chip
                      label="20/20"
                      size="small"
                      sx={{
                        bgcolor: `${colors.success}15`,
                        color: colors.success,
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "#e5e7eb",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: colors.success,
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Typography variant="body2">Debt Management (debt-free):</Typography>
                    <Chip
                      label="25/25"
                      size="small"
                      sx={{
                        bgcolor: `${colors.success}15`,
                        color: colors.success,
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "#e5e7eb",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: colors.success,
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Typography variant="body2">Savings Rate (15%):</Typography>
                    <Chip
                      label="15/20"
                      size="small"
                      sx={{
                        bgcolor: `${colors.warning}15`,
                        color: colors.warning,
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={75}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "#e5e7eb",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: colors.warning,
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Typography variant="body2">Diversification (investments + 401k):</Typography>
                    <Chip
                      label="16/20"
                      size="small"
                      sx={{
                        bgcolor: `${colors.accent}15`,
                        color: colors.accent,
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={80}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "#e5e7eb",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: colors.accent,
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Typography variant="body2">Income Stability (no side income):</Typography>
                    <Chip
                      label="10/15"
                      size="small"
                      sx={{
                        bgcolor: `${colors.warning}15`,
                        color: colors.warning,
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={67}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "#e5e7eb",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: colors.warning,
                      },
                    }}
                  />
                </Box>
              </Stack>

              <Divider />

              <Box
                sx={{
                  p: 2.5,
                  bgcolor: `${colors.success}10`,
                  borderRadius: 2,
                  border: `2px solid ${colors.success}30`,
                }}
              >
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Total Score:
                </Typography>
                <Typography variant="h4" fontWeight={900} color={colors.success} gutterBottom>
                  86 / 100
                </Typography>
                <Chip
                  label="Excellent"
                  sx={{
                    bgcolor: colors.success,
                    color: "white",
                    fontWeight: 700,
                  }}
                />
              </Box>
            </Stack>
          </Paper>
        }
      />

      {/* Score Ratings */}
      <ExplainerSection
        title="What Your Score Means"
        content={
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: `${colors.success}08`,
                  border: `2px solid ${colors.success}30`,
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="h5" fontWeight={900} color={colors.success} gutterBottom>
                  80-100
                </Typography>
                <Chip
                  label="Excellent"
                  sx={{
                    bgcolor: colors.success,
                    color: "white",
                    fontWeight: 700,
                  }}
                />
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Strong financial foundation
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: `${colors.accent}08`,
                  border: `2px solid ${colors.accent}30`,
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="h5" fontWeight={900} color={colors.accent} gutterBottom>
                  70-79
                </Typography>
                <Chip
                  label="Good"
                  sx={{
                    bgcolor: colors.accent,
                    color: "white",
                    fontWeight: 700,
                  }}
                />
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Above average health
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: `${colors.warning}08`,
                  border: `2px solid ${colors.warning}30`,
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="h5" fontWeight={900} color={colors.warning} gutterBottom>
                  60-69
                </Typography>
                <Chip
                  label="Fair"
                  sx={{
                    bgcolor: colors.warning,
                    color: "white",
                    fontWeight: 700,
                  }}
                />
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Some improvements needed
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: `${colors.danger}08`,
                  border: `2px solid ${colors.danger}30`,
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="h5" fontWeight={900} color={colors.danger} gutterBottom>
                  0-59
                </Typography>
                <Chip
                  label="Needs Work"
                  sx={{
                    bgcolor: colors.danger,
                    color: "white",
                    fontWeight: 700,
                  }}
                />
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Focus on fundamentals
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        }
      />

      {/* Important Notes */}
      <Alert
        severity="info"
        icon={<Info />}
        sx={{
          borderRadius: 2,
          bgcolor: `${colors.accent}08`,
          border: `1px solid ${colors.accent}30`,
          "& .MuiAlert-icon": {
            color: colors.accent,
          },
        }}
      >
        <Typography variant="body2" fontWeight={600} gutterBottom>
          Based on Professional Standards
        </Typography>
        <Typography variant="body2">
          • These scoring thresholds come from <strong>Federal Reserve data</strong> and financial advisor best practices
          <br />
          • The 36% debt-to-income threshold is the <strong>industry standard</strong> used by lenders
          <br />
          • 6-month emergency fund is recommended by most <strong>certified financial planners</strong>
          <br />
          • 20% savings rate is the baseline for <strong>retirement readiness</strong>
          <br />• This is educational assessment, not financial advice
        </Typography>
      </Alert>
    </Stack>
  );
}