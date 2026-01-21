import { Box, Typography, Card, CardContent, LinearProgress, Chip } from "@mui/material";
import { TrendingUp, TrendingDown, Remove } from "@mui/icons-material";
import useSWR from "swr";
import { insightsFetcher } from "../../api/insights";
import LoadingSpinner from "../../components/dashboard/LoadingSpinner";
import ErrorAlert from "../../components/ErrorAlert";

export default function FinancialHealthScore() {

  const {
    data,
    error,
    isLoading,
  } = useSWR("/insights/analysis", insightsFetcher);
  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (error) {
    return <ErrorAlert message="Failed to load financial health score" />;
  }

  // To avoid renaming the code to use "data" rather than "analysis", I'll just assign it to a variable for now
  const analysis = data;

  if (!analysis || !analysis.health_score) {
    return null;
  }

  const { health_score } = analysis;
  const score = health_score.score;
  const rating = health_score.rating;
  const breakdown = health_score.breakdown;

  const getScoreColor = (score) => {
    if (score >= 80) return "#10B981";
    if (score >= 70) return "#00D4FF";
    if (score >= 60) return "#F59E0B";
    return "#EF4444";
  };

  const getStatusIcon = (status) => {
    if (status === "excellent" || status === "elite" || status === "good") {
      return <TrendingUp sx={{ fontSize: 16, color: "#10B981" }} />;
    }
    if (status === "fair") {
      return <Remove sx={{ fontSize: 16, color: "#F59E0B" }} />;
    }
    return <TrendingDown sx={{ fontSize: 16, color: "#EF4444" }} />;
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        {/* Overall Score */}
        <Box textAlign="center" mb={4}>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Financial Health Score
          </Typography>
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: `8px solid ${getScoreColor(score)}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              mb: 2,
            }}
          >
            <Typography variant="h3" fontWeight={700} color={getScoreColor(score)}>
              {score}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              / 100
            </Typography>
          </Box>
          <Chip
            label={rating}
            sx={{
              bgcolor: `${getScoreColor(score)}20`,
              color: getScoreColor(score),
              fontWeight: 700,
            }}
          />
        </Box>

        {/* Category Breakdown */}
        <Box>
          <Typography variant="subtitle2" fontWeight={700} mb={2}>
            Score Breakdown
          </Typography>

          {Object.entries(breakdown).map(([key, data]) => (
            <Box key={key} mb={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                <Box display="flex" alignItems="center" gap={1}>
                  {getStatusIcon(data.status)}
                  <Typography variant="body2" fontWeight={600} sx={{ textTransform: "capitalize" }}>
                    {key.replace("_", " ")}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {data.score}/{data.max}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(data.score / data.max) * 100}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: "#f0f0f0",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: getScoreColor((data.score / data.max) * 100),
                  },
                }}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}