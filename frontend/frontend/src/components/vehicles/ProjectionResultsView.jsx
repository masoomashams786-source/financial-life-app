import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { ShowChart, CompareArrows, InfoOutlined } from "@mui/icons-material";
import { ProjectionTable } from "./ProjectionTable";
import PlanDetailedView from "./PlanDetailedView";
import { formatPercent } from "./utils";

export default function ProjectionResultsView({
  projections,
  handleSavePlan,
  formValues,
}) {
  const [viewMode, setViewMode] = useState("table");
  return (
    <Card sx={{ boxShadow: 3, minHeight: 600 }}>
      <CardContent>
        {!projections ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight={500}
          >
            <ShowChart sx={{ fontSize: 80, color: "#E0E0E0", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Select plans and click Calculate
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your projections will appear here
            </Typography>
          </Box>
        ) : (
          <Box>
            {/* View Toggle */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="h6" fontWeight={700}>
                Projection Results
              </Typography>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, newValue) => newValue && setViewMode(newValue)}
                size="small"
              >
                <ToggleButton value="table">
                  <CompareArrows sx={{ mr: 1 }} /> Comparison
                </ToggleButton>
                <ToggleButton value="detailed">
                  <ShowChart sx={{ mr: 1 }} /> Detailed
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Table View */}
            {viewMode === "table" ? (
              <ProjectionTable
                projections={projections}
                onSavePlan={handleSavePlan}
              />
            ) : (
              <PlanDetailedView
                plan={projections}
                onSavePlan={handleSavePlan}
              />
            )}

            {/* Methodology Note */}
            <Alert severity="info" icon={<InfoOutlined />} sx={{ mt: 3 }}>
              <Typography variant="body2" fontWeight={600} mb={0.5}>
                How These Numbers Are Calculated:
              </Typography>
              <Typography variant="caption" display="block">
                • <strong>Best Case:</strong> Above-average returns, low
                volatility, favorable tax treatment
              </Typography>
              <Typography variant="caption" display="block">
                • <strong>Average Case:</strong> Historical market averages,
                typical policy costs
              </Typography>
              <Typography variant="caption" display="block">
                • <strong>Worst Case:</strong> Below-average returns, high
                volatility, conservative assumptions
              </Typography>
              <Typography variant="caption" display="block" mt={1}>
                All scenarios account for: {formatPercent(formValues.tax_rate)}{" "}
                tax rate, {formatPercent(formValues.inflation_rate)} inflation,
                plan-specific fees, and contribution limits.
              </Typography>
            </Alert>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
