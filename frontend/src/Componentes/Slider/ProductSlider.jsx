import { useContext } from "react";
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
  useTheme as useMuiTheme,
  styled,
  colors,
} from "@mui/material";

import { CartContext } from "../Store/CartContext";
import { useTheme } from "../Store/theme";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SliderModule.css"; // retain for slick container styles

// Skeleton Card
const MealSkeleton = () => (
  <Card sx={{ p: 1 }}>
    <Skeleton variant="rectangular" height={140} />
    <Skeleton variant="text" sx={{ mt: 1 }} width="80%" />
    <Skeleton variant="text" width="90%" />
    <Skeleton variant="text" width="60%" />
    <Skeleton variant="rounded" sx={{ mt: 1 }} height={36} />
  </Card>
);

// Meal Card
const MealCard = ({ meal, onAddToCart, isDark }) => (
  <>
    <Link
      to={`/meals/${meal.name}`}
      style={{ textDecoration: "none" }}
      key={meal.name}
    >
      <Card
        sx={{
          maxWidth: 305,
          m: "auto",
          p: 1,
          bgcolor: isDark ? "#23272f" : "background.paper",
          color: isDark ? "#fff" : "inherit",
        }}
      >
        <CardMedia
          component="img"
          height="140"
          image={
            meal.image.startsWith("http")
              ? meal.image
              : `https://food-app-d8r3.onrender.com/images/${meal.image}`
          }
          alt={meal.name}
          onError={(e) => (e.target.src = "/assets/default-meal.jpg")}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            color={isDark ? "#ccc" : "text.secondary"}
            noWrap
          >
            {meal.name}
          </Typography>
          <Typography
            variant="body2"
            color={isDark ? "#ccc" : "text.secondary"}
            noWrap
          >
            {meal.description}
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: "bold" }}>
            ₹{meal.price}
          </Typography>
          <Button
            variant="contained"
            fullWidth
            size="small"
            sx={{
              mt: 1,
              background: "linear-gradient(90deg, #ff6600 60%, #ff6600 100%)",
            }}
            onClick={() => onAddToCart(meal)}
          >
            Add to Cart
          </Button>
        </CardContent>
      </Card>{" "}
    </Link>{" "}
  </>
);

const AutoPlaySlider = () => {
  const { addItem } = useContext(CartContext);
  const { theme: customTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const navigate = useNavigate();

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

  const handleAddToCart = (meal) => {
    const token = localStorage.getItem("token");

    if (token) {
      addItem({
        id: meal.id,
        name: meal.name,
        price: meal.price,
        quantity: 1,
      });
    } else {
      navigate("/signup");
    }
  };

  const sliderSettings = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 3000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const isDark = customTheme === "dark";

  return (
    <Box
      className={`slider-container ${isDark ? "dark-theme" : "light-theme"}`}
      sx={{ px: 2, py: 4 }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" fontWeight="bold">
          Meals
        </Typography>
        <Link
          to="/meals"
          style={{
            textDecoration: "none",
            color: muiTheme.palette.primary.main,
          }}
        >
          View All
        </Link>
      </Box>

      {isError ? (
        <Typography color="error">{error.message}</Typography>
      ) : isLoading ? (
        <Slider {...sliderSettings}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <Box key={idx} px={1}>
              <MealSkeleton />
            </Box>
          ))}
        </Slider>
      ) : meals.length > 0 ? (
        <Slider {...sliderSettings}>
          {meals.map((meal) => (
            <Box key={meal.id} px={1}>
              <MealCard
                meal={meal}
                onAddToCart={handleAddToCart}
                isDark={isDark}
              />
            </Box>
          ))}
        </Slider>
      ) : (
        <Typography>No meals available.</Typography>
      )}
    </Box>
  );
};

export default AutoPlaySlider;
