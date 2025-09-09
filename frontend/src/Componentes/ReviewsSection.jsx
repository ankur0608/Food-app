import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../supabaseClient";
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RateReviewIcon from "@mui/icons-material/RateReview"; // icon for the button
import ReviewForm from "./ReviewForm";
import PostReviewsList from "./PostReviewsList";
import MealsReviewsList from "./MealsReviewsList";

export default function ReviewsSection({
  itemId,
  tableName,
  foreignKey,
  onReviewChange, // callback from parent
}) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Get current user
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
    // fallback to localStorage or anonymous
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

  // Initialize user and fetch reviews
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
    <Paper elevation={2} sx={{ mt: 5, p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
      {/* Title + Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Customer Reviews
        </Typography>

        <Button
          variant="outlined"
          startIcon={<RateReviewIcon />}
          onClick={() => setOpenDialog(true)}
          disabled={!user}
          sx={{
            backgroundColor: "#ffffff",
            color: "#333",
            borderRadius: 3,
            textTransform: "none",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            "&:hover": {
              backgroundColor: "#f5f5f5",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            },
          }}
        >
          Write a Review
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Review Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Write a Review
          <IconButton onClick={() => setOpenDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ReviewForm
            itemId={itemId}
            tableName={tableName}
            foreignKey={foreignKey}
            user={user}
            onReviewAdded={() => {
              fetchReviews(user); // refresh list
              onReviewChange?.(); // notify parent MealDetail
              setOpenDialog(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <Divider sx={{ mb: 3 }} />

      {/* Reviews List */}
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
          onReviewDeleted={() => {
            fetchReviews(user);
            onReviewChange?.(); // notify parent after deletion
          }}
        />
      )}
    </Paper>
  );
}
