import { Alert } from "@mui/material";

export default function ErrorAlert({ message }) {
    return (
        <Alert severity="info" variant="outlined" sx={{
            color: "#bae6fd",
            borderColor: "#0369a1",
            "& .MuiAlert-icon": { color: "#38bdf8" },
        }}>{message}</Alert>
    );
}
