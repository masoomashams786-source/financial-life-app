import React from "react";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { ErrorOutline, Refresh } from "@mui/icons-material";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error("❌ Error caught by boundary:", error);
    console.error("📍 Error info:", errorInfo);

    this.setState({
      error,
      errorInfo,
      errorCount: this.state.errorCount + 1,
    });

    // TODO: Send to error tracking service
    // Example: Sentry.captureException(error);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm">
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 3,
                textAlign: "center",
                maxWidth: 500,
              }}
            >
              <ErrorOutline
                sx={{ fontSize: 80, color: "error.main", mb: 2 }}
              />

              <Typography variant="h5" fontWeight={700} gutterBottom>
                Oops! Something went wrong
              </Typography>

              <Typography variant="body2" color="text.secondary" mb={3}>
                {this.state.errorCount > 2
                  ? "This error keeps happening. Please try reloading the page or contact support."
                  : "We're sorry for the inconvenience. The error has been logged and our team will look into it."}
              </Typography>

              <Box display="flex" gap={2} justifyContent="center">
                <Button
                  variant="outlined"
                  onClick={this.handleReset}
                  startIcon={<Refresh />}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Try Again
                </Button>

                <Button
                  variant="contained"
                  onClick={this.handleReload}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Reload Page
                </Button>
              </Box>

              {/* Show error details in development */}
              {import.meta.env.DEV && this.state.error && (
                <Box
                  sx={{
                    mt: 4,
                    p: 2,
                    bgcolor: "#f5f5f5",
                    borderRadius: 2,
                    textAlign: "left",
                    maxWidth: "100%",
                    overflow: "auto",
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    display="block"
                    mb={1}
                  >
                    🐛 Error Details (Dev Only):
                  </Typography>
                  <Typography
                    variant="caption"
                    component="pre"
                    sx={{
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      fontSize: "0.75rem",
                      fontFamily: "monospace",
                    }}
                  >
                    {this.state.error.toString()}
                    {"\n\n"}
                    {this.state.errorInfo?.componentStack}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;