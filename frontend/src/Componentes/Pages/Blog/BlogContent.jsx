import { Box, Typography, Divider, useTheme } from "@mui/material";

export default function BlogContent({ post, imageUrl }) {
  const theme = useTheme();

  return (
    <>
      <Box
        component="img"
        src={imageUrl}
        alt={post.title}
        loading="lazy"
        sx={{
          width: "100%",
          borderRadius: 2,
          objectFit: "cover",
          maxHeight: 400,
          mb: 3,
        }}
        onError={(e) => (e.target.src = "/assets/default-blog.jpg")}
      />

      <Divider sx={{ mb: 1 }} />
      <Typography variant="caption" color="text.secondary" sx={{ mb: 3 }}>
        Published on {new Date(post.created_at).toLocaleDateString()}
      </Typography>

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
    </>
  );
}
