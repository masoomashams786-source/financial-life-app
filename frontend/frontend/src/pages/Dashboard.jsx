import { Box, CircularProgress, Grid } from "@mui/material";
import { useAuth } from "../auth/useAuth";
import Header from "../components/header";
import FinancialSnapshotCard from "../components/FinancialSnapshotCard";
import FinancialPlansCard from "../components/FinancialPlansCard";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#16385aff" }}>
      <Header />
      
      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Left Sidebar - Both Cards Stacked */}
          <Grid item xs={12} md={4} lg={3}>
            <Box display="flex" flexDirection="column" gap={3}>
              {/* Financial Snapshot Card */}
              <FinancialSnapshotCard />
              
              {/* Financial Plans Card */}
              <FinancialPlansCard />
            </Box>
          </Grid>

          {/* Main Area - Projection Chart */}
          <Grid item xs={12} md={8} lg={9}>
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: 3,
                p: 4,
                minHeight: 400,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #E6E9F0",
              }}
            >
              {/* TODO: Financial Projection Chart Card */}
              <Box textAlign="center">
                <Box
                  sx={{
                    fontSize: 64,
                    mb: 2,
                  }}
                >
                  📊
                </Box>
                <Box sx={{ color: "#697386", fontWeight: 600, fontSize: "1.1rem" }}>
                  Financial Projection Chart
                </Box>
                <Box sx={{ color: "#697386", fontSize: "0.9rem", mt: 1 }}>
                  Coming soon - Visualize your financial future
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
