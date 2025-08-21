import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Link,
  Grid,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import OverallRating from "../Componentes/RatingOverall";

export default function MealsGrid({ meals, addingId, handleAddToCart }) {
  return (
    <Grid
      container
      spacing={{ xs: 2, sm: 3 }} // space between cards
      justifyContent="center" // center all cards horizontally
      sx={{ padding: 2 }}
    >
      {meals.map((meal) => (
        <Grid
          item
          key={meal.id}
          xs={12} // 1 card per row on very small screens
          sm={4} // 2 per row on small screens
          md={4} // 3 per row on medium screens
          lg={3} // 4 per row on large screens
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Card
            sx={{
              height: { xs: 430, sm: 430, md: 430 },
              width: { xs: "100%", sm: 280, md: 300, lg: 320 },
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.03)" },
            }}
          >
            <Link
              component={RouterLink}
              to={`/meals/${meal.name}`}
              underline="none"
              style={{ width: "100%" }}
            >
              <CardMedia
                component="img"
                alt={meal.name}
                loading="lazy"
                sx={{
                  height: 180,
                  objectFit: "cover",
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                }}
                image={
                  meal.image.startsWith("http")
                    ? meal.image
                    : `https://food-app-d8r3.onrender.com/images/${meal.image}`
                }
                onError={(e) => (e.target.src = "/assets/default-meal.jpg")}
              />
            </Link>

            <CardContent
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Link
                  component={RouterLink}
                  to={`/meals/${meal.name}`}
                  underline="none"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    {meal.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      minHeight: "3.6em",
                      maxWidth: "100%",
                      mb: 1,
                    }}
                  >
                    {meal.description}
                  </Typography>
                </Link>
                <OverallRating foodId={meal.id} />
                <Typography sx={{ fontWeight: "bold", color: "#1d1d1db0" }}>
                  ₹{meal.price}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                sx={{ py: 1.5, fontWeight: "bold", borderRadius: 2, mt: 2 }}
                onClick={() => handleAddToCart(meal)}
                disabled={addingId === meal.id}
              >
                {addingId === meal.id ? "Adding..." : "Add To Cart"}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
