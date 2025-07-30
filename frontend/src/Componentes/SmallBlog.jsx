import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
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
  const moreBlogs = blogs.slice(4, 6);

  return (
    <Box sx={{ px: { xs: 1, md: 1 }, py: 6 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" fontWeight={600}>
          Our Blog & Articles
        </Typography>
        <Button
          variant="contained"
          sx={{ bgcolor: "#a1333d", borderRadius: 4 }}
          onClick={handleBlog}
        >
          Read All Articles
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Main Blog */}
        <Grid item xs={12} md={7}>
          {mainBlog && (
            <Card sx={{ borderRadius: 3 }}>
              <Link to={`/blog/${mainBlog.id}`}>
                <CardMedia
                  component="img"
                  height="360"
                  image={mainBlog.image_url}
                  alt={mainBlog.title}
                />
              </Link>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {new Date(mainBlog.created_at).toDateString()}
                </Typography>
                <Typography variant="h6" mt={1}>
                  {mainBlog.title}
                </Typography>
                <Typography variant="body2" mt={1}>
                  {mainBlog.content.slice(0, 120)}...
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Stacked Blogs */}
        <Grid item xs={12} md={5}>
          <Grid container direction="column" spacing={2}>
            {otherBlogs.map((blog) => (
              <Card
                key={blog.id}
                sx={{ borderRadius: 3, overflow: "hidden", mb: 2 }}
              >
                <Link to={`/blog/${blog.id}`}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={blog.image_url}
                    alt={blog.title}
                  />
                </Link>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(blog.created_at).toDateString()}
                  </Typography>
                  <Typography variant="subtitle1">
                    {blog.title.length > 60
                      ? blog.title.slice(0, 60) + "..."
                      : blog.title}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Grid>

        {/* More Blogs */}
        <Grid item xs={12} md={5}>
          <Grid container direction="column" spacing={2}>
            {moreBlogs.map((blog) => (
              <Card
                key={blog.id}
                sx={{ borderRadius: 3, overflow: "hidden", mb: 2 }}
              >
                <Link to={`/blog/${blog.id}`}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={blog.image_url}
                    alt={blog.title}
                  />
                </Link>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(blog.created_at).toDateString()}
                  </Typography>
                  <Typography variant="subtitle1">
                    {blog.title.length > 60
                      ? blog.title.slice(0, 60) + "..."
                      : blog.title}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
