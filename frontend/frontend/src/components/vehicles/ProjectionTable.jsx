import { Save, ShowChart, TrendingDown, TrendingUp } from "@mui/icons-material";
import {
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import React from "react";
import { formatCurrency } from "./utils";

const colors = {
  primary: "#0A2540",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  accent: "#00D4FF",
};

const columns = [
  "Plan Type",
  "Scenario",
  "Total Contributed",
  "Cash Value",
  "Annual Income",
  "Actions",
];
export const ProjectionTable = ({ projections, onSavePlan }) => {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col} sx={{ fontWeight: 700, bgcolor: "#F7F9FC" }}>
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {projections.map((result, idx) => (
            <RenderPojectPlan
              key={idx}
              result={result}
              onSavePlan={onSavePlan}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const RenderPojectPlan = ({ result, onSavePlan }) => {
  const planCases = [
    {
      label: "Best",
      caseType: "best_case",
      case: result["best_case"],
      color: colors.success,
    },
    {
      label: "Average",
      caseType: "average_case",
      case: result["average_case"],
      color: colors.accent,
    },
    {
      label: "Worst",
      caseType: "worst_case",
      case: result["worst_case"],
      color: colors.danger,
    },
  ];
  console.log("Rendering plan: ", result);
  return planCases.map((caseConfig, index) => (
    <TableRow key={caseConfig.label}>
      {index === 0 && (
        <TableCell rowSpan={3} sx={{ fontWeight: 700 }}>
          {result.plan_type}
        </TableCell>
      )}
      <TableCell>
        <Chip
          label={caseConfig.label}
          size="small"
          icon={<TrendingUp />}
          sx={{
            // bgcolor: planConfig.color20,
            color: caseConfig.success,
          }}
        />
      </TableCell>
      <TableCell>{formatCurrency(caseConfig.case.total_contributed)}</TableCell>
      <TableCell
        sx={{
          fontWeight: 700,
          color: caseConfig.color,
        }}
      >
        {formatCurrency(caseConfig.case.cash_value)}
      </TableCell>
      <TableCell
        sx={{
          fontWeight: 700,
          color: caseConfig.color,
        }}
      >
        {formatCurrency(caseConfig.case.annual_income_after_tax)}
      </TableCell>
      <TableCell>
        <Tooltip title="Save this scenario to My Plans">
          <IconButton
            size="small"
            onClick={() => onSavePlan(result, caseConfig.caseType)}
            sx={{ color: caseConfig.color }}
          >
            <Save fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  ));
};
