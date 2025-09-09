import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../../../supabaseClient.js";
import { Container, Paper } from "@mui/material";
import BlogSkeleton from "./BlogSkeleton.jsx";
import BlogHeader from "./BlogHeader.jsx";
import BlogContent from "./BlogContent.jsx";
import ReviewsSection from "../../ReviewsSection.jsx";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <BlogSkeleton />;
  if (!post) return <p>Post not found.</p>;

  const imageUrl = post.image_url
    ? post.image_url.startsWith("http")
      ? post.image_url
      : `https://food-app-d8r3.onrender.com/images/${post.image_url}`
    : "/assets/default-blog.jpg";

  return (
    <Container maxWidth="md" sx={{ py: 4, mt: 9 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
        <BlogHeader post={post} navigate={navigate} />
        <BlogContent post={post} imageUrl={imageUrl} />
      </Paper>

      <ReviewsSection
        itemId={post.id}
        tableName="post_reviews"
        foreignKey="post_id"
      />
    </Container>
  );
}
