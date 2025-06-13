import { useEffect, useState, useContext } from "react";
import styles from "./Meals.module.css";
import { CartContext } from "../Store/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../Store/theme";
import { FaSearch } from "react-icons/fa";

export default function Product() {
  const [meals, setMeals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const mealsPerPage = Math.ceil(meals.length / 3);

  const CartCtx = useContext(CartContext);
  const navigate = useNavigate();
  const { theme } = useTheme();

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

  // Get unique categories
  const categories = [
    "All",
    ...Array.from(new Set(meals.map((meal) => meal.category))),
  ];

  function handleAddToCart(meal) {
    const token = localStorage.getItem("token");
    if (token) {
      CartCtx.addItem(meal);
    } else {
      navigate("/signup");
    }
  }

  // Filter meals by category and search
  const filteredMeals = meals.filter((meal) => {
    const matchesCategory =
      selectedCategory === "All" || meal.category === selectedCategory;
    const matchesSearch = meal.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredMeals.length / mealsPerPage);
  const startpoint = (currentPage - 1) * mealsPerPage;
  const endpoint = startpoint + mealsPerPage;

  // Reset to page 1 when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  return (
    <div className={`${styles["product-container"]} ${styles[theme]}`}>
      <div>
        <h1>Meals</h1>
        {/* Category Filter */}
        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`${styles.btn_category} ${
                selectedCategory === cat ? styles.active : ""
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* Search input */}
        <div className={styles.searchWrapper}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search meals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchinput}
          />
        </div>
      </div>

      {filteredMeals.length === 0 ? (
        <p className={styles["no-meals"]}>No meals found.</p>
      ) : (
        <ul className={styles["meals-list"]}>
          {filteredMeals.slice(startpoint, endpoint).map((meal) => (
            <li className={styles["meal-card"]} key={meal.id}>
              <img
                src={
                  meal.image.startsWith("http")
                    ? meal.image
                    : `http://localhost:5000/images/${meal.image}`
                }
                alt={meal.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/assets/default-meal.jpg";
                }}
              />
              <h3>{meal.name}</h3>
              <p className={styles["meal-price"]}>{meal.description}</p>
              <span>${meal.price}</span>
              <button onClick={() => handleAddToCart(meal)}>Add To Cart</button>
            </li>
          ))}
        </ul>
      )}
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`${styles["page-btn"]} ${styles.prev}`}
          >
            Prev
          </button>
          {[...Array(totalPages).keys()].map((n) => (
            <button
              key={n + 1}
              onClick={() => setCurrentPage(n + 1)}
              className={`${styles["page-btn"]} ${
                currentPage === n + 1 ? styles.active : ""
              }`}
            >
              {n + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`${styles["page-btn"]} ${styles.next}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
