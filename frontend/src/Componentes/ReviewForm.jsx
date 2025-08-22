import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import {
  Box,
  TextField,
  Button,
  Rating,
  Typography,
  Paper,
  Divider,
  Skeleton,
} from "@mui/material";
import toast from "react-hot-toast";
import { useTheme } from "@mui/material/styles";

export default function ReviewForm({
  itemId,
  tableName,
  foreignKey,
  onReviewSubmit,
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true); // For skeleton while checking user
  const theme = useTheme();

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulate fetching user
    const fetchUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(user);
      } catch (err) {
        console.error(err);
      } finally {
        setUserLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      return toast.error("⭐ Please select a rating");
    }
    if (!user) {
      return toast.error("🔐 You must be logged in to leave a review");
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(tableName)
        .insert({
          [foreignKey]: itemId,
          user_id: user.id,
          rating,
          comment,
        })
        .select()
        .single();

      if (error) {
        console.error(error);
        toast.error("❌ Failed to submit review");
      } else {
        toast.success("Review submitted!");
        setRating(0);
        setComment("");
        onReviewSubmit(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  // Show skeleton while user info is loading
  if (userLoading) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          mt: 4,
          backgroundColor:
            theme.palette.mode === "dark" ? "#121212" : "#fefefe",
        }}
      >
        <Skeleton variant="text" width="40%" height={30} />
        <Divider sx={{ my: 2 }} />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={50}
          sx={{ mb: 2 }}
        />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={100}
          sx={{ mb: 2 }}
        />
        <Skeleton variant="rectangular" width="30%" height={50} />
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        mt: 4,
        backgroundColor: theme.palette.mode === "dark" ? "#121212" : "#fefefe",
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
