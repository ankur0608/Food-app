import { useEffect, useState, memo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import styles from "./BlogList.module.css";
import { useTheme } from "../Componentes/Store/theme";

// Memoized BlogCard
const BlogCard = memo(({ blog }) => {
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
        loading="lazy"
        srcSet={
          blog.image_url
            ? `${imageUrl}?w=320 320w,
               ${imageUrl}?w=480 480w,
               ${imageUrl}?w=800 800w`
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
        <p className={styles.date}>
          {new Date(blog.created_at).toDateString()}
        </p>
      </div>
    </Link>
  );
});

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setBlogs(data || []);
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
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default BlogList;
