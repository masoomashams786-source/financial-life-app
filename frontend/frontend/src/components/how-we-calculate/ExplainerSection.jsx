import { Box, Typography, Paper } from "@mui/material";

export default function ExplainerSection({ title, content }) {
  return (
    <Box>
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ mb: 2, color: "#0A2540" }}
      >
        {title}
      </Typography>
      {content}
    </Box>
  );
}