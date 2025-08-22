// src/Componentes/ReviewsSection.jsx
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Box, Skeleton, Paper, Typography } from "@mui/material";
import ReviewForm from "./ReviewForm.jsx";
import ReviewList from "./ReviewsList.jsx";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

/**
 * Generic reviews component.
 * @param {string} itemId - ID of the item being reviewed
 * @param {string} tableName - Supabase table name for reviews
 * @param {string} foreignKey - Column that points to the item (e.g., food_id or post_id)
 */
export default function ReviewsSection({ itemId, tableName, foreignKey }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select("*")
          .eq(foreignKey, itemId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setReviews(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [itemId, tableName, foreignKey]);

  const handleReviewSubmit = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  if (loading) {
    return (
      <Box sx={{ mt: 2 }}>
        <Skeleton variant="rectangular" width="100%" height={100} />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <ReviewForm
        itemId={itemId}
        tableName={tableName}
        foreignKey={foreignKey}
        onReviewSubmit={handleReviewSubmit}
      />
      <ReviewList
        reviews={reviews}
        setReviews={setReviews}
        itemId={itemId}
        tableName={tableName}
        foreignKey={foreignKey}
      />
    </Box>
  );
}
