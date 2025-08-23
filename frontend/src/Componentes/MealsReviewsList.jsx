import {
  Avatar,
  Box,
  Typography,
  Paper,
  IconButton,
  Rating,
  Divider,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { supabase } from "../../supabaseClient";
import { useToast } from "../Componentes/Store/ToastContext";

export default function MealsReviewsList({
  reviews,
  userId,
  tableName,
  onReviewDeleted,
}) {
  const { showToast } = useToast();

  const handleDelete = async (id) => {
    const { error } = await supabase.from(tableName).delete().eq("id", id);
    if (error) showToast("Failed to delete meal review", "error");
    else {
      showToast("Meal review deleted", "success");
      if (onReviewDeleted) onReviewDeleted();
    }
  };

  return (
    <Box>
      {reviews.map((r) => {
        const profile = r.profiles || {
          full_name: r.user_name,
          avatar_url: r.user_avatar_url,
        };
        return (
          <Paper
            key={r.id}
            elevation={2}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 3,
              display: "flex",
              gap: 2,
              background: "#fffbea",
            }}
          >
            <Avatar
              src={profile.avatar_url}
              sx={{ border: "2px solid #ff9800" }}
            >
              {profile?.full_name?.[0]?.toUpperCase() || "?"}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                {profile?.full_name || "Food Lover"}
              </Typography>
              <Rating
                value={r.rating}
                readOnly
                size="medium"
                sx={{ mb: 0.5 }}
              />
              <Typography variant="body1" sx={{ mb: 1 }}>
                {r.comment}
              </Typography>
              <Chip
                size="small"
                label={`Posted on ${new Date(
                  r.created_at
                ).toLocaleDateString()}`}
                sx={{ bgcolor: "#ffe0b2" }}
              />
            </Box>
            {userId && r.user_id === userId && (
              <IconButton color="error" onClick={() => handleDelete(r.id)}>
                <DeleteIcon />
              </IconButton>
            )}
          </Paper>
        );
      })}
      {reviews.length > 0 && <Divider sx={{ mt: 2 }} />}
    </Box>
  );
}
