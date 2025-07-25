import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "@mui/material/Skeleton";

import { CartContext } from "../Store/CartContext";
import { useTheme } from "../Store/theme";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SliderModule.css";

// Skeleton card component
const MealSkeleton = () => {
  return (
    <div className="meal-card">
      <Skeleton variant="rectangular" width="100%" height={150} />
      <Skeleton
        variant="text"
        width="80%"
        height={28}
        style={{ marginTop: 8 }}
      />
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="60%" />
      <Skeleton
        variant="rounded"
        width="100%"
        height={36}
        style={{ marginTop: 12 }}
      />
    </div>
  );
};

// Meal display card
const MealCard = ({ meal, onAddToCart }) => {
  return (
    <div className="meal-card">
      <img
        src={
          meal.image.startsWith("http")
            ? meal.image
            : `https://food-app-d8r3.onrender.com/images/${meal.image}`
        }
        alt={meal.name}
        className="meal-image"
        onError={(e) => (e.target.src = "/assets/default-meal.jpg")}
      />
      <h3>{meal.name}</h3>
      <p className="meal-description">{meal.description}</p>
      <p className="meal-price">${meal.price}</p>
      <button className="add-btn" onClick={() => onAddToCart(meal)}>
        Add To Cart
      </button>
    </div>
  );
};

const AutoPlaySlider = () => {
  const { addItem } = useContext(CartContext);
  const { theme } = useTheme();
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

  return (
    <div
      className={`slider-container ${
        theme === "dark" ? "dark-theme" : "light-theme"
      }`}
    >
      <div className="view-all">
        <h2 className="slider-title">Meals</h2>
        <Link to="/meals">View All</Link>
      </div>

      {isError && <p className="status-message error">{error.message}</p>}

      {isLoading ? (
        <Slider {...sliderSettings}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <MealSkeleton key={idx} />
          ))}
        </Slider>
      ) : meals.length > 0 ? (
        <Slider {...sliderSettings}>
          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} onAddToCart={handleAddToCart} />
          ))}
        </Slider>
      ) : (
        <p className="status-message">No meals available.</p>
      )}
    </div>
  );
};

export default AutoPlaySlider;
