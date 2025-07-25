import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Box, Typography, Rating, useTheme, Skeleton } from "@mui/material";

export default function OverallRating({ foodId }) {
  const theme = useTheme();
  const [average, setAverage] = useState(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true); // 👈 loading state

  useEffect(() => {
    const fetchAverageRating = async () => {
      setLoading(true); // 👈 Start loading
      const { data, error } = await supabase
        .from("food_reviews")
        .select("rating")
        .eq("food_id", foodId);

      if (!error && data.length > 0) {
        const total = data.reduce((sum, r) => sum + r.rating, 0);
        const avg = total / data.length;
        setAverage(avg);
        setCount(data.length);
      } else {
        setAverage(null);
        setCount(0);
      }

      setLoading(false); // 👈 Stop loading
    };

    fetchAverageRating();
  }, [foodId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", ml: 6, gap: 1 }}>
        <Skeleton variant="text" width={24} height={24} />
        <Skeleton
          variant="rectangular"
          width={80}
          height={24}
          sx={{ borderRadius: 1 }}
        />
        <Skeleton variant="text" width={30} height={20} />
      </Box>
    );
  }

  if (!average || count === 0) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        ml: 6,
        gap: 1,
        mb: 0,
      }}
    >
      <Typography
        variant="body1"
        sx={{
          fontWeight: 600,
          color: theme.palette.primary.main,
        }}
      >
        {average.toFixed(1)}
      </Typography>

      <Rating
        value={average}
        precision={0.1}
        readOnly
        size="small"
        sx={{
          "& .MuiRating-iconFilled": {
            color: "#FFD700",
          },
          "& .MuiRating-iconEmpty": {
            color: "#ccc",
          },
          mt: 2.3,
        }}
      />

      <Typography variant="body2" color="text.secondary">
        ({count})
      </Typography>
    </Box>
  );
}
