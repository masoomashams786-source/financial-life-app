import { useState } from "react";
import useSWR from "swr";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Chip,
  alpha,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  ShowChart,
  Warning,
} from "@mui/icons-material";
import { sp500Fetcher } from "../../api/sp500";
import SP500DetailModal from "./SP500DetailModal";

export default function SP500MiniCard() {
  const [modalOpen, setModalOpen] = useState(false);

  const colors = {
    primary: "#0A2540",
    success: "#10B981",
    danger: "#EF4444",
    accent: "#00D4FF",
    surface: "#FFFFFF",
  };

  const {
    data: currentData,
    error: currentError,
    isLoading: currentLoading,
  } = useSWR("/sp500/current", sp500Fetcher, {
    refreshInterval: 300000,
    revalidateOnFocus: false,
    shouldRetryOnError: true,
    errorRetryCount: 3,
    dedupingInterval: 60000,
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
  };

  if (currentLoading) {
    return (
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid #f1f5f9",
          height: "100%",
          minHeight: 140,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box textAlign="center">
          <CircularProgress size={28} thickness={5} sx={{ color: colors.accent }} />
          <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
            Loading...
          </Typography>
        </Box>
      </Card>
    );
  }

  if (currentError && !currentData) {
    return (
      <Card
        onClick={() => setModalOpen(true)}
        sx={{
          borderRadius: 3,
          border: "1px solid #F59E0B",
          height: "100%",
          minHeight: 140,
          cursor: "pointer",
        }}
      >
        <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Warning sx={{ fontSize: 20, color: "#F59E0B" }} />
            <Typography variant="body2" fontWeight={700} color="#F59E0B">
              Offline
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Click for details
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const isPositive = currentData?.change >= 0;
  const isMockData = currentData?.mock === true;
  const statusColor = isPositive ? colors.success : colors.danger;

  return (
    <>
      <Card
        onClick={() => setModalOpen(true)}
        sx={{
          borderRadius: 3,
          boxShadow: "0 8px 16px -6px rgba(10, 37, 64, 0.12)",
          border: `1px solid ${isMockData ? "#F59E0B" : "#f1f5f9"}`,
          bgcolor: colors.surface,
          height: "100%",
          width: "300px",
          minHeight: 140,
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 20px 32px -8px rgba(10, 37, 64, 0.2)",
            borderColor: colors.accent,
          },
        }}
      >
        {/* BACKGROUND PATTERN LAYER */}
        {/* 1. Geometric Data Lines (Ticker Tape effect) */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.04,
            background: `repeating-linear-gradient(
              -45deg,
              ${colors.primary},
              ${colors.primary} 1px,
              transparent 1px,
              transparent 12px
            )`,
            zIndex: 0,
          }}
        />

        {/* 2. Radial Glow & Market Icon Watermark */}
        <Box
          sx={{
            position: "absolute",
            right: -20,
            bottom: -20,
            width: 160,
            height: 160,
            zIndex: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              background: `radial-gradient(circle at center, ${alpha(statusColor, 0.15)} 0%, transparent 70%)`,
            }}
          />
          <ShowChart 
            sx={{ 
              fontSize: 120, 
              color: statusColor, 
              opacity: 0.1, 
              transform: "scaleX(-1) rotate(-10deg)" 
            }} 
          />
        </Box>

        {/* CONTENT LAYER */}
        <CardContent 
          sx={{ 
            p: 2.5, 
            height: "100%", 
            display: "flex", 
            flexDirection: "column", 
            position: "relative", 
            zIndex: 1 
          }}
        >
          {/* Header */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 50,
                  height: 30,
                  borderRadius: "8px",
                  bgcolor: alpha(colors.accent, 0.1),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShowChart sx={{ fontSize: 18, color: colors.accent }} />
              </Box>
              <Box>
                <Typography variant="caption" fontWeight={700} sx={{ color: colors.primary, fontSize: "0.7rem" }}>
                  S&P 500
                </Typography>
                <Typography variant="caption" display="block" sx={{ color: "text.secondary", fontSize: "0.65rem", lineHeight: 1 }}>
                  ^GSPC
                </Typography>
              </Box>
            </Box>

            {isMockData && (
              <Chip
                label="DEMO"
                size="small"
                sx={{
                  height: 18,
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  bgcolor: "#FEF3C7",
                  color: "#92400E",
                }}
              />
            )}
          </Box>

          {/* Price */}
          <Box flex={1} display="flex" flexDirection="column" justifyContent="center">
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
              {formatCurrency(currentData?.current_price || 0)}
            </Typography>

            {/* Change Indicator */}
            <Box display="flex" alignItems="center" gap={0.75}>
              {isPositive ? (
                <TrendingUp sx={{ fontSize: 16, color: colors.success }} />
              ) : (
                <TrendingDown sx={{ fontSize: 16, color: colors.danger }} />
              )}
              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ color: statusColor }}
              >
                {formatCurrency(Math.abs(currentData?.change || 0))}
              </Typography>
              <Chip
                label={formatPercent(currentData?.percent_change || 0)}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  bgcolor: alpha(statusColor, 0.12),
                  color: statusColor,
                }}
              />
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
              Click for detailed view →
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <SP500DetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        currentData={currentData}
      />
    </>
  );
}