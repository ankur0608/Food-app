import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import {
  Box,
  Typography,
  Rating,
  useTheme,
  Skeleton,
  useMediaQuery,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";
export default function OverallRating({ foodId }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [average, setAverage] = useState(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAverageRating = async () => {
      setLoading(true);
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

      setLoading(false);
    };

    fetchAverageRating();
  }, [foodId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}>
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
      <Typography
        variant="body2"
        sx={{ color: theme.palette.text.secondary, ml: 2 }}
      >
        No ratings yet
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        // ml: isMobile ? 1 : 2,
        flexWrap: "wrap",
        ml:9
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
        icon={<StarIcon fontSize="inherit" sx={{ color: "#FFD700" }} />}
        emptyIcon={
          <StarBorderIcon fontSize="inherit" sx={{ color: "#FFD700" }} />
        }
        // halfIcon={<StarHalfIcon fontSize="inherit" sx={{ color: "#FFD700" }} />}
        sx={{ mt: 2.3 }}
      />

      <Typography variant="body2" color="text.secondary">
        ({count})
      </Typography>
    </Box>
  );
}
