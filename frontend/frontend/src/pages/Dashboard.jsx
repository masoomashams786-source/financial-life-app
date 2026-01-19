import {
  Box,
  CircularProgress,
  Grid,
  Alert,
  Container,
  Stack,
  Fade,
} from "@mui/material";
import useSWR from "swr";
import { useAuth } from "../auth/useAuth";
import Header from "../components/header";
import FinancialSnapshotCard from "../components/FinancialSnapshotCard";
import FinancialPlansCard from "../components/FinancialPlansCard";
import NetWorthChart from "../components/dashboard/NetWorthChart";
import FinancialHealthScore from "../components/dashboard/FinancialHealthScore";
import InsightsPanel from "../components/dashboard/InsightsPanel";
import { projectionsFetcher } from "../api/projections";
import { insightsFetcher } from "../api/insights";
import SP500MiniCard from "../components/dashboard/SP500MiniCard";
import CashFlowMiniCard from "../components/dashboard/CashFlowMiniCard";
import WealthVelocityMiniCard from "../components/dashboard/WealthVelocityMiniCard";
import HowWeCalculateMiniCard from "../components/dashboard/HowWeCalculateMiniCard";

export default function Dashboard() {
  const { user } = useAuth();

  // Fetch projections
  const {
    data: projections,
    error: projectionsError,
    isLoading: projectionsLoading,
  } = useSWR("/projections/all-scenarios", projectionsFetcher);

  // Fetch insights
  const {
    data: analysis,
    error: analysisError,
    isLoading: analysisLoading,
  } = useSWR("/insights/analysis", insightsFetcher);

  if (!user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ bgcolor: "#0f172a" }}
      >
        <CircularProgress thickness={4} size={50} sx={{ color: "#38bdf8" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#0f172a",
        backgroundImage:
          "radial-gradient(at 0% 0%, rgba(30, 58, 138, 0.3) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(15, 23, 42, 0.3) 0, transparent 50%)",
        pb: 6,
      }}
    >
      <Header />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#0f172a",
          backgroundImage:
            "radial-gradient(at 0% 0%, rgba(30, 58, 138, 0.3) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(15, 23, 42, 0.3) 0, transparent 50%)",
          p: 8,
          pt: 2,
          display: "flex",

          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container
          maxWidth="2xl"
          sx={{
            mt: { xs: 2, md: 4 },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Fade in={true} timeout={800}>
            <Stack spacing={{ xs: 2, md: 3 }}>
              {/* Top Row - Key Metrics (4 cards) */}
              <Grid container spacing={{ xs: 2, md: 2.5 }}>
                {/* SP500 Mini Card */}
                <Grid item xs={12} sm={6} lg={3}>
                  <SP500MiniCard />
                </Grid>

                {/* Cash Flow Mini Card */}
                <Grid item xs={12} sm={6} lg={3}>
                  <CashFlowMiniCard />
                </Grid>

                <Grid item xs={12} sm={6} lg={3}>
                  <WealthVelocityMiniCard />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <HowWeCalculateMiniCard />
                </Grid>
              </Grid>

              {/* Main Content Area - Two Columns */}
              <Grid container spacing={{ xs: 2, md: 3 }}>
                {/* Left Column - Financial Snapshot & Plans */}
                <Grid size={{ xs: 12, lg: 4 }}>
                  <Stack spacing={{ xs: 2, md: 2.5 }}>
                    {/* Financial Snapshot Card */}
                    <FinancialSnapshotCard />

                    {/* Financial Plans Card */}
                    <FinancialPlansCard />
                  </Stack>
                </Grid>

                {/* Right Column - Charts & Insights */}
                <Grid size={{ xs: 12, lg: 8 }}>
                  <Stack spacing={{ xs: 2, md: 2.5 }}>
                    {/* Net Worth Projection Chart */}
                    <Box sx={{ width: "100%" }}>
                      {projectionsError ? (
                        <Alert
                          severity="info"
                          variant="outlined"
                          sx={{
                            color: "#bae6fd",
                            borderColor: "#0369a1",
                            "& .MuiAlert-icon": { color: "#38bdf8" },
                          }}
                        >
                          Update your financial snapshot to generate projections
                        </Alert>
                      ) : (
                        <NetWorthChart
                          projections={projections}
                          loading={projectionsLoading}
                        />
                      )}
                    </Box>

                    {/* Bottom Row - Health Score & Insights (Equal Split) */}
                    <Box sx={{ width: "100%" }}>
                      <Grid container spacing={{ xs: 2, md: 2.5 }}>
                        {/* Financial Health Score - 50% */}
                        <Grid size={{ xs: 12, lg: 6 }}>
                          {analysisLoading ? (
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              sx={{
                                p: 4,
                                bgcolor: "rgba(255, 255, 255, 0.03)",
                                borderRadius: 2,
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                minHeight: 250,
                                height: "100%",
                              }}
                            >
                              <CircularProgress
                                size={32}
                                sx={{ color: "primary.main" }}
                              />
                            </Box>
                          ) : analysisError ? (
                            <Alert
                              severity="info"
                              variant="outlined"
                              sx={{
                                color: "#bae6fd",
                                borderColor: "#0369a1",
                                "& .MuiAlert-icon": { color: "#38bdf8" },
                                minHeight: 250,
                                height: "100%",
                              }}
                            >
                              Update your financial snapshot to see your health
                              score
                            </Alert>
                          ) : (
                            <Box sx={{ height: "100%" }}>
                              <FinancialHealthScore analysis={analysis} />
                            </Box>
                          )}
                        </Grid>

                        {/* Insights Panel - 50% */}
                        <Grid size={{ xs: 12, lg: 6 }}>
                          {analysisLoading ? (
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              sx={{
                                p: 4,
                                bgcolor: "rgba(255, 255, 255, 0.03)",
                                borderRadius: 2,
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                minHeight: 250,
                                height: "100%",
                              }}
                            >
                              <CircularProgress
                                size={32}
                                sx={{ color: "primary.main" }}
                              />
                            </Box>
                          ) : analysisError ? (
                            <Alert
                              severity="info"
                              variant="outlined"
                              sx={{
                                color: "#bae6fd",
                                borderColor: "#0369a1",
                                "& .MuiAlert-icon": { color: "#38bdf8" },
                                minHeight: 250,
                                height: "100%",
                              }}
                            >
                              Update your financial snapshot to see personalized
                              insights
                            </Alert>
                          ) : (
                            <Box sx={{ height: "100%" }}>
                              <InsightsPanel analysis={analysis} />
                            </Box>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
}
