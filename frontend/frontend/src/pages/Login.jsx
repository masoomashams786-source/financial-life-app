import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Container,
  Paper,
  InputAdornment,
  CircularProgress,
  Link,
  IconButton,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import {
  MailOutline,
  LockOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { loginUser } from "../api/auth";
import { useAuth } from "../auth/useAuth";

// ============================================
// CONSTANTS
// ============================================
const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_PASSWORD_LENGTH: 6,
  ERRORS: {
    INVALID_EMAIL: "Please enter a valid email address",
    INVALID_PASSWORD: "Password must be at least 6 characters",
    NETWORK_ERROR: "Network error. Please check your connection",
    TIMEOUT_ERROR: "Request timeout. Please try again",
    GENERIC_ERROR: "Login failed. Please try again",
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Validates login form inputs
 * @param {Object} form - Form data with email and password
 * @returns {string|null} Error message or null if valid
 */
const validateLoginForm = (form) => {
  if (!form.email.trim()) {
    return "Email is required";
  }
  
  if (!VALIDATION.EMAIL_REGEX.test(form.email)) {
    return VALIDATION.ERRORS.INVALID_EMAIL;
  }
  
  if (!form.password) {
    return "Password is required";
  }
  
  if (form.password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
    return VALIDATION.ERRORS.INVALID_PASSWORD;
  }
  
  return null;
};

/**
 * Extracts user-friendly error message from API error
 * @param {Object} error - Axios error object
 * @returns {string} User-friendly error message
 */
const getErrorMessage = (error) => {
  // Network timeout
  if (error.code === 'ECONNABORTED') {
    return VALIDATION.ERRORS.TIMEOUT_ERROR;
  }
  
  // No response (network error)
  if (!error.response) {
    return VALIDATION.ERRORS.NETWORK_ERROR;
  }
  
  // HTTP 401 - Invalid credentials
  if (error.response.status === 401) {
    return "Invalid email or password";
  }
  
  // HTTP 429 - Rate limit
  if (error.response.status === 429) {
    return "Too many attempts. Please try again later";
  }
  
  // Server provided error message
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  
  // Fallback
  return VALIDATION.ERRORS.GENERIC_ERROR;
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // ============================================
  // EVENT HANDLERS
  // ============================================
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    //  Step 1: Client-side validation (before loading state)
    const validationError = validateLoginForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Step 2: Set loading state for async operation
    setLoading(true);

    try {
      //  Step 3: API call
      const res = await loginUser({
        email: form.email.trim().toLowerCase(),
        password: form.password
      });
      
      //  Step 4: Validate response
      if (!res.data?.access_token) {
        throw new Error("Invalid response from server");
      }
      
      // Step 5: Update auth context
      login(res.data.access_token);
      
      // Step 6: Show success feedback
      setOpenSnackbar(true);
      
      // Step 7: Navigate to dashboard
      navigate("/dashboard", { replace: true });
      
    } catch (err) {
      // Step 8: Handle errors gracefully
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      
      // Log for debugging (can integrate with Sentry/LogRocket in production)
      if (process.env.NODE_ENV === 'development') {
        console.error("Login error:", err);
      }
      
    } finally {
      //  Step 9: Always cleanup loading state
      setLoading(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: 3,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Typography
              variant="h4"
              fontWeight="700"
              color="primary.main"
              gutterBottom
            >
              Login
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Welcome back! Please enter your credentials.
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
              error={error && error.toLowerCase().includes('email')}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutline color="action" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            {/* Password Field */}
            <TextField
              fullWidth
              label="Password"
              name="password"
              autoComplete="current-password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
              error={error && error.toLowerCase().includes('password')}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={loading}
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            {/* Submit Button */}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                boxShadow: "0px 4px 12px rgba(25, 118, 210, 0.3)",
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Log In"
              )}
            </Button>

            {/* Sign Up Link */}
            <Box mt={3} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/register"
                  underline="hover"
                  fontWeight="600"
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          Login successful!
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}