import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaTimes } from "react-icons/fa";
import axios from "axios";

import styles from "./Meals.module.css";
import { CartContext } from "../Store/CartContext.jsx";
import { useTheme } from "../Store/theme";
import Loading from "../../Componentes/Loading.jsx";
import OpeningHours from "../OpeningHours.jsx";
import { useQuery } from "@tanstack/react-query";

export default function Menu() {
  // ---------------------- State ----------------------

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const mealsPerPage = 6;

  const { addItem } = useContext(CartContext);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const {
    data: meals = [],
    isLoading: loading,
    isError,
    error,
  } = useQuery({
    queryKey: ["meals"],
    queryFn: async () => {
      const res = await axios.get("https://food-app-d8r3.onrender.com/meals");
      return res.data;
    },
  });

  // ---------------------- Handlers ----------------------
  const handleAddToCart = (e, meal) => {
    e.stopPropagation(); // prevent link navigation
    e.preventDefault();
    localStorage.getItem("token") ? addItem(meal) : navigate("/signup");
  };

  const handleImageError = (e) => {
    e.target.src = "/assets/default-meal.jpg";
  };

  // ---------------------- Filter Logic ----------------------
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

  // ---------------------- UI ----------------------
  return (
    <div className={`${styles["product-container"]} ${styles[theme]}`}>
      <h1 className={styles.title}>Menu</h1>

      {/* Category Filter */}
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

      {/* Search Bar */}
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

      {/* Meals Display */}
      {loading ? (
        <Loading />
      ) : filteredMeals.length === 0 ? (
        <p className={styles["no-meals"]}>No meals found.</p>
      ) : (
        <ul className={styles["meals-list"]}>
          {currentMeals.map((meal) => (
            <Link
              to={`/meals/${meal.name}`}
              className={styles["meal-Link"]}
              key={meal.name}
            >
              <li className={styles["meal-card"]}>
                <img
                  src={
                    meal.image.startsWith("http")
                      ? meal.image
                      : `https://food-app-d8r3.onrender.com/images/${meal.image}`
                  }
                  alt={meal.name}
                  onError={handleImageError}
                />
                <h3>{meal.name}</h3>
                <p className={styles["meal-price"]}>{meal.description}</p>
                <span>${meal.price}</span>
                <button onClick={(e) => handleAddToCart(e, meal)}>
                  Add To Cart
                </button>
              </li>
            </Link>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`${styles["page-btn"]} ${styles.prev}`}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`${styles["page-btn"]} ${
                currentPage === i + 1 ? styles.active : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`${styles["page-btn"]} ${styles.next}`}
          >
            Next
          </button>
        </div>
      )}

      {/* Opening Hours */}
      <OpeningHours />
    </div>
  );
}
