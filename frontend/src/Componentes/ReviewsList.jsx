import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import {
  Box,
  Typography,
  Rating,
  Paper,
  Avatar,
  Stack,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";
import { useTheme } from "@mui/material/styles";

export default function ReviewList({ reviews, setReviews, foodId }) {
  const theme = useTheme();
  const [userId, setUserId] = useState(null);
  const [userMeta, setUserMeta] = useState({});

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setUserMeta({
          full_name: user.user_metadata?.full_name || "You",
          avatar_url: user.user_metadata?.avatar_url || "",
        });
      }
    };
    getUser();
  }, []);

  const handleDelete = async (id) => {
    const { error } = await supabase.from("food_reviews").delete().eq("id", id);
    if (!error) {
      toast.success("Review deleted");
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } else {
      toast.error("Failed to delete review");
    }
  };

  return (
    <Box mt={5}>
      <Typography variant="h5" gutterBottom>
        Customer Reviews
      </Typography>

      {reviews.length === 0 ? (
        <Typography mt={2}>
          No reviews yet. Be the first to review this dish!
        </Typography>
      ) : (
        reviews.map((rev) => {
          const isCurrentUser = rev.user_id === userId;
          const reviewerName = isCurrentUser ? userMeta.full_name : "Anonymous";
          const reviewerAvatar = isCurrentUser ? userMeta.avatar_url : "";

          return (
            <Paper
              key={rev.id}
              elevation={3}
              sx={{
                my: 2,
                p: 2,
                borderRadius: 3,
                backgroundColor:
                  theme.palette.mode === "dark" ? "#121212" : "#fefefe", // Dark or light mode background
                transition: "background 0.3s",
              }}
            >
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Stack direction="row" spacing={2}>
                  <Avatar src={reviewerAvatar} alt={reviewerName} />
                  <Box>
                    <Typography fontWeight="bold">{reviewerName}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(rev.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>

                {isCurrentUser && (
                  <Tooltip title="Delete your review">
                    <IconButton
                      onClick={() => handleDelete(rev.id)}
                      color="error"
                      sx={{ alignSelf: "center" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>

              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="text.secondary" mb={0.5}>
                Rating
              </Typography>
              <Rating
                value={rev.rating}
                readOnly
                precision={0.5}
                sx={{ mt: 0.5 }}
              />

              <Typography mt={1} sx={{ wordBreak: "break-word" }}>
                <Typography variant="body2" color="text.secondary" mb={0.5}>
                  Comment
                </Typography>
                {rev.comment}
              </Typography>
            </Paper>
          );
        })
      )}
    </Box>
  );
}
