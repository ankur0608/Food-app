import { Box, Typography, Chip, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function BlogHeader({ post, navigate }) {
  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Button
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIcon />}
          sx={{
            color: "text.secondary",
            textTransform: "none",
            fontSize: "0.95rem",
            fontWeight: 500,
            pl: 0,
            "&:hover": {
              backgroundColor: "transparent",
              color: "text.primary",
            },
          }}
        >
          Back to Blogs
        </Button>
      </Box>

      <Typography
        variant="h3"
        gutterBottom
        sx={{ fontWeight: 700, letterSpacing: "-0.5px" }}
      >
        {post.title}
      </Typography>

      {post.tags && (
        <Box sx={{ mt: 1, mb: 3, display: "flex", gap: 1, flexWrap: "wrap" }}>
          {post.tags.split(",").map((tag, i) => (
            <Chip key={i} label={tag.trim()} color="primary" size="small" />
          ))}
        </Box>
      )}
    </>
  );
}
