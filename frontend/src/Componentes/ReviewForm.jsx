import { useState } from "react";
import { supabase } from "../../supabaseClient";
import {
  Box,
  TextField,
  Button,
  Rating,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import toast from "react-hot-toast";
import { useTheme } from "@mui/material/styles";

export default function ReviewForm({ foodId, onReviewSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const theme = useTheme(); // Get current theme

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error("⭐ Please select a rating");

    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("🔐 You must be logged in to leave a review");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("food_reviews")
      .insert({
        food_id: foodId,
        user_id: user.id,
        rating,
        comment,
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      toast.error("❌ Failed to submit review");
    } else {
      toast.success("Review submitted!");
      setRating(0);
      setComment("");
      onReviewSubmit(data);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        mt: 4,
        backgroundColor: theme.palette.mode === "dark" ? "#121212" : "#fefefe", 
        transition: "background 0.3s",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Leave a Review
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box component="form" onSubmit={handleSubmit}>
        <Rating
          value={rating}
          onChange={(e, newValue) => setRating(newValue)}
          precision={0.5}
          size="large"
        />
        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Write your comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ my: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ borderRadius: 2 }}
          size="large"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </Button>
      </Box>
    </Paper>
  );
}
