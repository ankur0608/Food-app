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
import ReviewForm from "../../Componentes/ReviewForm.jsx";
import ReviewList from "../../Componentes/ReviewsList.jsx";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function MealsDetail() {
  const [meal, setMeal] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { name } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const { data, error } = await supabase
          .from("foods")
          .select("*")
          .eq("name", decodeURIComponent(name))
          .single();

        if (error) throw error;
        setMeal(data);

        if (data.image) {
          const { data: imgData, error: imgError } = supabase.storage
            .from("meal-images")
            .getPublicUrl(data.image);

          if (imgError) throw imgError;
          setImageUrl(imgData.publicUrl);
        }

        const { data: reviewData, error: reviewError } = await supabase
          .from("food_reviews")
          .select("id, rating, comment, created_at, user_id")
          .eq("food_id", data.id)
          .order("created_at", { ascending: false });

        if (!reviewError) setReviews(reviewData);
      } catch (err) {
        console.error(err.message);
        setError("Meal not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [name]);

  const handleImageError = (e) => {
    e.target.src = "/assets/default-meal.jpg";
  };

  const handleReviewSubmit = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Skeleton variant="rectangular" width="100%" height={300} />
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

  if (!meal) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Meal not found.</Typography>
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
        }}
      >
        <CardMedia
          component="img"
          height="400"
          image={meal.image.startsWith("http") ? meal.image : imageUrl}
          alt={meal.name}
          onError={handleImageError}
          sx={{
            objectFit: "cover",
            filter: theme === "dark" ? "brightness(0.85)" : "none",
          }}
        />
        <CardContent>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "1.8rem", md: "2.2rem" },
            }}
          >
            {meal.name}
          </Typography>

          <Typography
            variant="body1"
            gutterBottom
            sx={{ fontSize: { xs: "1rem", md: "1.1rem" }, mb: 2 }}
          >
            {meal.description}
          </Typography>

          <Typography
            variant="h6"
            color="primary"
            sx={{
              fontWeight: "600",
              fontSize: "1.2rem",
              backgroundColor:
                theme === "dark" ? "rgba(255,255,255,0.05)" : "#f0f0f0",
              display: "inline-block",
              px: 2,
              py: 1,
              borderRadius: 2,
            }}
          >
            ₹{meal.price}
          </Typography>
        </CardContent>
      </Card>

      {/* Review form */}
      <Box sx={{ mb: 4 }}>
        <ReviewForm foodId={meal.id} onReviewSubmit={handleReviewSubmit} />
      </Box>

      {/* Review list */}
      <ReviewList
        reviews={reviews}
        setReviews={setReviews}
        foodId={meal.id}
        centerDelete
      />
    </Container>
  );
}
