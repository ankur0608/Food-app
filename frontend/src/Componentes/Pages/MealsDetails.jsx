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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "../Store/theme.jsx";
import ReviewsSection from "../../Componentes/ReviewsSection.jsx";
import AddToCartButton from "../AddToCartButton.jsx";
import OverallRating from "../RatingOverall.jsx";

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

  // Fetch meal details
  useEffect(() => {
    const fetchMeal = async () => {
      setLoading(true);
      try {
        const { data: mealData, error: mealError } = await supabase
          .from("foods")
          .select("*")
          .eq("name", decodeURIComponent(name))
          .single();

        if (mealError) throw mealError;
        setMeal(mealData);

        if (mealData.image) {
          const { data: imgData } = supabase.storage
            .from("meal-images")
            .getPublicUrl(mealData.image);

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

  if (loading) {
    return (
      <Container sx={{ mt: 15 }}>
        <Skeleton variant="rectangular" width="100%" height={350} />
        <Skeleton variant="text" width="60%" sx={{ mt: 2 }} />
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="80%" />
      </Container>
    );
  }

  if (error || !meal) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">{error || "Meal not found."}</Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{ pt: 12, pb: 6, px: { xs: 2, sm: 3, md: 10 } }}
    >
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          bgcolor: theme === "dark" ? "#1a1a1a" : "#fff",
          color: theme === "dark" ? "#f5f5f5" : "#1a1a1a",
          borderRadius: 4,
          boxShadow:
            theme === "dark"
              ? "0 8px 30px rgba(0,0,0,0.6)"
              : "0 8px 30px rgba(0,0,0,0.1)",
          gap: 4,
        }}
      >
        <CardMedia
          component="img"
          height={400}
          sx={{
            width: { xs: "100%", md: "50%" },
            objectFit: "cover",
            borderRadius: { xs: 0, md: "16px 0 0 16px" },
          }}
          image={
            meal.image.startsWith("http")
              ? meal.image
              : imageUrl || "/assets/default-meal.jpg"
          }
          alt={meal.name}
          onError={(e) => (e.target.src = "/assets/default-meal.jpg")}
        />

        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            px: { xs: 2, sm: 4, md: 6 },
            py: { xs: 3, sm: 4, md: 5 },
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {meal.name}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: theme === "dark" ? "#f5f5f5" : "#1a1a1a",
              lineHeight: 1.8,
              fontSize: "1.05rem",
              whiteSpace: "pre-line",
              mb: 3,
            }}
          >
            {meal.description}
          </Typography>

          {/* Overall rating with real-time updates */}
          <OverallRating
            itemId={meal.id}
            tableName="food_reviews"
            foreignKey="food_id"
          />

          <Typography
            variant="h6"
            color="primary"
            sx={{
              fontWeight: 700,
              mt: 2,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              display: "inline-block",
              mb: 4,
              fontSize: "1.2rem",
            }}
          >
            ₹{meal.price}
          </Typography>

          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{
              py: 1.8,
              fontSize: "1.1rem",
              borderRadius: 3,
              fontWeight: 600,
              background:
                theme === "dark"
                  ? "linear-gradient(90deg, #ff7e5f, #feb47b)"
                  : "linear-gradient(90deg, #ff6a00, #ff8e53)",
              color: "#fff",
              boxShadow:
                theme === "dark"
                  ? "0 6px 20px rgba(0,0,0,0.5)"
                  : "0 6px 20px rgba(0,0,0,0.15)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow:
                  theme === "dark"
                    ? "0 8px 25px rgba(0,0,0,0.6)"
                    : "0 8px 25px rgba(0,0,0,0.2)",
              },
            }}
            onClick={() => AddToCartButton({ food: meal })}
          >
            Add to Cart
          </Button>
        </CardContent>
      </Card>

      <Box sx={{ mt: 4 }}>
        {/* ReviewsSection with real-time updates */}
        <ReviewsSection
          itemId={meal.id}
          tableName="food_reviews"
          foreignKey="food_id"
        />
      </Box>
    </Container>
  );
}
