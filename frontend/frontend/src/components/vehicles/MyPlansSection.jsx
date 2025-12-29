
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
} from "@mui/material";
import { Add, Edit, Delete, InfoOutlined } from "@mui/icons-material";
import { financialPlansFetcher, deleteFinancialPlan } from "../../api/financialPlans";
import PlanFormModal from "./PlanFormModal";

export default function MyPlansSection() {
  const { data: plans, error, isLoading } = useSWR("/financial-plans", financialPlansFetcher);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

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
      // Revalidate SWR cache
      mutate("/financial-plans");
      mutate("/financial-plans/summary");
    } catch (err) {
      alert("Failed to delete plan");
    }
  };

  const handleModalSuccess = () => {
    setModalOpen(false);
    setEditingPlan(null);
    // Revalidate SWR cache
    mutate("/financial-plans");
    mutate("/financial-plans/summary");
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Failed to load plans</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            My Current Plans
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Plans saved from Calculator projections or manually added
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddPlan}
          sx={{
            bgcolor: "#0A2540",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { bgcolor: "#0d2f4f" },
          }}
        >
          Add New Plan
        </Button>
      </Box>

      <Alert severity="info" icon={<InfoOutlined />} sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Tip:</strong> Use the Calculator tab to run projections, then save your chosen scenario here for tracking.
        </Typography>
      </Alert>

      {/* Plans Table */}
      {plans && plans.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F7F9FC" }}>
                <TableCell sx={{ fontWeight: 700 }}>Plan Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Current Value</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Cash Value</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Monthly Contribution</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Years Contributing</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Income Age Range</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Notes</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {plan.plan_type}
                      </Typography>
                      {plan.notes && plan.notes.includes("projection") && (
                        <Chip label="From Calculator" size="small" color="primary" sx={{ mt: 0.5 }} />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{formatCurrency(plan.current_value)}</TableCell>
                  <TableCell>{formatCurrency(plan.cash_value)}</TableCell>
                  <TableCell>{formatCurrency(plan.monthly_contribution)}</TableCell>
                  <TableCell>{plan.years_to_contribute} years</TableCell>
                  <TableCell>
                    {plan.income_start_age && plan.income_end_age
                      ? `${plan.income_start_age} - ${plan.income_end_age}`
                      : "Not set"}
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {plan.notes || "—"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleEditPlan(plan)}
                      sx={{ color: "#00D4FF" }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(plan)}
                      sx={{ color: "#EF4444" }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" mb={2}>
            No plans yet
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Use the Calculator to run projections, then save your chosen plan here.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddPlan}
            sx={{
              bgcolor: "#0A2540",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Add Your First Plan
          </Button>
        </Box>
      )}

      {/* Add/Edit Modal */}
      <PlanFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        plan={editingPlan}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Confirmation */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Confirm Delete
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Are you sure you want to delete "{planToDelete?.plan_type}"?
          </Typography>
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}