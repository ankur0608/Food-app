import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { CartContext } from "../Store/CartContext";
import { useTheme } from "../Store/theme";
import "./SliderModule.css";

const AutoPlaySlider = () => {
  const [meals, setMeals] = useState([]);
  const { addItem } = useContext(CartContext);
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch("http://localhost:5000/meals");
        if (!response.ok) throw new Error("Failed to fetch meals.");
        const data = await response.json();
        setMeals(data);
      } catch (error) {
        console.error("Error fetching meals:", error.message);
      }
    };

    fetchMeals();
  }, []);

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
        breakpoint: 1024, // for tablets and below
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768, // for small screens (like mobile)
        settings: {
          slidesToShow: 1,
        },
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

      <Slider {...sliderSettings}>
        {meals.map((meal) => (
          <div key={meal.id} className="meal-card">
            <img
              src={
                meal.image.startsWith("http")
                  ? meal.image
                  : `http://localhost:5000/images/${meal.image}`
              }
              className="meal-image"
            />
            <h3>{meal.name}</h3>
            <p className="meal-description">{meal.description}</p>
            <p className="meal-price">${meal.price}</p>
            <button className="add-btn" onClick={() => handleAddToCart(meal)}>
              Add To Cart
            </button>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default AutoPlaySlider;
