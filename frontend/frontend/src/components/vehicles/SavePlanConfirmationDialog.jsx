import { Save } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { mutate } from "swr";
import { createFinancialPlan } from "../../api/financialPlans";
import { formatCurrency } from "./utils";
import { useState } from "react";

export default function SavePlanConfirmationDialog({
  planToSave,
  isOpen,
  onClose,
  onSavePlan,
  isSaving,
}) {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Save Plan to My Plans</DialogTitle>
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          This will save the projected values to "My Current Plans" for
          tracking.
        </Alert>
        <RenderPlan planToSave={planToSave} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSavePlan}
          disabled={isSaving}
          startIcon={isSaving ? <CircularProgress size={20} /> : <Save />}
        >
          {isSaving ? "Saving..." : "Save Plan"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const RenderPlan = ({ planToSave }) => {
  if (!planToSave) return null;
  const planCase = planToSave[planToSave.scenario];
  return (
    <Box>
      <Typography variant="body2" gutterBottom>
        <strong>Plan:</strong> {planToSave?.plan_type}
      </Typography>
      <Typography variant="body2" gutterBottom>
        <strong>Scenario:</strong> {planToSave?.scenario.replace("_", " ")}
      </Typography>
      <Typography variant="body2" gutterBottom>
        <strong>Projected Cash Value:</strong>{" "}
        {formatCurrency(planCase?.cash_value)}
      </Typography>
      <Typography variant="body2" gutterBottom>
        <strong>Annual Income:</strong>{" "}
        {formatCurrency(planCase?.annual_income_after_tax)}
      </Typography>
    </Box>
  );
};
