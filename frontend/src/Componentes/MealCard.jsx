import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import OverallRating from "../Componentes/RatingOverall";

export default function MealCard({ meal, addingId, handleAddToCart }) {
  return (
    <Card
      sx={{
        height: 430,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Link
        component={RouterLink}
        to={`/meals/${meal.name}`}
        underline="none"
        sx={{ width: "100%" }}
      >
        <CardMedia
          component="img"
          alt={meal.name}
          loading="lazy"
          decoding="async"
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
          onError={(e) => {
            e.currentTarget.src = "/assets/default-meal.jpg";
          }}
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
            sx={{ textDecoration: "none", color: "inherit" }}
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
                maxWidth: "18rem",
                mb: 1,
              }}
            >
              {meal.description}
            </Typography>
          </Link>
          <OverallRating
            itemId={meal.id}
            tableName="food_reviews"
            foreignKey="food_id"
          />
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
          aria-label={`Add ${meal.name} to cart`}
        >
          {addingId === meal.id ? "Adding..." : "Add To Cart"}
        </Button>
      </CardContent>
    </Card>
  );
}
