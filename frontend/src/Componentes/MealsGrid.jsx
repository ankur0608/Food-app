import { Grid, Card, Skeleton, Typography } from "@mui/material";
import MealCard from "./MealCard.jsx";

export default function MealsGrid({
  meals,
  isLoading,
  currentMeals,
  addingId,
  handleAddToCart,
  mealsPerPage,
}) {
  if (isLoading) {
    return (
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {Array.from({ length: mealsPerPage }).map((_, index) => (
          <Grid item xs={12} sm={5} md={4} lg={3} key={index}>
            <Card
              sx={{
                height: { xs: 430, sm: 430, md: 430 },
                width: { xs: 340, sm: 300, md: 295 },
                borderRadius: 2,
              }}
            >
              <Skeleton
                variant="rectangular"
                width="100%"
                height={180}
                sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
              />
              <Skeleton
                variant="text"
                width="90%"
                height={28}
                sx={{ mb: 1, mt: 1 }}
              />
              <Skeleton
                variant="text"
                width="100%"
                height={40}
                sx={{ mb: 1 }}
              />
              <Skeleton variant="text" width="50%" height={20} sx={{ mb: 1 }} />
              <Skeleton
                variant="rectangular"
                width="90%"
                height={36}
                sx={{ borderRadius: 2 }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!currentMeals.length) {
    return (
      <Typography variant="h6" align="center" sx={{ width: "100%", mt: 4 }}>
        No meals found.
      </Typography>
    );
  }

  return (
    <Grid container spacing={{ xs: 2, sm: 3 }}>
      {currentMeals.map((meal) => (
        <Grid item key={meal.id} xs={6} sm={6} md={4} lg={3}>
          <MealCard
            meal={meal}
            addingId={addingId}
            handleAddToCart={handleAddToCart}
          />
        </Grid>
      ))}
    </Grid>
  );
}
