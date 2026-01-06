import { Box, CircularProgress, Grid, Alert, Container, Stack, Fade } from "@mui/material";
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
        bgcolor: "#0f172a", // Modern deep slate/navy
        backgroundImage: "radial-gradient(at 0% 0%, rgba(30, 58, 138, 0.3) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(15, 23, 42, 0.3) 0, transparent 50%)",
        pb: 6
      }}
    >
      <Header />

      <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 } }}>
        <Fade in={true} timeout={800}>
          <Grid container spacing={{ xs: 2, md: 3, lg: 4 }}>
            
            {/* Left Sidebar - Financial Stats */}
            <Grid item xs={12} md={4} lg={3}>
              <Stack spacing={{ xs: 2, md: 3 }}>
                {/* Financial Snapshot Card */}
                <FinancialSnapshotCard />

                {/* Financial Plans Card */}
                <FinancialPlansCard />

                {/* Financial Health Score Section */}
                <Box>
                  {analysisLoading ? (
                    <Box 
                      display="flex" 
                      justifyContent="center" 
                      alignItems="center" 
                      sx={{ 
                        p: 4, 
                        bgcolor: "rgba(255, 255, 255, 0.03)", 
                        borderRadius: 3, 
                        border: "1px solid rgba(255, 255, 255, 0.1)" 
                      }}
                    >
                      <CircularProgress size={32} sx={{ color: "primary.main" }} />
                    </Box>
                  ) : analysisError ? (
                    <Alert 
                      severity="info" 
                      variant="outlined"
                      sx={{ 
                        color: "#bae6fd", 
                        borderColor: "#0369a1",
                        "& .MuiAlert-icon": { color: "#38bdf8" } 
                      }}
                    >
                      Update your financial snapshot to see your health score
                    </Alert>
                  ) : (
                    <FinancialHealthScore analysis={analysis} />
                  )}
                </Box>
              </Stack>
            </Grid>

            {/* Main Area - Charts & Analysis */}
            <Grid item xs={12} md={8} lg={9}>
              <Stack spacing={{ xs: 2, md: 3 }}>
                
                {/* Net Worth Projection Chart */}
                <Box sx={{ width: "100%" }}>
                  {projectionsError ? (
                    <Alert 
                      severity="info" 
                      variant="outlined"
                      sx={{ 
                        color: "#bae6fd", 
                        borderColor: "#0369a1",
                        "& .MuiAlert-icon": { color: "#38bdf8" } 
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

                {/* Insights Panel */}
                {!analysisError && analysis && (
                  <Box sx={{ width: "100%" }}>
                    <InsightsPanel analysis={analysis} />
                  </Box>
                )}
                
              </Stack>
            </Grid>
          </Grid>
        </Fade>
      </Container>
    </Box>
  );
}