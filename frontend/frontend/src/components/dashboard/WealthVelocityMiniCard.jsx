import { useState } from "react";
import useSWR from "swr";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  alpha,
  Chip,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Speed,
  ShowChart,
  Warning,
} from "@mui/icons-material";
import { wealthVelocityFetcher } from "../../api/wealthVelocity";
import WealthVelocityModal from "./WealthVelocityModal";

export default function WealthVelocityMiniCard() {
  const [modalOpen, setModalOpen] = useState(false);
  
  const { data, error, isLoading } = useSWR(
    "/wealth-velocity",
    wealthVelocityFetcher,
    {
      refreshInterval: 0, // Don't auto-refresh
      revalidateOnFocus: false,
    }
  );

  const colors = {
    primary: "#0A2540",
    success: "#10B981",
    danger: "#EF4444",
    warning: "#F59E0B",
    accent: "#00D4FF",
    surface: "#FFFFFF",
  };

  const formatPercentage = (value) => {
    return `${Math.abs(value).toFixed(1)}%`;
  };

  const getVelocityStatus = () => {
    if (!data) return null;

    if (data.stage === "Debt Payoff Mode") {
    return {
      color: colors.danger,
      icon: <Warning sx={{ fontSize: 18 }} />,
      label: "Debt Mode",
      bgColor: alpha(colors.danger, 0.1),
    };
  }
  
  if (data.stage === "Foundation Building") {
    return {
      color: colors.accent,
      icon: <TrendingUp sx={{ fontSize: 18 }} />,
      label: "Building",
      bgColor: alpha(colors.accent, 0.1),
    };
  }
    
    const velocity = data.velocity;
    const benchmark = data.benchmark;
    
    if (velocity >= 12) {
      return {
        color: colors.success,
        icon: <TrendingUp sx={{ fontSize: 18 }} />,
        label: "Elite",
        bgColor: alpha(colors.success, 0.1),
      };
    } else if (velocity >= 5) {
      return {
        color: colors.accent,
        icon: <TrendingUp sx={{ fontSize: 18 }} />,
        label: "Strong",
        bgColor: alpha(colors.accent, 0.1),
      };
    } else if (velocity >= 0) {
      return {
        color: colors.warning,
        icon: <ShowChart sx={{ fontSize: 18 }} />,
        label: "Fair",
        bgColor: alpha(colors.warning, 0.1),
      };
    } else {
      return {
        color: colors.danger,
        icon: <TrendingDown sx={{ fontSize: 18 }} />,
        label: "Declining",
        bgColor: alpha(colors.danger, 0.1),
      };
    }
  };

  if (isLoading) {
    return (
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid #f1f5f9",
          bgcolor: colors.surface,
          height: "100%",
          minHeight: 140,
          cursor: "wait",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress
            size={28}
            thickness={5}
            sx={{ color: colors.accent }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5 }}>
            Calculating...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid #f1f5f9",
          bgcolor: colors.surface,
          height: "100%",
          minHeight: 140,
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            textAlign: "center",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Update your financial snapshot
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const status = getVelocityStatus();

  return (
    <>
      <Card
        onClick={() => setModalOpen(true)}
        sx={{
          borderRadius: 3,
          boxShadow: "0 8px 16px -6px rgba(10, 37, 64, 0.12)",
          border: "1px solid #f1f5f9",
          bgcolor: colors.surface,
          height: "100%",
          minHeight: 140,
          width: "300px",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 20px 32px -8px rgba(10, 37, 64, 0.2)",
            borderColor: colors.accent,
          },
          "&:active": {
            transform: "translateY(-2px)",
          },
        }}
      >
        {/* Dynamic Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            right: -15,
            top: -15,
            width: 160,
            height: 160,
            background: `radial-gradient(circle at center, ${alpha(
              status.color,
              0.12
            )} 0%, transparent 70%)`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 0,
          }}
        >
          <Speed
            sx={{
              fontSize: 100,
              color: status.color,
              opacity: 0.08,
              transform: "rotate(-15deg)",
            }}
          />
        </Box>

        {/* Subtle Grid Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.03,
            backgroundImage: `linear-gradient(${colors.primary} 1px, transparent 1px), linear-gradient(90deg, ${colors.primary} 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
            zIndex: 0,
          }}
        />

        <CardContent
          sx={{
            p: 2.5,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Header */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={1.5}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 50,
                  height: 30,
                  borderRadius: "8px",
                  bgcolor: alpha(status.color, 0.1),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {status.icon}
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  sx={{ color: colors.primary, fontSize: "0.7rem" }}
                >
                  Wealth Velocity
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.65rem",
                    lineHeight: 1,
                  }}
                >
                  Annual Growth
                </Typography>
              </Box>
            </Box>

            <Chip
              label={status.label}
              size="small"
              sx={{
                height: 18,
                fontSize: "0.6rem",
                fontWeight: 800,
                bgcolor: status.bgColor,
                color: status.color,
              }}
            />
          </Box>

          {/* Amount - Large and Prominent */}
          <Box
            flex={1}
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Typography
              variant="h5"
              fontWeight={900}
              sx={{
                color: colors.primary,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                mb: 0.5,
              }}
            >
              {data.velocity >= 0 ? "+" : ""}
              {formatPercentage(data.velocity)}
            </Typography>

            {/* Status Indicator */}
            <Box display="flex" alignItems="center" gap={0.75}>
              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ color: status.color }}
              >
                {data.benchmark.description}
              </Typography>
            </Box>
          </Box>

          {/* Footer Hint */}
          <Box
            sx={{
              pt: 1.5,
              mt: 1.5,
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: colors.accent,
                fontWeight: 600,
                fontSize: "0.65rem",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <ShowChart sx={{ fontSize: 12 }} />
              Click for detailed analysis →
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <WealthVelocityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={data}
      />
    </>
  );
}