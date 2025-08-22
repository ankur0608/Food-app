import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Box, Typography, Rating, Skeleton, useTheme } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

export default function OverallRating({
  itemId, // id of the food or blog post
  tableName, // 'food_reviews' or 'post_reviews'
  foreignKey, // 'food_id' or 'post_id'
}) {
  const theme = useTheme();
  const [average, setAverage] = useState(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAverageRating = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from(tableName)
        .select("rating")
        .eq(foreignKey, itemId);

      if (!error && data.length > 0) {
        const total = data.reduce((sum, r) => sum + r.rating, 0);
        setAverage(total / data.length);
        setCount(data.length);
      } else {
        setAverage(null);
        setCount(0);
      }

      setLoading(false);
    };

    fetchAverageRating();
  }, [itemId, tableName, foreignKey]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Skeleton variant="text" width={28} height={28} />
        <Skeleton
          variant="rectangular"
          width={90}
          height={28}
          sx={{ borderRadius: 1 }}
        />
        <Skeleton variant="text" width={40} height={24} />
      </Box>
    );
  }

  if (count === 0 || !average) {
    return (
      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
        No ratings yet
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Typography
        variant="body1"
        sx={{ fontWeight: 600, color: theme.palette.primary.main }}
      >
        {average.toFixed(1)}
      </Typography>

      <Rating
        value={average}
        precision={0.1}
        readOnly
        size="small"
        icon={<StarIcon fontSize="inherit" sx={{ color: "#FFD700" }} />}
        emptyIcon={
          <StarBorderIcon fontSize="inherit" sx={{ color: "#FFD700" }} />
        }
      />

      <Typography variant="body2" color="text.secondary">
        ({count})
      </Typography>
    </Box>
  );
}
