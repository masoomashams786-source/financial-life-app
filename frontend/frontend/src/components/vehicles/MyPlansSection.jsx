import { useState } from "react";
import useSWR, { mutate } from "swr";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  Chip,
  Paper,
  Stack,
  alpha,
} from "@mui/material";
import { Add, Edit, Delete, InfoOutlined, Warning, Layers } from "@mui/icons-material";
import {
  financialPlansFetcher,
  deleteFinancialPlan,
} from "../../api/financialPlans";
import PlanFormModal from "./PlanFormModal";

export default function MyPlansSection() {
  const { data: plans, error, isLoading } = useSWR("/financial-plans", financialPlansFetcher);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  const colors = {
    primary: "#0A2540",
    accent: "#00D4FF",
    success: "#10B981",
    danger: "#EF4444",
    border: "#f1f5f9",
    softBg: "#F8FAFC",
  };

  const handleAddPlan = () => {
    setEditingPlan(null);
    setModalOpen(true);
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setModalOpen(true);
  };

  const handleDeleteClick = (plan) => {
    setPlanToDelete(plan);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteFinancialPlan(planToDelete.id);
      setDeleteConfirmOpen(false);
      setPlanToDelete(null);
      mutate("/financial-plans");
      mutate("/financial-plans/summary");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={12}>
        <CircularProgress thickness={5} size={40} sx={{ color: colors.accent }} />
      </Box>
    );
  }

  return (
    <Box sx={{bgcolor: "#e4eaf0ff", p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Stack 
        direction={{ xs: "column", sm: "row" }} 
        justifyContent="space-between" 
        alignItems={{ xs: "flex-start", sm: "center" }} 
        spacing={2} 
        mb={4}
      >
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ color: colors.primary, letterSpacing: "-0.02em" }}>
            Wealth Portfolio Plans
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Manage your retirement accounts and projected income streams
          </Typography>
        </Box>
        <Button
          variant="contained"
          disableElevation
          startIcon={<Add />}
          onClick={handleAddPlan}
          sx={{
            bgcolor: colors.primary,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
            px: 3,
            "&:hover": { bgcolor: "#1a365d" },
          }}
        >
          Add New Plan
        </Button>
      </Stack>

      {/* Advisory Section */}
      <Stack spacing={2} mb={4}>
        <Alert 
          severity="info" 
          icon={<InfoOutlined sx={{ color: colors.accent }} />} 
          sx={{ borderRadius: 3, bgcolor: alpha(colors.accent, 0.05), border: `1px solid ${alpha(colors.accent, 0.1)}` }}
        >
          <Typography variant="body2" fontWeight={500}>
            Results generated from the <strong>Calculator</strong> can be saved here to track your total projected net worth.
          </Typography>
        </Alert>

        <Alert 
          severity="warning" 
          icon={<Warning sx={{ color: "#F59E0B" }} />} 
          sx={{ borderRadius: 3, bgcolor: "#FFFBEB", border: "1px solid #FEF3C7" }}
        >
          <Typography variant="body2" color="#92400E">
            <strong>IRS Compliance:</strong> Ensure you only select one primary 401k/IRA type per fiscal year to avoid tax penalties.
          </Typography>
        </Alert>
      </Stack>

      {/* Plans Table */}
      {plans && plans.length > 0 ? (
        <TableContainer 
          component={Paper} 
          elevation={0} 
          sx={{ border: `1px solid ${colors.border}`, borderRadius: 4, overflow: "hidden" }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: colors.softBg }}>
                <TableCell sx={{ fontWeight: 800, color: colors.primary }}>Plan Type</TableCell>
                <TableCell sx={{ fontWeight: 800, color: colors.primary }}>Cash Value</TableCell>
                <TableCell sx={{ fontWeight: 800, color: colors.primary }}>Monthly Contribution</TableCell>
                <TableCell sx={{ fontWeight: 800, color: colors.primary }}>Annual Income</TableCell>
                <TableCell sx={{ fontWeight: 800, color: colors.primary }}>Age Range</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: colors.primary }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plans.map((plan) => (
                <TableRow 
                  key={plan.id} 
                  hover 
                  sx={{ "&:last-child td, &:last-child th": { border: 0 }, transition: "0.2s" }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{ p: 1, bgcolor: alpha(colors.primary, 0.04), borderRadius: 1.5, display: "flex" }}>
                        <Layers sx={{ fontSize: 18, color: colors.primary }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight={700} sx={{ color: colors.primary }}>
                          {plan.plan_type}
                        </Typography>
                        {plan.notes?.includes("projection") && (
                          <Chip label="AI Projection" size="small" sx={{ height: 18, fontSize: "0.6rem", fontWeight: 800, bgcolor: alpha(colors.accent, 0.1), color: colors.accent }} />
                        )}
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={700}>{formatCurrency(plan.cash_value)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{formatCurrency(plan.monthly_contribution)}<small>/mo</small></Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={700} sx={{ color: colors.success }}>
                      {formatCurrency(plan.income_rate)}<small>/yr</small>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={plan.income_start_age ? `${plan.income_start_age} — ${plan.income_end_age}` : "Not Active"} 
                      size="small" 
                      variant="outlined" 
                      sx={{ borderRadius: 1.5, fontWeight: 600, color: "text.secondary" }} 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <IconButton size="small" onClick={() => handleEditPlan(plan)} sx={{ color: colors.accent, "&:hover": { bgcolor: alpha(colors.accent, 0.05) } }}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteClick(plan)} sx={{ color: colors.danger, "&:hover": { bgcolor: alpha(colors.danger, 0.05) } }}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper 
          variant="outlined" 
          sx={{ py: 10, textAlign: "center", borderRadius: 4, borderStyle: "dashed", bgcolor: colors.softBg }}
        >
          <Typography variant="h6" fontWeight={700} color={colors.primary}>Build Your Wealth Roadmap</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>No financial plans have been added to your profile yet.</Typography>
          <Button variant="outlined" startIcon={<Add />} onClick={handleAddPlan} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}>
            Create Initial Plan
          </Button>
        </Paper>
      )}

      {/* Confirmation Dialog */}
      <Dialog 
        open={deleteConfirmOpen} 
        onClose={() => setDeleteConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight={800} gutterBottom>Delete Plan?</Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            This will permanently remove the <strong>{planToDelete?.plan_type}</strong> from your records. This action cannot be reversed.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={() => setDeleteConfirmOpen(false)} sx={{ color: "text.secondary", fontWeight: 700 }}>Cancel</Button>
            <Button variant="contained" disableElevation onClick={handleDeleteConfirm} sx={{ bgcolor: colors.danger, fontWeight: 700, borderRadius: 2, "&:hover": { bgcolor: "#dc2626" } }}>
              Confirm Delete
            </Button>
          </Stack>
        </Box>
      </Dialog>

      <PlanFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        plan={editingPlan}
        onSuccess={() => { setModalOpen(false); mutate("/financial-plans"); }}
        existingPlans={plans || []}
      />
    </Box>
  );
}