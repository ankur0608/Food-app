import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CardActionArea,
  Chip,
  Skeleton,
} from "@mui/material";
import { useEffect, useState, memo } from "react";
import { supabase } from "../../supabaseClient";
import { Link, useNavigate } from "react-router-dom";

// Memoized Blog Card for other blogs
const OtherBlogCard = memo(({ blog }) => (
  <Card
    sx={{
      borderRadius: 3,
      overflow: "hidden",
      width: { xs: 320 },
      height: { xs: 220, sm: 260, md: "100%" },
      boxShadow: "0px 6px 16px rgba(0,0,0,0.12)",
      transition: "all 0.3s ease",
      "&:hover": { transform: "translateY(-6px)" },
    }}
  >
    <CardActionArea component={Link} to={`/blog/${blog.id}`}>
      <CardMedia
        component="img"
        height="120"
        image={blog.image_url}
        alt={blog.title}
        loading="lazy"
        sx={{
          objectFit: "cover",
          height: { xs: 100, sm: 120, md: 180 },
        }}
      />
      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Chip
          label={blog.category || "General"}
          size="small"
          sx={{
            mb: 1,
            bgcolor: "#f5f5f5",
            fontWeight: 500,
            fontSize: { xs: "0.65rem", sm: "0.75rem" },
          }}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem" } }}
        >
          {new Date(blog.created_at).toDateString()}
        </Typography>
        <Typography
          variant="subtitle2"
          fontWeight={600}
          mt={0.5}
          sx={{
            fontSize: { xs: "0.8rem", sm: "0.9rem" },
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {blog.title}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
));

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3); // fetch only the needed blogs

      if (!error) {
        setBlogs(data);
      }
      setLoading(false);
    };
    fetchBlogs();
  }, []);

  const handleBlog = () => navigate("/blog");

  const mainBlog = blogs[0];
  const otherBlogs = blogs.slice(1, 3);

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={6}
        mt={5}
        flexWrap="nowrap"
        gap={2}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ fontSize: { xs: "1.3rem", sm: "1.6rem", md: "2rem" } }}
          >
            Our Blog & Articles
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "0.7rem", sm: "0.7rem", md: "1rem" },
              color: "grey",
            }}
          >
            Discover insights, stories, and updates from our community. Freshly
            written for you.
          </Typography>
        </Box>

        <Button
          variant="contained"
          sx={{
            bgcolor: "#1976d2",
            borderRadius: 3,
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 1, sm: 1.2 },
            fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.95rem" },
            textTransform: "none",
            fontWeight: 600,
            whiteSpace: "nowrap",
            "&:hover": { bgcolor: "#1565c0" },
          }}
          onClick={handleBlog}
        >
          Read More
        </Button>
      </Box>

      <Grid container spacing={7}>
        {/* Featured Blog */}
        <Grid item xs={12} md={7}>
          {loading ? (
            <Skeleton
              variant="rectangular"
              height={400}
              sx={{ borderRadius: 3 }}
            />
          ) : mainBlog ? (
            <Card
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                height: "100%",
                boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
              }}
            >
              <CardActionArea component={Link} to={`/blog/${mainBlog.id}`}>
                <CardMedia
                  component="img"
                  sx={{
                    objectFit: "cover",
                    height: { xs: 200, sm: 300, md: 400 },
                  }}
                  image={mainBlog.image_url}
                  alt={mainBlog.title}
                  loading="lazy"
                />
                <CardContent>
                  <Chip
                    label={mainBlog.category || "Featured"}
                    sx={{ mb: 1, bgcolor: "#f5f5f5", fontWeight: 500 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(mainBlog.created_at).toDateString()}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} mt={1}>
                    {mainBlog.title}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    {mainBlog.content.slice(0, 120)}...
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ) : (
            <Typography>No blogs available.</Typography>
          )}
        </Grid>

        {/* Other Blogs */}
        <Grid item xs={12} md={5}>
          <Grid container spacing={2.3} direction={{ xs: "row", md: "column" }}>
            {loading
              ? Array.from({ length: 2 }).map((_, idx) => (
                  <Skeleton
                    key={idx}
                    variant="rectangular"
                    height={120}
                    sx={{ borderRadius: 3 }}
                  />
                ))
              : otherBlogs.map((blog) => (
                  <OtherBlogCard key={blog.id} blog={blog} />
                ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
