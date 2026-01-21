import {
  Box,
  Grid,
  Container,
  Stack,
  Fade,
} from "@mui/material";
import { useAuth } from "../auth/useAuth";
import Header from "../components/header";
import FinancialSnapshotCard from "../components/FinancialSnapshotCard";
import FinancialPlansCard from "../components/FinancialPlansCard";
import NetWorthChart from "../components/dashboard/NetWorthChart";
import FinancialHealthScore from "../components/dashboard/FinancialHealthScore";
import InsightsPanel from "../components/dashboard/InsightsPanel";
import SP500MiniCard from "../components/dashboard/SP500MiniCard";
import CashFlowMiniCard from "../components/dashboard/CashFlowMiniCard";
import WealthVelocityMiniCard from "../components/dashboard/WealthVelocityMiniCard";
import HowWeCalculateMiniCard from "../components/dashboard/HowWeCalculateMiniCard";

const styles = {
  container: {
    minHeight: "100vh",
    bgcolor: "#0f172a",
    backgroundImage:
      "radial-gradient(at 0% 0%, rgba(30, 58, 138, 0.3) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(15, 23, 42, 0.3) 0, transparent 50%)",
    pb: 6,
  },
  contentContainer: {
    height: "100%",
    p: 8,
    pt: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}

const MetricCards = () => {
  return (
    <Grid container spacing={{ xs: 2, md: 2.5 }}>
      {/* SP500 Mini Card */}
      <Grid item size={{ xs: 12, sm: 6, lg: 3 }}>
        <SP500MiniCard />
      </Grid>

      {/* Cash Flow Mini Card */}
      <Grid item size={{ xs: 12, sm: 6, lg: 3 }}>
        <CashFlowMiniCard />
      </Grid>

      <Grid item size={{ xs: 12, sm: 6, lg: 3 }}>
        <WealthVelocityMiniCard />
      </Grid>
      <Grid item size={{ xs: 12, sm: 6, lg: 3 }}>
        <HowWeCalculateMiniCard />
      </Grid>
    </Grid>
  )
}

const LeftColumn = () => {
  return (
    <Grid size={{ xs: 12, lg: 4 }}>
      <Stack spacing={4}>
        {/* Financial Snapshot Card */}
        <FinancialSnapshotCard />
        {/* Financial Plans Card */}
        <FinancialPlansCard />
      </Stack>
    </Grid>
  )
}

const RightColumn = () => {
  return (
    <Grid size={{ xs: 12, lg: 8 }}>
      <Stack spacing={4}>
        <NetWorthChart />
        {/* Bottom Row - Health Score & Insights (Equal Split) */}
        <Grid container spacing={{ xs: 2, md: 2.5 }}>
          {/* Financial Health Score - 50% */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <FinancialHealthScore />
          </Grid>

          {/* Insights Panel - 50% */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <InsightsPanel />
          </Grid>
        </Grid>
      </Stack>
    </Grid>
  )
}

export default function Dashboard() {
  const { user } = useAuth();

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
      sx={styles.container}>
      <Header />

      <Box sx={styles.contentContainer}>
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
              <MetricCards />

              {/* Main Content Area - Two Columns */}
              <Grid container spacing={{ xs: 2, md: 3 }}>
                {/* Left Column - Financial Snapshot & Plans */}
                <LeftColumn />
                <RightColumn />
              </Grid>
            </Stack>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
}
