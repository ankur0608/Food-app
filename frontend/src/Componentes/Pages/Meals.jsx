// Meals.jsx
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaTimes } from "react-icons/fa";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";

import { CartContext } from "../Store/CartContext.jsx";
import { useTheme } from "../Store/theme";
import OpeningHours from "../OpeningHours.jsx";
import OverallRating from "../RatingOverall.jsx";
import styles from "./Meals.module.css";

export default function Menu() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const mealsPerPage = 8;

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

  const handleAddToCart = (e, meal) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.getItem("token") ? addItem(meal) : navigate("/signup");
  };

  const handleImageError = (e) => {
    e.target.src = "/assets/default-meal.jpg";
  };

  const categories = ["All", ...new Set(meals.map((meal) => meal.category))];

  const filteredMeals = meals.filter(({ name, category }) => {
    const matchCategory =
      selectedCategory === "All" || category === selectedCategory;
    const matchSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filteredMeals.length / mealsPerPage);
  const currentMeals = filteredMeals.slice(
    (currentPage - 1) * mealsPerPage,
    currentPage * mealsPerPage
  );

  return (
    <div className={`${styles["product-container"]} ${styles[theme]}`}>
      <h1 className={styles.title}>Menu</h1>

      <div className={styles.categoryFilter}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`${styles.btn_category} ${
              selectedCategory === cat ? styles.active : ""
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.searchWrapper}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search meals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchinput}
        />
        {searchQuery && (
          <FaTimes
            className={styles.clearIcon}
            onClick={() => setSearchQuery("")}
            title="Clear search"
          />
        )}
      </div>

      <ul className={styles["meals-list"]}>
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <li className={styles["meal-card"]} key={index}>
              <Skeleton variant="rectangular" width="100%" height={160} />
              <Skeleton
                variant="text"
                width="60%"
                height={30}
                style={{ marginTop: 8 }}
              />
              <Skeleton variant="text" width="80%" height={20} />
              <Skeleton variant="text" width="40%" height={20} />
              <Skeleton variant="rounded" width="100%" height={36} />
            </li>
          ))
        ) : currentMeals.length > 0 ? (
          currentMeals.map((meal) => (
            <Link
              to={`/meals/${meal.name}`}
              className={styles["meal-Link"]}
              key={meal.name}
            >
              <li className={styles["meal-card"]}>
                <img
                  src={meal.image}
                  alt={meal.name}
                  onError={handleImageError}
                />
                <h3>{meal.name}</h3>
                <p className={styles["meal-price"]}>{meal.description}</p>
                <span>₹{meal.price}</span>
                <OverallRating foodId={meal.id} />
                <button onClick={(e) => handleAddToCart(e, meal)}>
                  Add To Cart
                </button>
              </li>
            </Link>
          ))
        ) : (
          <p className={styles["no-meals"]}>No meals found.</p>
        )}
      </ul>
      <Box
        sx={{
          mt: 8,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            variant="outlined"
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                backgroundColor: "#fff",
                "&.Mui-selected": {
                  backgroundColor: "#f3592aff",
                  color: "#fff",
                },
              },
            }}
          />
        )}
      </Box>
      <OpeningHours />
    </div>
  );
}
