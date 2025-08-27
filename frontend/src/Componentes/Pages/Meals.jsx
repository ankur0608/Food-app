import { useState, useContext, useMemo } from "react";
import { Box, Typography, Pagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../Store/CartContext.jsx";
import { useMeals } from "../../hooks/useMeals";
import { useTheme } from "../Store/theme";
import OpeningHours from "../OpeningHours.jsx";
import CategoryFilter from "../CategoryFilter.jsx";
import MealsGrid from "../MealsGrid.jsx";
import { useToast } from "../Store/ToastContext.jsx";

export default function Meals() {
  const [currentPage, setCurrentPage] = useState(1);
  const [addingId, setAddingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const mealsPerPage = 8;
  const { showToast } = useToast();

  const { addItem } = useContext(CartContext);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const { data: meals = [], isLoading } = useMeals();

  const categories = useMemo(
    () => ["All", ...new Set(meals.map((meal) => meal.category))],
    [meals]
  );

  const filteredMeals = meals.filter(
    (meal) => selectedCategory === "All" || meal.category === selectedCategory
  );

  const totalPages = Math.ceil(filteredMeals.length / mealsPerPage);
  const currentMeals = filteredMeals.slice(
    (currentPage - 1) * mealsPerPage,
    currentPage * mealsPerPage
  );

  const handleAddToCart = async (meal) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/signup");

    setAddingId(meal.id);

    try {
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

      // Show success toast
      showToast(`${meal.name} added to cart!`, "success");
    } catch (err) {
      console.error(err);
      // Show error toast
      showToast(`Failed to add ${meal.name} to cart.`, "error");
    } finally {
      setAddingId(null);
    }
  };
  return (
    <Box sx={{ py: 2, px: { xs: 2, md: 1 } }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        align="center"
        gutterBottom
        color="primary"
        mt={10}
      >
        Explore Our Menu
      </Typography>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        setCurrentPage={setCurrentPage}
      />

      <MealsGrid
        meals={currentMeals}
        isLoading={isLoading}
        addingId={addingId}
        handleAddToCart={handleAddToCart}
        mealsPerPage={mealsPerPage}
      />

      {totalPages > 1 && (
        <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            variant="outlined"
            shape="rounded"
            color="primary"
          />
        </Box>
      )}

      <Box sx={{ mt: 6 }}>
        <OpeningHours />
      </Box>
    </Box>
  );
}
