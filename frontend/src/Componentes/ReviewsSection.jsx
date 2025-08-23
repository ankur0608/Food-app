import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../supabaseClient";
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
  Paper,
} from "@mui/material";
import ReviewForm from "./ReviewForm";
import PostReviewsList from "./PostReviewsList";
import MealsReviewsList from "./MealsReviewsList";

export default function ReviewsSection({ itemId, tableName, foreignKey }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Get current user from Supabase or localStorage
  const getUser = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        return {
          full_name: data.session.user.user_metadata.full_name || "Anonymous",
          avatar_url: data.session.user.user_metadata.avatar_url || "",
          email: data.session.user.email,
          id: data.session.user.id,
        };
      }
    } catch (err) {
      console.error("Supabase session error:", err.message);
    }
    return (
      JSON.parse(localStorage.getItem("user")) || {
        full_name: "Anonymous",
        avatar_url: "",
        id: null,
      }
    );
  };

  // Fetch reviews
  const fetchReviews = useCallback(
    async (currentUser) => {
      if (!itemId || !tableName || !foreignKey) return;
      setLoading(true);

      const { data, error } = await supabase
        .from(tableName)
        .select(
          "id, comment, rating, created_at, user_id, user_name, user_avatar_url"
        )
        .eq(foreignKey, itemId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error.message);
        setReviews([]);
      } else {
        const normalized = (data || []).map((r) => ({
          ...r,
          profiles: {
            full_name: r.user_name || currentUser.full_name,
            avatar_url: r.user_avatar_url || currentUser.avatar_url,
          },
        }));
        setReviews(normalized);
      }

      setLoading(false);
    },
    [itemId, tableName, foreignKey]
  );

  useEffect(() => {
    const init = async () => {
      const currentUser = await getUser();
      setUser(currentUser);
      fetchReviews(currentUser);
    };
    init();
  }, [fetchReviews]);

  const ReviewComponent =
    tableName === "meal_reviews" ? MealsReviewsList : PostReviewsList;

  return (
    <Paper elevation={2} sx={{ mt: 5, p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Customer Reviews
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ mt: 4 }}>
        <ReviewForm
          itemId={itemId}
          tableName={tableName}
          foreignKey={foreignKey}
          onReviewAdded={() => fetchReviews(user)}
          user={user}
        />
      </Box>
      <Divider sx={{ mb: 3 }} />
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress size={28} />
        </Box>
      ) : reviews.length === 0 ? (
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          No reviews yet. Be the first to write one!
        </Typography>
      ) : (
        <ReviewComponent
          reviews={reviews}
          userId={user?.id}
          tableName={tableName}
          onReviewDeleted={() => fetchReviews(user)}
        />
      )}
    </Paper>
  );
}
