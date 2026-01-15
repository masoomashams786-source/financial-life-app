import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  alpha,
  Chip,
} from "@mui/material";
import {
  InfoOutlined,
  Calculate,
  ArrowForward,
} from "@mui/icons-material";

export default function HowWeCalculateMiniCard() {
  const navigate = useNavigate();

  const colors = {
    primary: "#0A2540",
    purple: "#8B5CF6",
    surface: "#FFFFFF",
  };

  const handleClick = () => {
    navigate("/how-we-calculate");
  };

  return (
    <Card
      onClick={handleClick}
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
          borderColor: colors.purple,
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
            colors.purple,
            0.12
          )} 0%, transparent 70%)`,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 0,
        }}
      >
        <Calculate
          sx={{
            fontSize: 100,
            color: colors.purple,
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
                bgcolor: alpha(colors.purple, 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <InfoOutlined sx={{ fontSize: 18, color: colors.purple }} />
            </Box>
            <Box>
              <Typography
                variant="caption"
                fontWeight={700}
                sx={{ color: colors.primary, fontSize: "0.7rem" }}
              >
                How We Calculate
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
                Transparency
              </Typography>
            </Box>
          </Box>

          <Chip
            label="Learn"
            size="small"
            sx={{
              height: 18,
              fontSize: "0.6rem",
              fontWeight: 800,
              bgcolor: alpha(colors.purple, 0.1),
              color: colors.purple,
            }}
          />
        </Box>

        {/* Main Content */}
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{
              color: colors.primary,
              fontSize: "0.85rem",
              lineHeight: 1.4,
              mb: 1,
            }}
          >
            Understand Our Methodology
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontSize: "0.75rem",
              lineHeight: 1.5,
            }}
          >
            Learn how we analyze your financial health, projections, and wealth velocity
          </Typography>
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
              color: colors.purple,
              fontWeight: 600,
              fontSize: "0.65rem",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Calculate sx={{ fontSize: 12 }} />
            Click to learn more
            <ArrowForward sx={{ fontSize: 12, ml: 0.5 }} />
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}