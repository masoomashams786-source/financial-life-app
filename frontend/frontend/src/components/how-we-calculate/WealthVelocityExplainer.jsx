import { Box, Typography, Paper, Divider, Chip, Stack, Alert } from "@mui/material";
import { Speed, TrendingUp, Info } from "@mui/icons-material";
import ExplainerSection from "./ExplainerSection";

export default function WealthVelocityExplainer() {
  const colors = {
    primary: "#0A2540",
    accent: "#00D4FF",
    purple: "#8B5CF6",
    success: "#10B981",
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
              bgcolor: `${colors.purple}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Speed sx={{ fontSize: 24, color: colors.purple }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={800} color={colors.primary}>
              Wealth Velocity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              How fast your money is growing each year
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* What It Is */}
      <ExplainerSection
        title="What It Measures"
        content={
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Wealth Velocity shows the annual percentage rate your total net worth is growing.
            It combines two things: <strong>money you save each month</strong> and{" "}
            <strong>returns from your investments</strong>.
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
                <strong>Your net worth</strong> (assets minus debts)
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
                <strong>Monthly savings</strong> going into investments or retirement accounts
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
                <strong>Expected investment returns</strong> (based on your portfolio mix)
              </Typography>
            </Box>
          </Stack>
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
            <Stack spacing={2}>
              <Typography variant="subtitle2" fontWeight={700} color={colors.primary}>
                Monthly Snapshot:
              </Typography>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Starting Net Worth:
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  $50,000
                </Typography>
              </Box>

              <Divider />

              <Typography variant="subtitle2" fontWeight={700} color={colors.primary}>
                Monthly Activity:
              </Typography>

              <Box
                display="grid"
                gridTemplateColumns="1fr auto"
                gap={1}
                sx={{ bgcolor: "white", p: 2, borderRadius: 1 }}
              >
                <Typography variant="body2">You save & invest:</Typography>
                <Typography variant="body2" fontWeight={700}>
                  $500/month
                </Typography>

                <Typography variant="body2">Annual savings:</Typography>
                <Typography variant="body2" fontWeight={700}>
                  $6,000/year
                </Typography>
              </Box>

              <Box
                display="grid"
                gridTemplateColumns="1fr auto"
                gap={1}
                sx={{ bgcolor: "white", p: 2, borderRadius: 1 }}
              >
                <Typography variant="body2">Your investments grow at:</Typography>
                <Typography variant="body2" fontWeight={700}>
                  7% annually
                </Typography>

                <Typography variant="body2">Expected returns on $50K:</Typography>
                <Typography variant="body2" fontWeight={700}>
                  $3,500/year
                </Typography>
              </Box>

              <Divider />

              <Box
                sx={{
                  p: 2,
                  bgcolor: `${colors.success}10`,
                  borderRadius: 1,
                  border: `1px solid ${colors.success}30`,
                }}
              >
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Total Annual Growth:
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  $6,000 (savings) + $3,500 (returns) ={" "}
                  <strong>$9,500</strong>
                </Typography>

                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Wealth Velocity:
                </Typography>
                <Typography variant="h5" fontWeight={900} color={colors.success}>
                  19% per year
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ($9,500 ÷ $50,000 = 19%)
                </Typography>
              </Box>
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
                label="Velocity Score"
                size="small"
                sx={{
                  bgcolor: `${colors.purple}15`,
                  color: colors.purple,
                  fontWeight: 700,
                  mb: 1,
                }}
              />
              <Typography variant="body2">
                The main percentage (like <strong>19%</strong> in the example). This tells you how
                fast your wealth is growing.
              </Typography>
            </Box>

            <Box>
              <Chip
                label="Ranking"
                size="small"
                sx={{
                  bgcolor: `${colors.success}15`,
                  color: colors.success,
                  fontWeight: 700,
                  mb: 1,
                }}
              />
              <Typography variant="body2">
                We compare you to national averages:
                <br />• <strong>15%+ = Elite</strong> (top 5% of wealth builders)
                <br />• <strong>12%+ = Excellent</strong> (top 10%)
                <br />• <strong>8%+ = Strong</strong> (top 25%)
              </Typography>
            </Box>

            <Box>
              <Chip
                label="Monthly Gain"
                size="small"
                sx={{
                  bgcolor: `${colors.accent}15`,
                  color: colors.accent,
                  fontWeight: 700,
                  mb: 1,
                }}
              />
              <Typography variant="body2">
                How many dollars your net worth grows each month (in the example: ~$790/month).
              </Typography>
            </Box>

            <Box>
              <Chip
                label="Projections"
                size="small"
                sx={{
                  bgcolor: `${colors.warning}15`,
                  color: colors.warning,
                  fontWeight: 700,
                  mb: 1,
                }}
              />
              <Typography variant="body2">
                Estimated future net worth if you keep the same pace (1 year, 5 years, 10 years).
              </Typography>
            </Box>
          </Stack>
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
          Important to Know
        </Typography>
        <Typography variant="body2">
          • Projections show <strong>direction</strong>, not guarantees
          <br />
          • Investment returns vary year to year (we use historical averages)
          <br />
          • Your actual results depend on market performance and your savings habits
          <br />• This is educational analysis, not financial advice
        </Typography>
      </Alert>
    </Stack>
  );
}