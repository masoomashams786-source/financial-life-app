import { useState } from "react";
import { AppBar, Toolbar, Box, Typography, IconButton, Button } from "@mui/material";
import { InfoOutlined, NewspaperOutlined, LogoutOutlined } from "@mui/icons-material";
import { useAuth } from "../auth/useAuth";
import NewsModal from "./NewsModal";

export default function Header() {
  const { user, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "news" or "articles"

  // Trust Colors Palette
  const colors = {
    primary: "#0A2540", // Deep navy (Stability/Trust)
    accent: "#00D4FF",  // Clean blue (Modernity/Growth)
    surface: "rgba(255, 255, 255, 0.8)", // Glassmorphism base
    border: "#E6E9F0",
    textSecondary: "#697386"
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
          backdropFilter: "blur(10px)", // Modern glass effect
          borderBottom: `1px solid ${colors.border}`,
          color: colors.primary,
          px: { xs: 1, md: 4 }
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1.5 }}>
          
          {/* Left: Brand Identity */}
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "12px",
                background: `linear-gradient(135deg, ${colors.primary} 0%, #1a3a5a 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(10, 37, 64, 0.15)",
                color: colors.accent,
                fontSize: "1.4rem",
                fontWeight: 800
              }}
            >
              $
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="subtitle1" fontWeight={700} lineHeight={1}>
                FinFuture
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                Secure Analysis
              </Typography>
            </Box>
          </Box>

          {/* Center: Personalized Context */}
          <Box 
            textAlign="center" 
            sx={{ 
              display: { xs: 'none', md: 'block' },
              bgcolor: "#F7F9FC", 
              px: 3, 
              py: 1, 
              borderRadius: "20px" 
            }}
          >
            <Typography variant="body1" fontWeight={600} color={colors.primary}>
              Welcome back, {user?.username || "Investor"}
            </Typography>
            <Typography variant="caption" color={colors.textSecondary} sx={{ display: 'block' }}>
              Your habits today shape your wealth tomorrow
            </Typography>
          </Box>

          {/* Right: Functional Actions */}
          <Box display="flex" alignItems="center" gap={1.5}>
            <IconButton 
              onClick={handleInfoClick}
              sx={{ 
                color: colors.textSecondary,
                transition: "0.2s",
                "&:hover": { color: colors.primary, bgcolor: "rgba(0,0,0,0.04)" }
              }}
            >
              <InfoOutlined fontSize="small" />
            </IconButton>

            <IconButton 
              onClick={handleNewsClick}
              sx={{ 
                color: colors.textSecondary,
                transition: "0.2s",
                "&:hover": { color: colors.primary, bgcolor: "rgba(0,0,0,0.04)" }
              }}
            >
              <NewspaperOutlined fontSize="small" />
            </IconButton>

            <Box sx={{ width: "1px", height: "24px", bgcolor: colors.border, mx: 1 }} />

            <Button
              variant="text"
              color="inherit"
              endIcon={<LogoutOutlined sx={{ fontSize: 18 }} />}
              onClick={logout}
              sx={{ 
                textTransform: "none",
                fontWeight: 600,
                color: colors.textSecondary,
                borderRadius: "8px",
                px: 2,
                "&:hover": { color: "#d32f2f", bgcolor: "rgba(211, 47, 47, 0.04)" }
              }}
            >
              Exit
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* News/Articles Modal */}
      <NewsModal 
        open={modalOpen} 
        onClose={handleCloseModal} 
        type={modalType}
      />
    </>
  );
}