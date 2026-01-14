import { useState } from "react";
import { AppBar, Toolbar, Box, Typography, IconButton, Button, Stack, useTheme, useMediaQuery } from "@mui/material";
import { InfoOutlined, NewspaperOutlined, LogoutOutlined } from "@mui/icons-material";
import { useAuth } from "../auth/useAuth";
import NewsModal from "./NewsModal";

export default function Header() {
  const { user, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "news" or "articles"
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Trust Colors Palette
  const colors = {
    primary: "#0A2540",
    accent: "#00D4FF",
    surface: "rgba(255, 255, 255, 0.9)",
    border: "rgba(226, 232, 240, 0.8)",
    textSecondary: "#64748b"
  };

  const handleInfoClick = () => {
    setModalType("articles");
    setModalOpen(true);
  };

  const handleNewsClick = () => {
    setModalType("news");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: colors.surface, 
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${colors.border}`,
          color: colors.primary,
          px: { xs: 0, md: 2 },
          width: "100%",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          
          {/* Left: Brand Identity */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "10px",
                background: `linear-gradient(135deg, ${colors.primary} 0%, #1e3a8a 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 16px -4px rgba(10, 37, 64, 0.3)",
                color: colors.accent,
                fontSize: "1.2rem",
                fontWeight: 900
              }}
            >
              $
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography 
                variant="subtitle1" 
                fontWeight={800} 
                sx={{ letterSpacing: "-0.02em", lineHeight: 1.1 }}
              >
                FinFuture
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ color: colors.textSecondary, fontWeight: 500, letterSpacing: "0.02em" }}
              >
                INSIGHT ENGINE
              </Typography>
            </Box>
          </Stack>

          {/* Center: Personalized Context (Hidden on mobile) */}
          {!isMobile && (
            <Box 
              sx={{ 
                bgcolor: "rgba(10, 37, 64, 0.04)", 
                px: 3, 
                py: 0.75, 
                borderRadius: "100px",
                border: "1px solid rgba(10, 37, 64, 0.05)"
              }}
            >
              <Typography variant="body2" fontWeight={600} color={colors.primary}>
                Welcome back, <Box component="span" sx={{ color: "#2563eb" }}>{user?.username || "Investor"}</Box>
              </Typography>
            </Box>
          )}

          {/* Right: Functional Actions */}
          <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
            <IconButton 
              onClick={handleInfoClick}
              size="small"
              sx={{ 
                color: colors.textSecondary,
                transition: "all 0.2s",
                "&:hover": { color: colors.primary, bgcolor: "rgba(10, 37, 64, 0.05)" }
              }}
            >
              <InfoOutlined fontSize="small" />
            </IconButton>

            <IconButton 
              onClick={handleNewsClick}
              size="small"
              sx={{ 
                color: colors.textSecondary,
                transition: "all 0.2s",
                "&:hover": { color: colors.primary, bgcolor: "rgba(10, 37, 64, 0.05)" }
              }}
            >
              <NewspaperOutlined fontSize="small" />
            </IconButton>

            <Box sx={{ width: "1px", height: "20px", bgcolor: colors.border, mx: 1 }} />

            <Button
              variant="text"
              color="inherit"
              size="small"
              endIcon={<LogoutOutlined sx={{ fontSize: 16 }} />}
              onClick={logout}
              sx={{ 
                textTransform: "none",
                fontWeight: 700,
                color: colors.textSecondary,
                borderRadius: "8px",
                px: { xs: 1, sm: 2 },
                "&:hover": { 
                  color: "#e11d48", 
                  bgcolor: "rgba(225, 29, 72, 0.05)" 
                }
              }}
            >
              {isMobile ? "" : "Exit"}
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <NewsModal 
        open={modalOpen} 
        onClose={handleCloseModal} 
        type={modalType}
      />
    </>
  );
}