// src/components/AutoPlaySlider.jsx
import { useContext, useCallback, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import Slider from "react-slick";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";

import { CartContext } from "../Store/CartContext";
import { useTheme } from "../Store/theme";
import MealCard from "./MealCard";
import MealSkeleton from "./MealSkeleton";
import { NextArrow, PrevArrow } from "./CustomArrows";

import { useMeals } from "../hooks/useMeals"; // ✅ use Supabase hook

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SliderModule.css";

const AutoPlaySlider = () => {
  const { addItem } = useContext(CartContext);
  const { theme: customTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const navigate = useNavigate();
  const [addingId, setAddingId] = useState(null);
  const isMobile = useMediaQuery("(max-width:600px)");

  const { data: meals = [], isLoading, isError, error } = useMeals(); // ✅ now fetching from Supabase

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
              <Box
                key={idx}
                px={2}
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight={250}
              >
                {isMobile ? null : <MealSkeleton />}
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
