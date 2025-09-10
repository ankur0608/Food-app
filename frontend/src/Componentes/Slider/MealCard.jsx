// MealCard.jsx
import { memo } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useToast } from "./../Store/ToastContext.jsx";

const MealCard = memo(({ meal, onAddToCart, isDark, isAdding }) => {
  const { showToast } = useToast();

  const handleAddToCart = (e) => {
    e.preventDefault();
    onAddToCart(meal);
    showToast(`${meal.name} added to cart`, "success");
  };

  return (
    <Link
      to={`/meals/${meal.name}`}
      style={{ textDecoration: "none" }}
      key={meal.id}
    >
      <Card
        sx={{
          borderRadius: 3,
          p: 1.5,
          m: 1,
          bgcolor: isDark ? "#1e1e24" : "background.paper",
          color: isDark ? "#fff" : "inherit",
          boxShadow: "0px 6px 18px rgba(0,0,0,0.12)",
          transition: "all 0.3s ease",
          "&:hover": { transform: "translateY(-6px)" },
        }}
      >
        <CardMedia
          component="img"
          alt={meal.name}
          loading="lazy"
          sx={{
            borderRadius: 2,
            height: 180,
            width: "100%",
            objectFit: "cover",
          }}
          image={
            meal.image.startsWith("http")
              ? meal.image
              : `https://food-app-d8r3.onrender.com/images/${meal.image}`
          }
          onError={(e) => {
            e.target.src = "/assets/default-meal.jpg";
          }}
        />
        <CardContent sx={{ px: 1.5, py: 2 }}>
          <Typography
            gutterBottom
            variant="h6"
            fontWeight="700"
            sx={{
              color: isDark ? "#f5f5f5" : "text.primary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: "1.1rem",
            }}
          >
            {meal.name}
          </Typography>
          <Typography
            variant="body2"
            color={isDark ? "#aaa" : "text.secondary"}
            sx={{
              mb: 1.5,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              fontSize: "0.9rem",
              lineHeight: 1.4,
            }}
          >
            {meal.description}
          </Typography>
          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 1 }}>
            Price: ₹{meal.price}
          </Typography>
          <Button
            variant="contained"
            aria-label="Add to Cart"
            fullWidth
            size="medium"
            sx={{
              mt: 1,
              borderRadius: 2,
              fontWeight: 600,
              py: 1.2,

              textTransform: "none",
            }}
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? "Adding..." : "Add to Cart"}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
});

export default MealCard;
