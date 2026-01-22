import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Alert,
  InputAdornment,
  CircularProgress,
  Typography,
  Grid,
} from "@mui/material";
import { Close, Save, Cake } from "@mui/icons-material";
import { updateFinancialSnapshot } from "../api/financialSnapshot";
import { mutate } from "swr"; // ✅ Import mutate

export default function UpdateSnapshotModal({
  open,
  onClose,
  currentData,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    age: "",
    net_income: 0,
    monthly_expenses: 0,
    savings: 0,
    investments: 0,
    debt: 0,
    side_income: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const colors = {
    primary: "#0A2540",
    accent: "#00D4FF",
    border: "#f1f5f9",
  };

  useEffect(() => {
    if (currentData) {
      setFormData({
        age: currentData.age || "",
        net_income: currentData.net_income || 0,
        monthly_expenses: currentData.monthly_expenses || 0,
        savings: currentData.savings || 0,
        investments: currentData.investments || 0,
        debt: currentData.debt || 0,
        side_income: currentData.side_income || 0,
      });
    }
  }, [currentData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle age separately (integer, not float)
    if (name === "age") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? null : parseInt(value, 10),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.age || formData.age < 1 || formData.age > 120) {
      setError("Please enter a valid age.");
      setLoading(false);
      return;
    }

    try {
      await updateFinancialSnapshot(formData);
      
      // Trigger SWR revalidation for all affected endpoints
      mutate("/financial-snapshot");
      mutate("/insights/analysis");
      mutate("/projections/all-scenarios");
      mutate("/wealth-velocity");
      
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update snapshot");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 4, boxShadow: "0 24px 48px rgba(0,0,0,0.2)" },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: colors.primary,
          color: "white",
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2 }}>
            Update Snapshot
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "rgba(255,255,255,0.6)", fontWeight: 500 }}
          >
            Adjust your current financial standing
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: "white",
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 4, bgcolor: "#fafafa" }}>
          {error && (
            <Alert
              severity="error"
              variant="filled"
              sx={{ mb: 3, borderRadius: 2 }}
            >
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Your Current Age"
                name="age"
                type="number"
                variant="outlined"
                value={formData.age}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Cake sx={{ color: colors.accent }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2, bgcolor: "white" },
                }}
                helperText="This is used for all retirement projections"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderColor: colors.accent,
                  },
                }}
              />
            </Grid>
            {[
              {
                label: "Net Income",
                name: "net_income",
                helper: "After-tax monthly",
              },
              {
                label: "Side Income",
                name: "side_income",
                helper: "Extra monthly earnings",
              },
              {
                label: "Monthly Expenses",
                name: "monthly_expenses",
                helper: "Total bills & costs",
              },
              {
                label: "Savings",
                name: "savings",
                helper: "Total cash liquid",
              },
              {
                label: "Investments",
                name: "investments",
                helper: "Total market value",
              },
              {
                label: "Total Debt",
                name: "debt",
                helper: "Liabilities & loans",
              },
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  type="number"
                  variant="outlined"
                  value={formData[field.name]}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography
                          sx={{ color: "text.secondary", fontWeight: 700 }}
                        >
                          $
                        </Typography>
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2, bgcolor: "white" },
                  }}
                  helperText={field.helper}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            bgcolor: "white",
            borderTop: `1px solid ${colors.border}`,
          }}
        >
          <Button
            onClick={onClose}
            disabled={loading}
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={!loading && <Save />}
            sx={{
              minWidth: 120,
              borderRadius: 2,
              py: 1,
              textTransform: "none",
              fontWeight: 700,
              bgcolor: colors.primary,
              boxShadow: "0 4px 12px rgba(10, 37, 64, 0.2)",
              "&:hover": { bgcolor: "#1a365d" },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}