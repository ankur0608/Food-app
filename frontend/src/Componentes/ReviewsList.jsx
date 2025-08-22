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
  Skeleton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";
import { useTheme } from "@mui/material/styles";

export default function ReviewList({
  reviews,
  setReviews,
  itemId,
  tableName,
  foreignKey,
}) {
  const theme = useTheme();
  const [userId, setUserId] = useState(null);
  const [userMeta, setUserMeta] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const handleDelete = async (id) => {
    const { error } = await supabase.from(tableName).delete().eq("id", id);
    if (!error) {
      toast.success("Review deleted");
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } else {
      toast.error("Failed to delete review");
    }
  };

  // Skeleton loader while fetching reviews or user info
  if (loading) {
    return (
      <Box mt={5}>
        <Typography variant="h5" gutterBottom>
          Customer Reviews
        </Typography>
        {[1, 2, 3].map((i) => (
          <Paper
            key={i}
            elevation={3}
            sx={{
              my: 2,
              p: 2,
              borderRadius: 3,
              backgroundColor:
                theme.palette.mode === "dark" ? "#121212" : "#fefefe",
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton width="30%" height={20} />
                <Skeleton width="50%" height={15} />
              </Box>
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Skeleton width="20%" height={20} />
            <Skeleton width="50%" height={30} sx={{ mt: 0.5 }} />
            <Skeleton width="100%" height={50} sx={{ mt: 1 }} />
          </Paper>
        ))}
      </Box>
    );
  }

  return (
    <Box mt={5}>
      <Typography variant="h5" gutterBottom>
        Customer Reviews
      </Typography>
      {reviews.length === 0 ? (
        <Typography mt={2}>No reviews yet. Be the first to review!</Typography>
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
                  theme.palette.mode === "dark" ? "#121212" : "#fefefe",
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
