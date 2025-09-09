import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Box, Typography, Rating, Skeleton } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

export default function OverallRating({ itemId, tableName, foreignKey }) {
  const [average, setAverage] = useState(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchAverageRating();

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`realtime-${tableName}-${itemId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: tableName,
          filter: `${foreignKey}=eq.${itemId}`,
        },
        () => {
          fetchAverageRating(); // update rating when table changes
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
    return <Typography>No ratings yet</Typography>;
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography variant="body1" sx={{ fontWeight: 600 }}>
        {average.toFixed(1)}
      </Typography>

      <Rating
        value={average}
        precision={0.1}
        readOnly
        size="small"
        icon={<StarIcon fontSize="inherit" sx={{ color: "#FFD700" }} />}
        emptyIcon={<StarBorderIcon fontSize="inherit" sx={{ color: "#FFD700" }} />}
      />

      <Typography variant="body2">({count})</Typography>
    </Box>
  );
}
