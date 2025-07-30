import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import {
  Box,
  Container,
  Typography,
  Paper,
  Skeleton,
  Chip,
  useTheme,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) setPost(data);
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Skeleton variant="text" width="60%" height={50} />
        <Skeleton variant="rectangular" height={300} sx={{ my: 2 }} />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="80%" />
      </Container>
    );
  }

  if (!post) return <Typography variant="h6">Post not found.</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{ p: { xs: 2, sm: 4 }, bgcolor: theme.palette.background.paper }}
      >
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

        {/* Title */}
        <Typography
          variant="h3"
          gutterBottom
          sx={{ fontWeight: 700, letterSpacing: "-0.5px" }}
        >
          {post.title}
        </Typography>

        {/* Date */}
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
          Published on {new Date(post.created_at).toLocaleDateString()}
        </Typography>

        {/* Tags */}
        {post.tags && (
          <Box sx={{ mt: 1, mb: 3, display: "flex", gap: 1, flexWrap: "wrap" }}>
            {post.tags.split(",").map((tag, i) => (
              <Chip key={i} label={tag.trim()} color="primary" size="small" />
            ))}
          </Box>
        )}

        {/* Image */}
        {post.image_url && (
          <Box
            component="img"
            src={post.image_url}
            alt={post.title}
            sx={{
              width: "100%",
              borderRadius: 2,
              objectFit: "cover",
              maxHeight: 400,
              mb: 3,
            }}
          />
        )}

        <Divider sx={{ mb: 3 }} />

        {/* Content */}
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.primary,
            lineHeight: 1.8,
            fontSize: "1.05rem",
            whiteSpace: "pre-line",
          }}
        >
          {post.content}
        </Typography>
      </Paper>
    </Container>
  );
}
