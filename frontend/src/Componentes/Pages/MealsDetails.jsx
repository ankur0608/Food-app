import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import {
  Container,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  Box,
  Skeleton,
  // IconButton,
} from "@mui/material";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "../Store/theme.jsx";
import ReviewsSection from "../../Componentes/ReviewsSection.jsx";
import AddToCartButton from "../AddToCartButton.jsx";
// import { useToast } from "../../Componentes/Store/ToastContext.jsx";
// import useUserWishlist from "../../hooks/useUserWishlist.jsx";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function MealDetail() {
  const [meal, setMeal] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { name } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  // const { showToast } = useToast();

  // const user = JSON.parse(localStorage.getItem("user"));
  // const {
  //   isWishlisted,
  //   toggleWishlist,
  //   loading: wishlistLoading,
  // } = useUserWishlist(user?.id);

  useEffect(() => {
    const fetchMeal = async () => {
      setLoading(true);
      try {
        // Fetch meal details
        const { data: mealData, error: mealError } = await supabase
          .from("foods")
          .select("*")
          .eq("name", decodeURIComponent(name))
          .single();

        if (mealError) throw mealError;
        setMeal(mealData);

        // Fetch meal image
        if (mealData.image) {
          const { data: imgData, error: imgError } = supabase.storage
            .from("meal-images")
            .getPublicUrl(mealData.image);

          if (imgError) throw imgError;
          setImageUrl(imgData.publicUrl);
        }
      } catch (err) {
        console.error(err.message);
        setError("Meal not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [name]);

  // const handleWishlist = async () => {
  //   if (!user) {
  //     showToast("Please login first", "error");
  //     return;
  //   }

  //   if (!meal) return;

  //   await toggleWishlist(meal.id);

  //   showToast(
  //     isWishlisted(meal.id) ? "Removed from wishlist" : "Added to wishlist",
  //     isWishlisted(meal.id) ? "info" : "success"
  //   );
  // };

  if (loading /* || wishlistLoading */) {
    return (
      <Container sx={{ mt: 4, height: 800 }}>
        <Skeleton variant="rectangular" width="100%" height={350} />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="80%" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      <Card
        sx={{
          mb: 4,
          bgcolor: theme === "dark" ? "#1a1a1a" : "#fdfdfd",
          color: theme === "dark" ? "#f5f5f5" : "#1a1a1a",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow:
            theme === "dark"
              ? "0 2px 12px rgba(0,0,0,0.6)"
              : "0 2px 12px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
          position: "relative",
        }}
      >
        <CardMedia
          component="img"
          height="400"
          image={meal.image.startsWith("http") ? meal.image : imageUrl}
          alt={meal.name}
          onError={(e) => (e.target.src = "/assets/default-meal.jpg")}
          sx={{
            objectFit: "cover",
            filter: theme === "dark" ? "brightness(0.85)" : "none",
          }}
        />

        {/* Wishlist Button removed */}

        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
            {meal.name}
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
            {meal.description}
          </Typography>
          <Typography
            variant="h6"
            color="primary"
            sx={{
              fontWeight: "600",
              px: 2,
              py: 1,
              borderRadius: 2,
              backgroundColor:
                theme === "dark" ? "rgba(255,255,255,0.05)" : "#f0f0f0",
            }}
          >
            ₹{meal.price}
          </Typography>

          <Box sx={{ mt: 3 }}>
            <AddToCartButton food={meal} />
          </Box>
        </CardContent>
      </Card>

      <ReviewsSection
        itemId={meal.id}
        tableName="food_reviews"
        foreignKey="food_id"
      />
    </Container>
  );
}
