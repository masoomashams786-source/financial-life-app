import {
  Box,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  ExpandMore,
  CheckCircle,
  Warning,
  TrendingUp,
  CalendarToday,
  Lightbulb,
} from "@mui/icons-material";

export default function InsightsPanel({ analysis, loading, error }) {
  // Loading state
  if (loading) {
    return (
      <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 250,
            height: "100%",
          }}
        >
          <CircularProgress size={32} sx={{ color: "#00D4FF" }} />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5 }}>
            Analyzing your finances...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error || !analysis) {
    return (
      <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 250,
            height: "100%",
          }}
        >
          <Alert
            severity="info"
            variant="outlined"
            sx={{
              width: "100%",
              borderColor: "#0369a1",
              "& .MuiAlert-icon": { color: "#38bdf8" },
            }}
          >
            <Typography variant="body2" fontWeight={600} gutterBottom>
              No Insights Available
            </Typography>
            <Typography variant="caption">
              Update your financial snapshot to see personalized insights and recommendations
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const { strengths, vulnerabilities, immediate_actions, alerts } = analysis;

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} mb={3}>
          Financial Insights
        </Typography>

        {/* Critical Alerts */}
        {alerts && alerts.length > 0 && (
          <Box mb={3}>
            {alerts.map((alert, idx) => (
              <Alert
                key={idx}
                severity={alert.type === "critical" ? "error" : "warning"}
                sx={{ mb: 1 }}
              >
                <Typography variant="body2" fontWeight={600}>
                  {alert.title}
                </Typography>
                <Typography variant="caption" display="block">
                  {alert.message}
                </Typography>
              </Alert>
            ))}
          </Box>
        )}

        {/* Strengths */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center" gap={1}>
              <CheckCircle sx={{ color: "#10B981" }} />
              <Typography fontWeight={600}>
                Strengths ({strengths?.length || 0})
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {strengths && strengths.length > 0 ? (
              <Box display="flex" flexDirection="column" gap={2}>
                {strengths.map((strength, idx) => (
                  <Box key={idx}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="#10B981"
                      mb={0.5}
                    >
                      ✓ {strength.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {strength.description}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="caption" color="text.secondary">
                No strengths identified yet
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Vulnerabilities */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center" gap={1}>
              <Warning sx={{ color: "#F59E0B" }} />
              <Typography fontWeight={600}>
                Vulnerabilities ({vulnerabilities?.length || 0})
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {vulnerabilities && vulnerabilities.length > 0 ? (
              <Box display="flex" flexDirection="column" gap={2}>
                {vulnerabilities.map((vuln, idx) => (
                  <Box key={idx}>
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <Typography variant="body2" fontWeight={600} color="#F59E0B">
                        ⚠ {vuln.title}
                      </Typography>
                      <Chip
                        label={vuln.severity}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: "0.7rem",
                          bgcolor:
                            vuln.severity === "high"
                              ? "#fee2e2"
                              : vuln.severity === "medium"
                              ? "#fef3c7"
                              : "#f3f4f6",
                          color:
                            vuln.severity === "high"
                              ? "#991b1b"
                              : vuln.severity === "medium"
                              ? "#92400e"
                              : "#6b7280",
                        }}
                      />
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {vuln.description}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="caption" color="text.secondary">
                No vulnerabilities identified
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Immediate Actions */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center" gap={1}>
              <Lightbulb sx={{ color: "#00D4FF" }} />
              <Typography fontWeight={600}>
                Immediate Actions ({immediate_actions?.length || 0})
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {immediate_actions && immediate_actions.length > 0 ? (
              <Box display="flex" flexDirection="column" gap={3}>
                {immediate_actions.map((action, idx) => (
                  <Box key={idx}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Chip
                        label={`Priority ${action.priority}`}
                        size="small"
                        sx={{
                          bgcolor: "#00D4FF20",
                          color: "#00D4FF",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                        }}
                      />
                      <Typography variant="body2" fontWeight={700}>
                        {action.title}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      mb={1}
                    >
                      {action.description}
                    </Typography>
                    <Box sx={{ pl: 2, borderLeft: "3px solid #00D4FF" }}>
                      {action.action_steps?.map((step, stepIdx) => (
                        <Typography
                          key={stepIdx}
                          variant="caption"
                          display="block"
                          sx={{ mb: 0.5 }}
                        >
                          • {step}
                        </Typography>
                      ))}
                    </Box>
                    <Box display="flex" gap={2} mt={1}>
                      <Typography variant="caption" color="text.secondary">
                        <CalendarToday sx={{ fontSize: 12, mr: 0.5 }} />
                        {action.timeline}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        <TrendingUp sx={{ fontSize: 12, mr: 0.5 }} />
                        {action.impact}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="caption" color="text.secondary">
                No immediate actions needed
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
}