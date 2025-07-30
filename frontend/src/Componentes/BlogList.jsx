import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import styles from "./BlogList.module.css";
import { useTheme } from "../Componentes/Store/theme";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  const { theme } = useTheme();

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setBlogs(data);
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
          <Link key={blog.id} to={`/blog/${blog.id}`} className={styles.card}>
            {blog.image_url && (
              <img
                src={blog.image_url}
                alt={blog.title}
                className={styles.image}
              />
            )}
            <div className={styles.cardContent}>
              <h3 className={styles.title}>{blog.title}</h3>
              <p className={styles.date}>
                {new Date(blog.created_at).toDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
