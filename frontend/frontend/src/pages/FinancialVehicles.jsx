import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Stack,
  Fade,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import Header from "../components/header";
import MyPlansSection from "../components/vehicles/MyPlansSection";
import ComparativeMatrixSection from "../components/vehicles/ComparativeMatrixSection";
import CalculatorSection from "../components/vehicles/CalculatorSection";

export default function FinancialVehicles() {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const colors = {
    primary: "#0A2540",
    accent: "#00D4FF",
    background: "#0f172a", // Updated to a modern deep slate
    surface: "rgba(255, 255, 255, 0.98)",
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box 
      sx={{ 
        minHeight: "100vh", 
        bgcolor: colors.background,
        backgroundImage: "radial-gradient(at 100% 0%, rgba(0, 212, 255, 0.05) 0, transparent 50%)",
        pb: 8
      }}
    >
      <Header />

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
        {/* Page Header */}
        <Box mb={5}>
          <Stack 
            direction={{ xs: "column", sm: "row" }} 
            alignItems={{ xs: "flex-start", sm: "center" }} 
            spacing={2}
          >
            <IconButton
              onClick={() => navigate("/dashboard")}
              sx={{
                bgcolor: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(8px)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "all 0.2s ease-in-out",
                "&:hover": { 
                  bgcolor: "rgba(255,255,255,0.15)",
                  transform: "translateX(-4px)" 
                },
              }}
            >
              <ArrowBack fontSize="small" />
            </IconButton>
            <Box>
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                fontWeight={800} 
                color="white"
                sx={{ letterSpacing: "-0.02em" }}
              >
                Financial Vehicles Hub
              </Typography>
              <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.6)", mt: 0.5 }}>
                Manage, compare, and calculate your financial plans
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Main Interface Wrapper */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            bgcolor: "transparent",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {/* Tab Navigation */}
          <Box
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.03)",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              px: { xs: 1, sm: 3 },
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons="auto"
              sx={{
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                  bgcolor: colors.accent,
                },
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  minHeight: 72,
                  color: "rgba(255,255,255,0.5)",
                  transition: "color 0.2s",
                  "&.Mui-selected": {
                    color: colors.accent,
                  },
                },
              }}
            >
              <Tab label="My Current Plans" />
              <Tab label="Comparative Matrix" />
              <Tab label="Plan Calculator" />
            </Tabs>
          </Box>

          {/* Tab Content Area */}
          <Box
            sx={{
              bgcolor: colors.surface,
              p: { xs: 2, sm: 4 },
              minHeight: "60vh",
              position: "relative",
            }}
          >
            <Fade in={true} timeout={400} key={activeTab}>
              <Box>
                {activeTab === 0 && <MyPlansSection />}
                {activeTab === 1 && <ComparativeMatrixSection />}
                {activeTab === 2 && <CalculatorSection />}
              </Box>
            </Fade>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}