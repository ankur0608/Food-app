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
} from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Link, useNavigate } from "react-router-dom";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) {
        setBlogs(data);
      }
    };
    fetchBlogs();
  }, []);

  const handleBlog = () => {
    navigate("/blog");
  };

  const mainBlog = blogs[0];
  const otherBlogs = blogs.slice(1, 3);

  return (
    <Box>
      {/* Header with button in same line */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={6}
        mt={5}
        flexWrap="nowrap" // ✅ force in one line
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
            // color="text.secondary"
            sx={{
              fontSize: {
                xs: "0.7rem",
                sm: "0.7rem",
                md: "1rem",
                color: "grey",
              },
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
            whiteSpace: "nowrap", // ✅ prevent text break
            "&:hover": { bgcolor: "#1565c0" },
          }}
          onClick={handleBlog}
        >
          Read More
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Featured Blog */}
        <Grid item xs={12} md={7}>
          {mainBlog && (
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
                />
                <CardContent>
                  <Chip
                    label={mainBlog.category || "Featured"}
                    sx={{
                      mb: 1,
                      bgcolor: "#f5f5f5",
                      fontWeight: 500,
                    }}
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
          )}
        </Grid>

        {/* Two Blogs */}
        <Grid item xs={12} md={5}>
          <Grid
            container
            spacing={2.3}
            direction={{ xs: "row", md: "column" }} // row on mobile, column on desktop
          >
            {otherBlogs.map((blog) => (
              <Grid item xs={6} md={12} key={blog.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    width: { xs: 320 },
                    height: { xs: 220, sm: 260, md: "100%" }, // smaller height in mobile
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
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
