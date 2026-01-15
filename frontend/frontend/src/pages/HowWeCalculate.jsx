import { Box, Container, IconButton, Typography, Stack } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import CalculationExplainer from "../components/how-we-calculate/CalculationExplainer";

export default function HowWeCalculate() {
  const navigate = useNavigate();

  const colors = {
    background: "#0f172a",
    surface: "rgba(255, 255, 255, 0.98)",
    primary: "#0A2540",
    accent: "#00D4FF",
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: colors.background,
        backgroundImage:
          "radial-gradient(at 100% 0%, rgba(0, 212, 255, 0.05) 0, transparent 50%)",
        pb: 8,
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
                  transform: "translateX(-4px)",
                },
              }}
            >
              <ArrowBack fontSize="small" />
            </IconButton>
            <Box>
              <Typography
                variant="h4"
                fontWeight={800}
                color="white"
                sx={{ letterSpacing: "-0.02em" }}
              >
                How We Calculate Your Numbers
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "rgba(255,255,255,0.6)", mt: 0.5 }}
              >
                Transparent methodology behind every metric
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Main Content */}
        <CalculationExplainer />
      </Container>
    </Box>
  );
}