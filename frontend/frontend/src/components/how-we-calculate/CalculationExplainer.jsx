import { useState } from "react";
import { Box, Tabs, Tab, Paper, alpha } from "@mui/material";
import {
  Speed,
  AccountBalanceWallet,
  TrendingUp,
  LocalHospital,
  Lightbulb,
} from "@mui/icons-material";
import WealthVelocityExplainer from "./WealthVelocityExplainer";
import CashFlowExplainer from "./CashFlowExplainer";
import ProjectionExplainer from "./ProjectionExplainer";
import HealthScoreExplainer from "./HealthScoreExplainer";
import InsightsExplainer from "./InsightsExplainer";

export default function CalculationExplainer() {
  const [activeTab, setActiveTab] = useState(0);

  const colors = {
    primary: "#0A2540",
    accent: "#00D4FF",
    surface: "#FFFFFF",
  };

  const tabs = [
    {
      label: "Wealth Velocity",
      icon: <Speed />,
      component: <WealthVelocityExplainer />,
    },
    {
      label: "Cash Flow", 
      icon: <AccountBalanceWallet />,
      component: <CashFlowExplainer />,
    },
     {
      label: "Projections", 
      icon: <TrendingUp />,
      component: <ProjectionExplainer />,
    },
     {
      label: "Health Score", 
      icon: <LocalHospital />,
      component: <HealthScoreExplainer />,
    },
    {
      label: "Insights", 
      icon: <Lightbulb />,
      component: <InsightsExplainer />,
    },
   
  ];

  return (
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
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
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
              minHeight: 64,
              color: "rgba(255,255,255,0.5)",
              transition: "color 0.2s",
              "&.Mui-selected": {
                color: colors.accent,
              },
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box
        sx={{
          bgcolor: colors.surface,
          p: { xs: 3, sm: 5 },
          minHeight: "60vh",
        }}
      >
        {tabs[activeTab].component}
      </Box>
    </Paper>
  );
}