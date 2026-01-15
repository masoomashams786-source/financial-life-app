import { Box, Typography, Paper, Divider, Chip, Stack, Alert } from "@mui/material";
import { AccountBalanceWallet, Info } from "@mui/icons-material";
import ExplainerSection from "./ExplainerSection";

export default function CashFlowExplainer() {
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
              bgcolor: `${colors.accent}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AccountBalanceWallet sx={{ fontSize: 24, color: colors.accent }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={800} color={colors.primary}>
              Cash Flow Analysis
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Are you making more than you spend?
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* What It Is */}
      <ExplainerSection
        title="What It Measures"
        content={
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Cash Flow shows whether you have money left over each month after paying for
            everything. A <strong>positive cash flow</strong> means you're building wealth. A{" "}
            <strong>negative cash flow</strong> means you're spending more than you earn.
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
                  bgcolor: colors.success,
                }}
              />
              <Typography variant="body2">
                <strong>Monthly income</strong> from your job
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: colors.success,
                }}
              />
              <Typography variant="body2">
                <strong>Side income</strong> (if you have any)
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: colors.danger,
                }}
              />
              <Typography variant="body2">
                <strong>Monthly expenses</strong> (bills, food, rent, etc.)
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: colors.warning,
                }}
              />
              <Typography variant="body2">
                <strong>Retirement/investment contributions</strong> you make each month
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
                Monthly Income:
              </Typography>

              <Box
                display="grid"
                gridTemplateColumns="1fr auto"
                gap={1}
                sx={{ bgcolor: "white", p: 2, borderRadius: 1 }}
              >
                <Typography variant="body2">Job income:</Typography>
                <Typography variant="body2" fontWeight={700} color={colors.success}>
                  +$5,000
                </Typography>

                <Typography variant="body2">Side income:</Typography>
                <Typography variant="body2" fontWeight={700} color={colors.success}>
                  +$500
                </Typography>

                <Divider sx={{ gridColumn: "1 / -1", my: 1 }} />

                <Typography variant="body2" fontWeight={700}>
                  Total Income:
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  $5,500
                </Typography>
              </Box>

              <Divider />

              <Typography variant="subtitle2" fontWeight={700} color={colors.primary}>
                Monthly Outflows:
              </Typography>

              <Box
                display="grid"
                gridTemplateColumns="1fr auto"
                gap={1}
                sx={{ bgcolor: "white", p: 2, borderRadius: 1 }}
              >
                <Typography variant="body2">Living expenses:</Typography>
                <Typography variant="body2" fontWeight={700} color={colors.danger}>
                  -$3,000
                </Typography>

                <Typography variant="body2">401k/IRA contributions:</Typography>
                <Typography variant="body2" fontWeight={700} color={colors.warning}>
                  -$1,000
                </Typography>

                <Divider sx={{ gridColumn: "1 / -1", my: 1 }} />

                <Typography variant="body2" fontWeight={700}>
                  Total Outflows:
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  -$4,000
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
                  Monthly Cash Flow:
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  $5,500 (income) - $4,000 (expenses + savings) ={" "}
                  <strong>+$1,500</strong>
                </Typography>

                <Typography variant="h5" fontWeight={900} color={colors.success}>
                  +$1,500 surplus
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  You have $1,500 left over each month
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
                label="Monthly Surplus/Deficit"
                size="small"
                sx={{
                  bgcolor: `${colors.success}15`,
                  color: colors.success,
                  fontWeight: 700,
                  mb: 1,
                }}
              />
              <Typography variant="body2">
                Shows if you have money left over (<strong>+$1,500 surplus</strong>) or are
                spending more than you earn (<strong>-$500 deficit</strong>).
              </Typography>
            </Box>

            <Box>
              <Chip
                label="Income Breakdown"
                size="small"
                sx={{
                  bgcolor: `${colors.accent}15`,
                  color: colors.accent,
                  fontWeight: 700,
                  mb: 1,
                }}
              />
              <Typography variant="body2">
                Pie chart showing where your income comes from (job vs side income).
              </Typography>
            </Box>

            <Box>
              <Chip
                label="Expense Breakdown"
                size="small"
                sx={{
                  bgcolor: `${colors.warning}15`,
                  color: colors.warning,
                  fontWeight: 700,
                  mb: 1,
                }}
              />
              <Typography variant="body2">
                Pie chart showing where your money goes (living expenses vs savings/investments).
              </Typography>
            </Box>

            <Box>
              <Chip
                label="Annual Projection"
                size="small"
                sx={{
                  bgcolor: `${colors.primary}15`,
                  color: colors.primary,
                  fontWeight: 700,
                  mb: 1,
                }}
              />
              <Typography variant="body2">
                Your monthly surplus multiplied by 12 to show yearly impact (e.g., +$1,500/month ={" "}
                <strong>+$18,000/year</strong> available for wealth building).
              </Typography>
            </Box>
          </Stack>
        }
      />

      {/* What It Means */}
      <ExplainerSection
        title="What It Means for You"
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
                <Typography variant="subtitle2" fontWeight={700} color={colors.success} gutterBottom>
                  ✓ Positive Cash Flow (Surplus)
                </Typography>
                <Typography variant="body2">
                  You're living below your means. This extra money can go to:
                  <br />• Building emergency fund
                  <br />• Paying off debt faster
                  <br />• Investing more for retirement
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" fontWeight={700} color={colors.danger} gutterBottom>
                  ✗ Negative Cash Flow (Deficit)
                </Typography>
                <Typography variant="body2">
                  You're spending more than you earn. This usually means:
                  <br />• Using credit cards to cover the gap
                  <br />• Dipping into savings each month
                  <br />• Not building wealth (going backwards)
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
          Why This Matters
        </Typography>
        <Typography variant="body2">
          • Cash flow is the <strong>foundation</strong> of wealth building
          <br />
          • You can't build wealth if you spend everything you make
          <br />
          • A consistent surplus (even $500/month) compounds over time
          <br />• This is simple math using YOUR numbers - no estimates
        </Typography>
      </Alert>
    </Stack>
  );
}