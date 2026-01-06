import { useMemo } from "react";
import { Box, Typography, Card, CardContent, CircularProgress } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function NetWorthChart({ projections, loading }) {
  const chartData = useMemo(() => {
    if (!projections) return [];

    const { predicted, best, worst } = projections;

    // Combine all scenarios by year
    const dataMap = new Map();

    predicted?.projections?.forEach((p) => {
      dataMap.set(p.age, {
        age: p.age,
        year: p.year,
        predicted: p.net_worth,
      });
    });

    best?.projections?.forEach((p) => {
      const existing = dataMap.get(p.age) || { age: p.age, year: p.year };
      existing.best = p.net_worth;
      dataMap.set(p.age, existing);
    });

    worst?.projections?.forEach((p) => {
      const existing = dataMap.get(p.age) || { age: p.age, year: p.year };
      existing.worst = p.net_worth;
      dataMap.set(p.age, existing);
    });

    return Array.from(dataMap.values()).sort((a, b) => a.age - b.age);
  }, [projections]);

  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <Box
        sx={{
          bgcolor: "white",
          p: 2,
          border: "1px solid #ccc",
          borderRadius: 1,
          boxShadow: 2,
        }}
      >
        <Typography variant="body2" fontWeight={600} mb={1}>
          Age {payload[0].payload.age} ({payload[0].payload.year})
        </Typography>
        {payload.map((entry, index) => (
          <Typography key={index} variant="caption" display="block" sx={{ color: entry.color }}>
            {entry.name}: ${entry.value.toLocaleString()}
          </Typography>
        ))}
      </Box>
    );
  };

  if (loading) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
            No projection data available. Update your financial snapshot to generate projections.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} mb={3}>
          Net Worth Projection
        </Typography>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="age"
              label={{ value: "Age", position: "insideBottom", offset: -5 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickFormatter={formatCurrency}
              label={{ value: "Net Worth", angle: -90, position: "insideLeft" }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="best"
              stroke="#10B981"
              strokeWidth={2}
              name="Best Case"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#00D4FF"
              strokeWidth={3}
              name="Predicted"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="worst"
              stroke="#EF4444"
              strokeWidth={2}
              name="Worst Case"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Summary Stats Below Chart */}
        <Box display="flex" justifyContent="space-around" mt={3} pt={3} borderTop="1px solid #e0e0e0">
          <Box textAlign="center">
            <Typography variant="caption" color="text.secondary">
              Best Case (Age 65)
            </Typography>
            <Typography variant="h6" fontWeight={700} color="#10B981">
              {formatCurrency(chartData[chartData.length - 1]?.best || 0)}
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="caption" color="text.secondary">
              Predicted (Age 65)
            </Typography>
            <Typography variant="h6" fontWeight={700} color="#00D4FF">
              {formatCurrency(chartData[chartData.length - 1]?.predicted || 0)}
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="caption" color="text.secondary">
              Worst Case (Age 65)
            </Typography>
            <Typography variant="h6" fontWeight={700} color="#EF4444">
              {formatCurrency(chartData[chartData.length - 1]?.worst || 0)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}