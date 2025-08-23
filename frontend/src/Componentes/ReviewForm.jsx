import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Rating,
  Paper,
  FormHelperText,
} from "@mui/material";
import { supabase } from "../../supabaseClient";
import { useToast } from "../Componentes/Store/ToastContext";

export default function ReviewForm({
  itemId, // id of the meal or food
  tableName, // "food_reviews" or "meal_reviews"
  foreignKey, // "food_id" or "meal_id"
  onReviewAdded,
}) {
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { showToast } = useToast();

  const validate = () => {
    const newErrors = {};
    if (!rating) newErrors.rating = "Please select a rating.";
    if (!comment.trim()) newErrors.comment = "Please enter your review.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const {
        data: { session },
        error: authError,
      } = await supabase.auth.getSession();
      if (authError || !session?.user) {
        showToast("You must be logged in to leave a review.", "error");
        setLoading(false);
        return;
      }

      const user = session.user;

      const payload = {
        [foreignKey]: itemId,
        rating,
        comment,
        user_id: user.id,
        user_name: user.user_metadata.full_name || "Anonymous",
        user_avatar_url: user.user_metadata.avatar_url || "",
      };

      // Insert review
      const { data, error: insertError } = await supabase
        .from(tableName)
        .insert([payload])
        .select();

      if (insertError) throw insertError;

      showToast("Review submitted successfully!", "success");
      setRating(null);
      setComment("");
      setErrors({});
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      console.error("Insert failed:", err.message);
      showToast("Failed to submit review. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Write a Review
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Rating
          value={rating}
          onChange={(e, newValue) => setRating(newValue)}
          precision={1}
        />
        {errors.rating && (
          <FormHelperText error>{errors.rating}</FormHelperText>
        )}

        <TextField
          fullWidth
          label="Your Review"
          multiline
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ mt: 2 }}
          error={!!errors.comment}
          helperText={errors.comment}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          fullWidth
          sx={{ mt: 2 }}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </Button>
      </Box>
    </Paper>
  );
}
