import { useEffect, useState, memo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../../../supabaseClient";
import styles from "./BlogList.module.css";
import { useTheme } from "../../Store/theme";
import OverallRating from "../../RatingOverall";
import { Skeleton, Card } from "@mui/material";

// Memoized BlogCard
// BlogCard now accepts idx as prop
const BlogCard = memo(({ blog, idx }) => {
  const imageUrl = blog.image_url
    ? blog.image_url.startsWith("http")
      ? blog.image_url
      : `https://food-app-d8r3.onrender.com/images/${blog.image_url}`
    : "/assets/default-blog.jpg";

  return (
    <Link key={blog.id} to={`/blog/${blog.id}`} className={styles.card}>
      <img
        src={imageUrl}
        alt={blog.title}
        className={styles.image}
        loading={idx === 0 ? "eager" : "lazy"} // first image loads eagerly
        fetchpriority={idx === 0 ? "high" : "auto"} // high priority for first image
        width="400"
        height="250"
        srcSet={
          blog.image_url
            ? `${imageUrl}?w=320&format=webp 320w,
         ${imageUrl}?w=480&format=webp 480w,
         ${imageUrl}?w=800&format=webp 800w`
            : undefined
        }
        sizes="(max-width: 600px) 320px, (max-width: 960px) 480px, 800px"
        onError={(e) => (e.target.src = "/assets/default-blog.jpg")}
      />

      <div className={styles.cardContent}>
        <h3 className={styles.title}>
          {blog.title.length > 60
            ? blog.title.slice(0, 60) + "..."
            : blog.title}
        </h3>
        <OverallRating
          itemId={blog.id}
          tableName="post_reviews"
          foreignKey="post_id"
        />
        <p className={styles.date}>
          {new Date(blog.created_at).toDateString()}
        </p>
      </div>
    </Link>
  );
});

// Skeleton card for loading state
const BlogSkeletonCard = memo(() => (
  <Card
    sx={{
      p: 2,
      borderRadius: 3,
      boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
    }}
  >
    <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
    <Skeleton variant="text" sx={{ mt: 2, width: "70%" }} />
    <Skeleton variant="text" width="50%" />
  </Card>
));

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setBlogs(data || []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div
      className={`${styles.blogList} ${
        theme === "dark" ? styles.dark : styles.light
      }`}
    >
      <h2 className={styles.heading}>Latest Blog Posts</h2>
      <div className={styles.grid}>
        {loading
          ? Array.from({ length: 8 }).map((_, idx) => (
              <BlogSkeletonCard key={idx} />
            ))
          : blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
      </div>
    </div>
  );
};

export default BlogList;
