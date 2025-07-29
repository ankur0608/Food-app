import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) setPost(data);
    };

    fetchPost();
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return (
    <div className="blog-detail">
      <h1>{post.title}</h1>
      {post.image_url && <img src={post.image_url} alt={post.title} />}
      <p>{post.content}</p>
    </div>
  );
}
