import {
    Box,
    CircularProgress
} from "@mui/material";

const loadingContainerStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    p: 4,
    bgcolor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 2,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    minHeight: 250,
    height: "100%",
}

export default function LoadingSpinner() {
    return (
        <Box sx={loadingContainerStyles}>
            <CircularProgress size={32} sx={{ color: "primary.main" }} />
        </Box>
    );
}