import {
  Box,
  Paper,
  Avatar,
  Typography,
  Rating,
  IconButton,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { supabase } from "../../supabaseClient";
import { useToast } from "../Componentes/Store/ToastContext";

export default function PostReviewsList({
  reviews,
  userId,
  tableName,
  onReviewDeleted,
}) {
  const { showToast } = useToast();

  const handleDelete = async (id) => {
    const { error } = await supabase.from(tableName).delete().eq("id", id);
    if (error) showToast("Failed to delete review", "error");
    else {
      showToast("Review deleted", "success");
      if (onReviewDeleted) onReviewDeleted();
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {reviews.map((r) => (
        <Paper
          key={r.id}
          elevation={1}
          sx={{ p: 2, mb: 2, display: "flex", gap: 2, borderRadius: 2 }}
        >
          <Avatar src={r.profiles.avatar_url}>
            {r.profiles.full_name?.[0]?.toUpperCase() || "?"}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              {r.profiles.full_name || "Anonymous"}
            </Typography>
            <Rating value={r.rating} readOnly size="small" />
            <Typography variant="body2" sx={{ my: 1 }}>
              {r.comment}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(r.created_at).toLocaleString()}
            </Typography>
          </Box>
          {r.user_id === userId && (
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(r.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Paper>
      ))}
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
}
