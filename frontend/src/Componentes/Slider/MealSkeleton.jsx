// MealSkeleton.jsx
import { memo } from "react";
import { Card, Skeleton } from "@mui/material";

const MealSkeleton = memo(() => (
  <Card
    sx={{
      p: 2,
      borderRadius: 3,
      boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
    }}
  >
    <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
    <Skeleton variant="text" sx={{ mt: 2, width: "70%" }} />
    <Skeleton variant="text" width="50%" />
    <Skeleton variant="rounded" sx={{ mt: 2 }} height={36} />
  </Card>
));

export default MealSkeleton;
