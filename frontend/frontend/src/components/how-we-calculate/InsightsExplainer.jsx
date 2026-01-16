import { Box, Typography, Paper, Divider, Chip, Stack, Alert, Grid } from "@mui/material";
import { Lightbulb, Info, TrendingUp, Warning, CheckCircle } from "@mui/icons-material";
import ExplainerSection from "./ExplainerSection";

export default function InsightsExplainer() {
  const colors = {
    primary: "#0A2540",
    accent: "#00D4FF",
    success: "#10B981",
    danger: "#EF4444",
    warning: "#F59E0B",
    purple: "#8B5CF6",
  };
  const cardSx = (color) => ({
  p: 1.5,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  bgcolor: `${color}08`,
  border: `2px solid ${color}30`,
  borderRadius: 2,
});


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
              bgcolor: `${colors.warning}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lightbulb sx={{ fontSize: 24, color: colors.warning }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={800} color={colors.primary}>
              Financial Insights
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Personalized recommendations based on your situation
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* What It Is */}
      <ExplainerSection
        title="What It Provides"
        content={
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Financial Insights analyzes <strong>your specific numbers</strong> and compares them to <strong>national benchmarks</strong> to give you personalized action plans. We identify what you're doing well, where you're vulnerable, and exactly what to do next.
          </Typography>
        }
      />

      {/* What We Analyze */}
      <ExplainerSection
        title="What We Analyze"
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
                <strong>Your numbers</strong> vs people your age (Federal Reserve data)
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
                <strong>Savings rate</strong> vs national average (5% median, 20% top performers)
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
                <strong>Debt-to-income ratio</strong> vs recommended limits (36% threshold)
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
                <strong>Emergency fund coverage</strong> vs 6-month standard
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
                <strong>Investment diversification</strong> vs financial planner recommendations
              </Typography>
            </Box>
          </Stack>
        }
      />

      {/* Types of Insights */}
      
      <ExplainerSection
        title="What You'll See"
        
        content={
            <Box sx={{ mt: 2, mb: { xs: 6, md: 6 } }}>
            
          <Grid  container
        columnSpacing={{ xs: 0, sm: 3, md: 4 }}
        rowSpacing={{ xs: 5, sm: 5, md: 4 }}
        alignItems="stretch">
            {/* Strengths */}
            <Grid item size={{  md: 3, xs:12 }}  xs={12}  xl={3}>
              <Paper
              elevation={0}
                sx={cardSx(colors.success)}
              >
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <CheckCircle sx={{ color: colors.success, fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight={800} color={colors.success}>
                    Strengths
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Things you're doing well that put you ahead of average
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1}>
                  <Typography variant="caption" display="block">
                    <strong>Example:</strong> "Elite Savings Rate - Your 40% savings rate puts you in the top 10% of earners nationally"
                  </Typography>
                  <Typography variant="caption" display="block">
                    <strong>Example:</strong> "Fully Funded Emergency Fund - 6.5 months of expenses covered provides excellent protection"
                  </Typography>
                </Stack>
              </Paper>
            </Grid>

            {/* Vulnerabilities */}
            <Grid item size={{  md: 3 , xs:12}}  xs={12}  xl={3}>
              <Paper
              elevation={0}
               sx={cardSx(colors.danger)}
              >
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Warning sx={{ color: colors.danger, fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight={800} color={colors.danger}>
                    Vulnerabilities
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Areas where you're at risk or behind recommended levels
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1}>
                  <Typography variant="caption" display="block">
                    <strong>Example:</strong> "Emergency Fund Critically Low - Only 2 months coverage. Target: 6 months ($18,000)"
                  </Typography>
                  <Typography variant="caption" display="block">
                    <strong>Example:</strong> "High Debt-to-Income Ratio - 45% ratio exceeds recommended 36% threshold"
                  </Typography>
                </Stack>
              </Paper>
            </Grid>

            {/* Immediate Actions */}
            <Grid item size={{  md: 3, xs:12}}  xs={12}  xl={3}>
              <Paper
                elevation={0}
                sx={cardSx(colors.warning)}
              >
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Lightbulb sx={{ color: colors.warning, fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight={800} color={colors.warning}>
                    Immediate Actions
                  </Typography>
                 
                 
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Critical fixes you should tackle right now
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1}>
                  <Typography variant="caption" display="block">
                    <strong>Priority 1:</strong> Build Emergency Fund
                    <br />
                    • Redirect $500/month to high-yield savings
                    <br />
                    • Target: Fully funded in 12 months
                    <br />• Impact: Protects against job loss, medical emergencies
                  </Typography>
                </Stack>
              </Paper>
            </Grid>

            {/* Alerts */}
            <Grid item size={{  md: 3, xs:12 }}  xs={12}  xl={3}>
              <Paper
                elevation={0}
                sx={cardSx(colors.purple)}
              >
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Warning sx={{ color: colors.purple, fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight={800} color={colors.purple}>
                    Critical Alerts
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Urgent warnings that need immediate attention
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1}>
                  <Typography variant="caption" display="block">
                    <strong>Example:</strong> "⚠️ Emergency Fund Dangerously Low - One unexpected expense could derail your financial plan"
                  </Typography>
                  <Typography variant="caption" display="block">
                    <strong>Example:</strong> "⚠️ Debt Burden Excessive - 50% debt-to-income is unsustainable"
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
          </Box>
        }
        
      />

      {/* How It Works - Example */}
      <ExplainerSection
        title="How It Works (Real Example)"
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
            <Stack spacing={3}>
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
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Age:
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      32 years old
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Net Worth:
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      $35,000
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Savings Rate:
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      8%
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Emergency Fund:
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      2 months
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Debt:
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      $8,000
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Side Income:
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      None
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Divider />

              <Typography variant="subtitle2" fontWeight={700} color={colors.primary}>
                What Our Analysis Finds:
              </Typography>

              {/* Benchmark Comparison */}
              <Box>
                <Chip
                  label="Benchmark Comparison"
                  size="small"
                  sx={{
                    bgcolor: `${colors.accent}15`,
                    color: colors.accent,
                    fontWeight: 700,
                    mb: 1.5,
                  }}
                />
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "white",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" gutterBottom>
                    • <strong>Net Worth:</strong> $35,000 vs $91,000 median for age 32 → You're at 38th percentile
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    • <strong>Savings Rate:</strong> 8% vs 12% median for top 50% → Below recommended
                  </Typography>
                  <Typography variant="body2">
                    • <strong>Debt-to-Income:</strong> 13% vs 36% threshold → Within safe range ✓
                  </Typography>
                </Box>
              </Box>

              {/* Strengths Identified */}
              <Box>
                <Chip
                  label="Strengths Identified"
                  size="small"
                  sx={{
                    bgcolor: `${colors.success}15`,
                    color: colors.success,
                    fontWeight: 700,
                    mb: 1.5,
                  }}
                />
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "white",
                    borderRadius: 1,
                    border: `1px solid ${colors.success}30`,
                  }}
                >
                  <Typography variant="body2" fontWeight={700} color={colors.success} gutterBottom>
                    ✓ Low Debt Burden
                  </Typography>
                  <Typography variant="caption">
                    Debt-to-income ratio of 13% is excellent. You have manageable debt that won't hold back wealth building.
                  </Typography>
                </Box>
              </Box>

              {/* Vulnerabilities Found */}
              <Box>
                <Chip
                  label="Vulnerabilities Found"
                  size="small"
                  sx={{
                    bgcolor: `${colors.danger}15`,
                    color: colors.danger,
                    fontWeight: 700,
                    mb: 1.5,
                  }}
                />
                <Stack spacing={1.5}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "white",
                      borderRadius: 1,
                      border: `1px solid ${colors.danger}30`,
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2" fontWeight={700} color={colors.danger}>
                        ⚠ Emergency Fund Critically Low
                      </Typography>
                      <Chip
                        label="HIGH PRIORITY"
                        size="small"
                        sx={{
                          bgcolor: colors.danger,
                          color: "white",
                          fontWeight: 700,
                          fontSize: "0.65rem",
                        }}
                      />
                    </Box>
                    <Typography variant="caption" display="block" gutterBottom>
                      Only 2 months coverage. Target: 6 months ($9,000)
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 1, color: colors.danger }}>
                      Gap: $6,000 | At $500/month = 12 months to fix
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "white",
                      borderRadius: 1,
                      border: `1px solid ${colors.warning}30`,
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2" fontWeight={700} color={colors.warning}>
                        ⚠ Low Savings Rate
                      </Typography>
                      <Chip
                        label="MEDIUM"
                        size="small"
                        sx={{
                          bgcolor: colors.warning,
                          color: "white",
                          fontWeight: 700,
                          fontSize: "0.65rem",
                        }}
                      />
                    </Box>
                    <Typography variant="caption">
                      8% savings rate limits wealth accumulation. Target: 20%+ for retirement readiness
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "white",
                      borderRadius: 1,
                      border: `1px solid ${colors.warning}30`,
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2" fontWeight={700} color={colors.warning}>
                        ℹ Single Point of Income Failure
                      </Typography>
                      <Chip
                        label="LOW"
                        size="small"
                        sx={{
                          bgcolor: colors.accent,
                          color: "white",
                          fontWeight: 700,
                          fontSize: "0.65rem",
                        }}
                      />
                    </Box>
                    <Typography variant="caption">
                      No side income - vulnerable if primary income lost
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {/* Action Plan Generated */}
              <Box>
                <Chip
                  label="Immediate Action Plan"
                  size="small"
                  sx={{
                    bgcolor: `${colors.warning}15`,
                    color: colors.warning,
                    fontWeight: 700,
                    mb: 1.5,
                  }}
                />
                <Box
                  sx={{
                    p: 2.5,
                    bgcolor: "white",
                    borderRadius: 1,
                    border: `2px solid ${colors.warning}`,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={800} gutterBottom>
                    Priority 1: Build Emergency Fund
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Increase from $3,000 to $9,000
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="caption" fontWeight={700} display="block" gutterBottom>
                    Action Steps:
                  </Typography>
                  <Stack spacing={0.5} sx={{ pl: 2 }}>
                    <Typography variant="caption">
                      • Redirect $500/month to high-yield savings account
                    </Typography>
                    <Typography variant="caption">
                      • Target: Fully funded in 12 months
                    </Typography>
                    <Typography variant="caption">
                      • Keep in FDIC-insured account with 4.5%+ APY
                    </Typography>
                  </Stack>
                  <Box sx={{ mt: 2, p: 1.5, bgcolor: `${colors.success}10`, borderRadius: 1 }}>
                    <Typography variant="caption" fontWeight={700} color={colors.success}>
                      Impact: Protects against job loss, medical emergencies, car repairs
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Stack>
          </Paper>
        }
      />

      {/* Why Trust These Insights */}
      <ExplainerSection
        title="Why Trust These Insights"
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
                  📊 Based on Real Data
                </Typography>
                <Typography variant="body2">
                  • Federal Reserve's <strong>Survey of Consumer Finances</strong> (updated every 3 years)
                  <br />
                  • IRS contribution limits and tax law
                  <br />• Industry standards from certified financial planners
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  🎯 Not Generic Advice
                </Typography>
                <Typography variant="body2">
                  We don't just say "save more money." We calculate:
                  <br />
                  • <strong>Exactly how much</strong> you need (e.g., $6,000 for emergency fund)
                  <br />
                  • <strong>Exactly how long</strong> it will take (e.g., 12 months at $500/month)
                  <br />• <strong>Exactly what impact</strong> it will have (protects against job loss)
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  🔄 Updates With Your Changes
                </Typography>
                <Typography variant="body2">
                  As you update your financial snapshot, the insights automatically adjust to show your progress and new priorities.
                </Typography>
              </Box>
            </Stack>
          </Paper>
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
          What Insights Are (and Aren't)
        </Typography>
        <Typography variant="body2">
          • <strong>ARE:</strong> Data-driven recommendations based on proven financial principles
          <br />
          • <strong>ARE:</strong> Personalized to YOUR specific numbers and situation
          <br />
          • <strong>ARE:</strong> Prioritized by urgency and impact
          <br />
          • <strong>ARE NOT:</strong> Personalized financial advice (consult a licensed advisor for that)
          <br />
          • <strong>ARE NOT:</strong> One-size-fits-all tips
          <br />• <strong>ARE NOT:</strong> Guarantees of future results
        </Typography>
      </Alert>
    </Stack>
  );
}