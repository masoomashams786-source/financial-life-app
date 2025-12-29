import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Link,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import { Close, OpenInNew } from "@mui/icons-material";
import { getFinancialNews, getFinancialArticles } from "../api/news";

export default function NewsModal({ open, onClose, type }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isNews = type === "news";
  const title = isNews ? "Today's Financial News" : "Financial Articles & Insights";

  useEffect(() => {
    if (open) {
      fetchContent();
    }
  }, [open, type]);

  const fetchContent = async () => {
    setLoading(true);
    setError("");
    try {
      const data = isNews ? await getFinancialNews() : await getFinancialArticles();
      setArticles(data);
    } catch (err) {
      setError("Failed to load content. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, maxHeight: "90vh" }
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Powered by NewsAPI
          </Typography>
        </Box>
        <IconButton onClick={onClose} edge="end">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {loading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && articles.length === 0 && (
          <Typography textAlign="center" py={4} color="text.secondary">
            No articles found
          </Typography>
        )}

        <Box display="flex" flexDirection="column" gap={2}>
          {articles.map((article, index) => (
            <Card 
              key={index} 
              elevation={0}
              sx={{ 
                border: "1px solid #e0e0e0",
                "&:hover": { boxShadow: 2 }
              }}
            >
              <Box display="flex" gap={2}>
                {article.urlToImage && (
                  <CardMedia
                    component="img"
                    sx={{ width: 120, height: 120, objectFit: "cover" }}
                    image={article.urlToImage}
                    alt={article.title}
                  />
                )}
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {article.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {article.description}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip 
                      label={article.source.name} 
                      size="small" 
                      variant="outlined"
                    />
                    <Link 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener"
                      sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 0.5,
                        textDecoration: "none",
                        fontSize: "0.875rem"
                      }}
                    >
                      Read More <OpenInNew fontSize="small" />
                    </Link>
                  </Box>
                </CardContent>
              </Box>
            </Card>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}