import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Button,
  IconButton,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import Header from "../components/header";
import MyPlansSection from "../components/vehicles/MyPlansSection";
import ComparativeMatrixSection from "../components/vehicles/ComparativeMatrixSection";
import CalculatorSection from "../components/vehicles/CalculatorSection";

export default function FinancialVehicles() {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  const colors = {
    primary: "#0A2540",
    accent: "#00D4FF",
    background: "#16385aff",
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: colors.background }}>
      <Header />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Page Header */}
        <Box mb={4}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <IconButton
              onClick={() => navigate("/dashboard")}
              sx={{
                bgcolor: "rgba(255,255,255,0.1)",
                color: "white",
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
              }}
            >
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h4" fontWeight={700} color="white">
                Financial Vehicles Hub
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                Manage, compare, and calculate your financial plans
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Tab Navigation */}
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: "12px 12px 0 0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              px: 2,
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                minHeight: 64,
              },
              "& .Mui-selected": {
                color: colors.primary,
              },
            }}
          >
            <Tab label="My Current Plans" />
            <Tab label="Comparative Matrix" />
            <Tab label="Plan Calculator" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: "0 0 12px 12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            minHeight: "60vh",
          }}
        >
          {activeTab === 0 && <MyPlansSection />}
          {activeTab === 1 && <ComparativeMatrixSection />}
          {activeTab === 2 && <CalculatorSection />}
        </Box>
      </Container>
    </Box>
  );
}