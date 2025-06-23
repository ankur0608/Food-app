import { useEffect, useState, useContext } from "react";
import styles from "./Meals.module.css";
import { CartContext } from "../Store/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../Store/theme";
import { FaSearch, FaTimes } from "react-icons/fa";
import Loading from "../../Componentes/Loading.jsx";

export default function Product() {
  const [meals, setMeals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const mealsPerPage = 6;

  const { addItem } = useContext(CartContext);
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch("http://localhost:5000/meals");
        if (!res.ok) throw new Error("Failed to fetch meals.");
        const data = await res.json();
        setMeals(data);
      } catch (err) {
        console.error("Error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  useEffect(() => setCurrentPage(1), [selectedCategory, searchQuery]);

  if (loading) return <Loading />;

  const categories = ["All", ...new Set(meals.map((meal) => meal.category))];

  const handleAddToCart = (meal) => {
    localStorage.getItem("token") ? addItem(meal) : navigate("/signup");
  };

  const filteredMeals = meals.filter(({ category, name }) => {
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
      <h1>Meals</h1>

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

      {/* Search Box */}
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

      {/* Meals List */}
      {filteredMeals.length === 0 ? (
        <p className={styles["no-meals"]}>No meals found.</p>
      ) : (
        <ul className={styles["meals-list"]}>
          {currentMeals.map((meal) => (
            <li className={styles["meal-card"]} key={meal.id}>
              <img
                src={
                  meal.image.startsWith("http")
                    ? meal.image
                    : `http://localhost:5000/images/${meal.image}`
                }
                alt={meal.name}
                onError={(e) => (e.target.src = "/assets/default-meal.jpg")}
              />
              <h3>{meal.name}</h3>
              <p className={styles["meal-price"]}>{meal.description}</p>
              <span>${meal.price}</span>
              <button onClick={() => handleAddToCart(meal)}>Add To Cart</button>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
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
