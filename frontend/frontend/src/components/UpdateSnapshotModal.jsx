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
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { updateFinancialSnapshot } from "../api/financialSnapshot";

export default function UpdateSnapshotModal({ open, onClose, currentData, onSuccess }) {
  const [formData, setFormData] = useState({
    net_income: 0,
    monthly_expenses: 0,
    savings: 0,
    investments: 0,
    debt: 0,
    side_income: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentData) {
      setFormData({
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
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await updateFinancialSnapshot(formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update snapshot");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>Update Financial Snapshot</Box>
        <IconButton onClick={onClose} edge="end">
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              fullWidth
              label="Net Income (After Tax)"
              name="net_income"
              type="number"
              value={formData.net_income}
              onChange={handleChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              helperText="Monthly income after taxes"
            />

            <TextField
              fullWidth
              label="Monthly Expenses"
              name="monthly_expenses"
              type="number"
              value={formData.monthly_expenses}
              onChange={handleChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              helperText="Total monthly expenses"
            />

            <TextField
              fullWidth
              label="Savings"
              name="savings"
              type="number"
              value={formData.savings}
              onChange={handleChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              helperText="Total savings balance"
            />

            <TextField
              fullWidth
              label="Investments"
              name="investments"
              type="number"
              value={formData.investments}
              onChange={handleChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              helperText="Total investment value"
            />

            <TextField
              fullWidth
              label="Debt"
              name="debt"
              type="number"
              value={formData.debt}
              onChange={handleChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              helperText="Total debt amount"
            />

            <TextField
              fullWidth
              label="Side Income"
              name="side_income"
              type="number"
              value={formData.side_income}
              onChange={handleChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              helperText="Monthly side income"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ minWidth: 100 }}
          >
            {loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}