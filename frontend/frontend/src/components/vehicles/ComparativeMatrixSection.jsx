import { useState } from "react";
import { VEHICLE_MATRIX } from "./comparative-matrix/data/vehicleMatrix";

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tooltip,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  RemoveCircle,
  InfoOutlined,
  Search,
  FilterList,
} from "@mui/icons-material";

// Professional Financial Analysis Data


export default function ComparativeMatrixSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("all");

  const colors = {
    high: "#10B981",
    medium: "#F59E0B",
    low: "#EF4444",
  };

  const getRatingIcon = (rating) => {
    switch (rating) {
      case "high":
        return <CheckCircle sx={{ color: colors.high, fontSize: 20 }} />;
      case "medium":
        return <RemoveCircle sx={{ color: colors.medium, fontSize: 20 }} />;
      case "low":
        return <Cancel sx={{ color: colors.low, fontSize: 20 }} />;
      default:
        return null;
    }
  };

  const uniqueClasses = ["all", ...new Set(VEHICLE_MATRIX.map((v) => v.class))];

  const filteredVehicles = VEHICLE_MATRIX.filter((vehicle) => {
    const matchesSearch = vehicle.vehicle
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === "all" || vehicle.class === filterClass;
    return matchesSearch && matchesClass;
  });

  return (
    <Box sx={{ bgcolor: "#e4eaf0ff", p: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Professional Comparative Matrix
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Institutional-grade analysis of all financial vehicles across critical
          evaluation factors
        </Typography>

        {/* Filters */}
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField
            size="small"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />

          <ToggleButtonGroup
            value={filterClass}
            exclusive
            onChange={(e, newValue) => newValue && setFilterClass(newValue)}
            size="small"
            sx={{
              width: { xs: "100%", sm: "auto" },
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            {uniqueClasses.map((cls) => (
              <ToggleButton
                key={cls}
                value={cls}
                sx={{ textTransform: "none" }}
              >
                {cls === "all" ? "All Classes" : cls}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Professional Analysis Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table sx={{ minWidth: 1200 }} stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 700,
                  bgcolor: "#0A2540",
                  color: "white",
                  minWidth: 180,
                }}
              >
                Vehicle
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  bgcolor: "#0A2540",
                  color: "white",
                  minWidth: 150,
                }}
              >
                Class
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  bgcolor: "#0A2540",
                  color: "white",
                  minWidth: 150,
                }}
              >
                Liquidity & Control
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  bgcolor: "#0A2540",
                  color: "white",
                  minWidth: 150,
                }}
              >
                Market Safety
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  bgcolor: "#0A2540",
                  color: "white",
                  minWidth: 140,
                }}
              >
                Tax-Free Access
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  bgcolor: "#0A2540",
                  color: "white",
                  minWidth: 160,
                }}
              >
                Leverage & Collateral
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  bgcolor: "#0A2540",
                  color: "white",
                  minWidth: 150,
                }}
              >
                Asset Protection
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  bgcolor: "#0A2540",
                  color: "white",
                  minWidth: 160,
                }}
              >
                Contribution Limits
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  bgcolor: "#0A2540",
                  color: "white",
                  minWidth: 120,
                }}
              >
                Avg Return
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVehicles.map((vehicle, index) => (
              <TableRow
                key={index}
                hover
                sx={{
                  "&:nth-of-type(odd)": { bgcolor: "#F7F9FC" },
                  "&:hover": { bgcolor: "#E3F2FD" },
                }}
              >
                {/* Vehicle Name */}
                <TableCell>
                  <Box>
                    <Typography variant="body1" fontWeight={700}>
                      {vehicle.vehicle}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {vehicle.bestFor}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Class */}
                <TableCell>
                  <Chip
                    label={vehicle.class}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>

                {/* Liquidity */}
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getRatingIcon(vehicle.liquidity.rating)}
                    <Typography variant="body2" fontWeight={600}>
                      {vehicle.liquidity.value}
                    </Typography>
                    <Tooltip
                      title={vehicle.liquidity.details}
                      arrow
                      placement="top"
                    >
                      <IconButton size="small">
                        <InfoOutlined sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>

                {/* Market Safety */}
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getRatingIcon(vehicle.marketSafety.rating)}
                    <Typography variant="body2" fontWeight={600}>
                      {vehicle.marketSafety.value}
                    </Typography>
                    <Tooltip
                      title={vehicle.marketSafety.details}
                      arrow
                      placement="top"
                    >
                      <IconButton size="small">
                        <InfoOutlined sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>

                {/* Tax-Free */}
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getRatingIcon(vehicle.taxFree.rating)}
                    <Typography variant="body2" fontWeight={600}>
                      {vehicle.taxFree.value}
                    </Typography>
                    <Tooltip
                      title={vehicle.taxFree.details}
                      arrow
                      placement="top"
                    >
                      <IconButton size="small">
                        <InfoOutlined sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>

                {/* Leverage */}
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getRatingIcon(vehicle.leverage.rating)}
                    <Typography variant="body2" fontWeight={600}>
                      {vehicle.leverage.value}
                    </Typography>
                    <Tooltip
                      title={vehicle.leverage.details}
                      arrow
                      placement="top"
                    >
                      <IconButton size="small">
                        <InfoOutlined sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>

                {/* Asset Protection */}
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getRatingIcon(vehicle.assetProtection.rating)}
                    <Typography variant="body2" fontWeight={600}>
                      {vehicle.assetProtection.value}
                    </Typography>
                    <Tooltip
                      title={vehicle.assetProtection.details}
                      arrow
                      placement="top"
                    >
                      <IconButton size="small">
                        <InfoOutlined sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>

                {/* Contribution Limits */}
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getRatingIcon(vehicle.contributionLimits.rating)}
                    <Typography variant="body2" fontWeight={600}>
                      {vehicle.contributionLimits.value}
                    </Typography>
                    <Tooltip
                      title={vehicle.contributionLimits.details}
                      arrow
                      placement="top"
                    >
                      <IconButton size="small">
                        <InfoOutlined sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>

                {/* Average Return */}
                <TableCell>
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      color="primary"
                    >
                      {vehicle.avgReturn}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {vehicle.fees}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Legend */}
      <Box mt={3} p={2} sx={{ bgcolor: "#F7F9FC", borderRadius: 2 }}>
        <Typography variant="subtitle2" fontWeight={700} mb={1}>
          Rating Legend:
        </Typography>
        <Box display="flex" gap={3}>
          <Box display="flex" alignItems="center" gap={1}>
            <CheckCircle sx={{ color: colors.high, fontSize: 20 }} />
            <Typography variant="body2">High/Excellent</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <RemoveCircle sx={{ color: colors.medium, fontSize: 20 }} />
            <Typography variant="body2">Moderate/Partial</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Cancel sx={{ color: colors.low, fontSize: 20 }} />
            <Typography variant="body2">Low/Limited/None</Typography>
          </Box>
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mt={1}
        >
          Hover over the info icons for detailed analysis of each factor.
        </Typography>
      </Box>
    </Box>
  );
}
