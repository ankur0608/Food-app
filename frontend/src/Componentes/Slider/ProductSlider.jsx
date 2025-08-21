// AutoPlaySlider.jsx
import { useContext, memo, useCallback, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Skeleton,
  Box,
  IconButton,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";

import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

import { CartContext } from "../Store/CartContext";
import { useTheme } from "../Store/theme";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SliderModule.css";

// ----------------- Memoized Skeleton -----------------
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

// ----------------- Memoized MealCard -----------------
const MealCard = memo(({ meal, onAddToCart, isDark, isAdding }) => (
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
        "&:hover": {
          transform: "translateY(-6px)",
        },
      }}
    >
      <CardMedia
        component="img"
        alt={meal.name}
        loading="lazy"
        sx={{ borderRadius: 2 }}
        image={
          meal.image.startsWith("http")
            ? meal.image
            : `https://food-app-d8r3.onrender.com/images/${meal.image}`
        }
        onError={(e) => {
          e.target.src = "/assets/default-meal.jpg";
        }}
        srcSet={
          meal.image.startsWith("http")
            ? `${meal.image}?w=320 320w,
         ${meal.image}?w=480 480w,
         ${meal.image}?w=800 800w`
            : `https://food-app-d8r3.onrender.com/images/${meal.image}?w=320 320w,
         https://food-app-d8r3.onrender.com/images/${meal.image}?w=480 480w,
         https://food-app-d8r3.onrender.com/images/${meal.image}?w=800 800w`
        }
        sizes="(max-width: 600px) 320px, (max-width: 960px) 480px, 800px"
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
          fullWidth
          size="medium"
          sx={{
            mt: 1,
            borderRadius: 2,
            fontWeight: 600,
            py: 1.2,
            background: "linear-gradient(90deg, #ff6600 0%, #ff8533 100%)",
            textTransform: "none",
          }}
          onClick={(e) => {
            e.preventDefault();
            onAddToCart(meal);
          }}
          disabled={isAdding}
        >
          {isAdding ? "Adding..." : "Add to Cart"}
        </Button>
      </CardContent>
    </Card>
  </Link>
));

// ----------------- Memoized Custom Arrows -----------------
const NextArrow = memo(({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      right: -15,
      top: "40%",
      zIndex: 10,
      bgcolor: "background.paper",
      "&:hover": { bgcolor: "grey.300" },
    }}
  >
    <ArrowForwardIos fontSize="small" />
  </IconButton>
));

const PrevArrow = memo(({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      left: -15,
      top: "40%",
      zIndex: 10,
      bgcolor: "background.paper",
      "&:hover": { bgcolor: "grey.300" },
    }}
  >
    <ArrowBackIos fontSize="small" />
  </IconButton>
));

// ----------------- Main Slider Component -----------------
const AutoPlaySlider = () => {
  const { addItem } = useContext(CartContext);
  const { theme: customTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const navigate = useNavigate();
  const [addingId, setAddingId] = useState(null);
  const isMobile = useMediaQuery("(max-width:600px)");

  const {
    data: meals = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["meals"],
    queryFn: async () => {
      const res = await axios.get("https://food-app-d8r3.onrender.com/meals");
      return res.data;
    },
  });

  // ----------------- Add to Cart -----------------
  const handleAddToCart = useCallback(
    async (meal) => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      if (!token || !user) {
        navigate("/signup");
        return;
      }

      setAddingId(meal.id);

      await addItem(
        {
          id: meal.id,
          name: meal.name,
          price: meal.price,
          quantity: 1,
          image: meal.image,
        },
        user.id
      );

      setAddingId(null);
    },
    [addItem, navigate]
  );

  // ----------------- Slider Settings -----------------
  const sliderSettings = useMemo(
    () => ({
      infinite: true,
      slidesToShow: isMobile ? 1 : 4,
      slidesToScroll: 1,
      autoplay: true,
      speed: 1200,
      autoplaySpeed: 2500,
      cssEase: "ease-in-out",
      lazyLoad: "ondemand",
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      responsive: [
        { breakpoint: 1280, settings: { slidesToShow: 3 } },
        { breakpoint: 960, settings: { slidesToShow: 2 } },
        { breakpoint: 600, settings: { slidesToShow: 1 } },
      ],
    }),
    [isMobile]
  );

  const isDark = customTheme === "dark";

  return (
    <Box
      className={`slider-container ${isDark ? "dark-theme" : "light-theme"}`}
      sx={{
        py: 5,
        background: isDark ? "#121212" : "#fafafa",
        borderRadius: 3,
      }}
    >
      <Box sx={{ px: 3 }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              <span
                style={{
                  fontWeight: 600,
                  color: muiTheme.palette.primary.main,
                }}
              >
                Meals
              </span>
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "0.7rem", sm: "0.7rem", md: "1rem" },
                color: "grey",
              }}
            >
              Handpicked dishes just for you
            </Typography>
          </Box>
          <Link
            to="/meals"
            style={{
              textDecoration: "none",
              fontWeight: "600",
              color: muiTheme.palette.primary.main,
            }}
          >
            View All
          </Link>
        </Box>

        {/* Slider */}
        {isError ? (
          <Typography color="error">{error.message}</Typography>
        ) : isLoading ? (
          <Slider {...sliderSettings}>
            {Array.from({ length: isMobile ? 1 : 4 }).map((_, idx) => (
              <Box key={idx} px={2}>
                <MealSkeleton />
              </Box>
            ))}
          </Slider>
        ) : meals.length > 0 ? (
          <Slider {...sliderSettings}>
            {meals.map((meal) => (
              <Box key={meal.id} px={2} sx={{ pb: 2 }}>
                <MealCard
                  meal={meal}
                  onAddToCart={handleAddToCart}
                  isDark={isDark}
                  isAdding={addingId === meal.id}
                />
              </Box>
            ))}
          </Slider>
        ) : (
          <Typography>No meals available.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default AutoPlaySlider;
