import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./Blog.css"; 

export default function BlogList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <div className="blog-list">
      <h1>Latest Blogs</h1>
      {posts.map((post) => (
        <Link key={post.id} to={`/blog/${post.id}`} className="blog-card">
          {post.image_url && <img src={post.image_url} alt={post.title} />}
          <h2>{post.title}</h2>
          <p>{post.content.slice(0, 100)}...</p>
        </Link>
      ))}
    </div>
  );
}
