import { useEffect, useState, useContext } from "react";
import styles from "./Meals.module.css";
import { CartContext } from "../Store/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../Store/theme";
import { FaSearch } from "react-icons/fa";

export default function Product() {
  const [meals, setMeals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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

  function handleAddToCart(meal) {
    const token = localStorage.getItem("token");
    if (token) {
      CartCtx.addItem(meal);
    } else {
      navigate("/signup");
    }
  }

  const filteredMeals = meals.filter((meal) =>
    meal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`${styles["product-container"]} ${styles[theme]}`}>
      <div> <h1>Meals</h1>

      {/* Search Input */}
      <div className={styles.searchWrapper}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search meals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div></div>
     

      <ul className={styles["meals-list"]}>
        {filteredMeals.map((meal) => (
          <li className={styles["meal-card"]} key={meal.id}>
            <img
              src={`http://localhost:5000/images/${meal.image}`}
              alt={meal.name}
            />
            <h3>{meal.name}</h3>
            <p className={styles["meal-price"]}>{meal.description}</p>
            <p>${meal.price}</p>
            <button onClick={() => handleAddToCart(meal)}>Add To Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
