import { useState } from "react";
import useSWR from "swr";
import {
  Box,
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
import MetricCard from "./MetricCard";

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

export default function SP500MiniCard() {
  const [modalOpen, setModalOpen] = useState(false);

  const colors = {
    primary: "#0A2540",
    success: "#10B981",
    danger: "#EF4444",
    accent: "#00D4FF",
    surface: "#FFFFFF",
  };

  const styles = {
    loadingContent: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    loadingSpinner: { color: colors.accent },
    loadingText: { mt: 1 },
    errorContent: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    errorWarningIcon: { fontSize: 20, color: "#F59E0B" },
    errorTitle: { fontWeight: 700, color: "#F59E0B" },
    backgroundPattern: {
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
    },
    watermarkContainer: {
      position: "absolute",
      right: -20,
      bottom: -20,
      // width: 160,
      height: 160,
      zIndex: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    watermarkGlow: (statusColor) => ({
      position: "absolute",
      width: "100%",
      height: "100%",
      background: `radial-gradient(circle at center, ${alpha(statusColor, 0.15)} 0%, transparent 70%)`,
    }),
    watermarkIcon: (statusColor) => ({
      fontSize: 120,
      color: statusColor,
      opacity: 0.1,
      transform: "scaleX(-1) rotate(-10deg)",
    }),
    cardContent: {
      p: 2.5,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      zIndex: 1,
    },
    headerIconContainer: {
      // width: 50,
      height: 30,
      borderRadius: "8px",
      bgcolor: alpha(colors.accent, 0.1),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    headerIcon: { fontSize: 18, color: colors.accent },
    headerTitle: {
      color: colors.primary,
      fontSize: "0.7rem",
    },
    headerSubtitle: {
      color: "text.secondary",
      fontSize: "0.65rem",
      lineHeight: 1,
    },
    demoChip: {
      height: 18,
      fontSize: "0.6rem",
      fontWeight: 800,
      bgcolor: "#FEF3C7",
      color: "#92400E",
    },
    priceText: {
      color: colors.primary,
      letterSpacing: "-0.02em",
      lineHeight: 1,
      mb: 0.5,
    },
    changeChip: (statusColor) => ({
      height: 20,
      fontSize: "0.7rem",
      fontWeight: 700,
      bgcolor: alpha(statusColor, 0.12),
      color: statusColor,
    }),
    footerContainer: {
      pt: 1.5,
      mt: 1.5,
      borderTop: "1px solid #f0f0f0",
    },
    footerText: {
      color: colors.accent,
      fontWeight: 600,
      fontSize: "0.65rem",
      display: "flex",
      alignItems: "center",
      gap: 0.5,
    },
    footerIcon: { fontSize: 12 },
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


  // I need to go, I'll send you those videos and hopefully you can continue from here. If not, please let me know and we can continue refactoring it.
  // The idea is to create a reusable card that takes props to render and thats all.
  // The card content changes based on the component. or actually wait.
  // Make it self contained card. Means, it would take all of these as props and a prop that tells it whether its loading or not. When it's loading, you can show the icon, title, etc, but not the price. I hope it make sense.

  const isPositive = currentData?.change >= 0;
  const isMockData = currentData?.mock === true;
  const statusColor = isPositive ? colors.success : colors.danger;


  let cardContent = null;
  if (currentLoading) {
    cardContent = (
      <Box textAlign="center">
        <CircularProgress size={28} thickness={5} sx={styles.loadingSpinner} />
        <Typography variant="caption" display="block" color="text.secondary" sx={styles.loadingText}>
          Loading...
        </Typography>
      </Box>
    );
  }

  if (currentError && !currentData) {
    cardContent = (
      <Box textAlign="center">
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Warning sx={styles.errorWarningIcon} />
          <Typography variant="body2" sx={styles.errorTitle}>
            Offline
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          Click for details
        </Typography>
      </Box>
    );
  }

  if (currentData) {
    cardContent = (
      <>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={styles.headerIconContainer}
            >
              <ShowChart sx={styles.headerIcon} />
            </Box>
            <Box>
              <Typography variant="caption" fontWeight={700} sx={styles.headerTitle}>
                S&P 500
              </Typography>
              <Typography variant="caption" display="block" sx={styles.headerSubtitle}>
                ^GSPC
              </Typography>
            </Box>
          </Box>

          {isMockData && (
            <Chip
              label="DEMO"
              size="small"
              sx={styles.demoChip}
            />
          )}
        </Box>

        {/* Price */}
        <Box flex={1} display="flex" flexDirection="column" justifyContent="center">
          <Typography
            variant="h5"
            fontWeight={900}
            sx={styles.priceText}
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
              sx={styles.changeChip(statusColor)}
            />
          </Box>
        </Box>

        {/* Footer Hint */}
        <Box
          sx={styles.footerContainer}
        >
          <Typography
            variant="caption"
            sx={styles.footerText}
          >
            <ShowChart sx={styles.footerIcon} />
            Click for detailed view →
          </Typography>
        </Box>
      </>
    );
  }


  return (
    <>
      <MetricCard
        onClick={() => setModalOpen(true)}
        borderColor={isMockData ? "#F59E0B" : "#f1f5f9"}
        hoverBorderColor={colors.accent}
        background={<Box sx={styles.backgroundPattern} />}
        watermark={
          <Box sx={styles.watermarkContainer}>
            <Box sx={styles.watermarkGlow(statusColor)} />
            <ShowChart sx={styles.watermarkIcon(statusColor)} />
          </Box>
        }
        contentSx={styles.cardContent}
      >
        {cardContent}
      </MetricCard>

      <SP500DetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        currentData={currentData}
      />
    </>
  );
}