import { useState, useContext, useMemo } from "react";
import { Box, Typography, Pagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../Store/CartContext.jsx";
import { useMeals } from "../../hooks/useMeals";
import { useTheme } from "../Store/theme";
import OpeningHours from "../OpeningHours.jsx";
import FiltersPopup from "../FiltersPanel.jsx"; // Modern filter dialog
import MealsGrid from "../MealsGrid.jsx";
import { useToast } from "../Store/ToastContext.jsx";

export default function Meals() {
  const [currentPage, setCurrentPage] = useState(1);
  const [addingId, setAddingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [rating, setRating] = useState(0);
  const [vegOnly, setVegOnly] = useState(false);
  const [offersOnly, setOffersOnly] = useState(false);

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

  // Apply all filters
  const filteredMeals = meals.filter((meal) => {
    const categoryCheck =
      selectedCategory === "All" || meal.category === selectedCategory;
    const priceCheck =
      meal.price >= priceRange[0] && meal.price <= priceRange[1];
    const ratingCheck = (meal.rating || 0) >= rating;
    const vegCheck = vegOnly ? meal.veg === true : true;
    const offersCheck = offersOnly ? meal.offer === true : true;

    return (
      categoryCheck && priceCheck && ratingCheck && vegCheck && offersCheck
    );
  });

  const totalPages = Math.ceil(filteredMeals.length / mealsPerPage);
  const currentMeals = filteredMeals.slice(
    (currentPage - 1) * mealsPerPage,
    currentPage * mealsPerPage
  );

  const handleAddToCart = async (meal) => {
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
      showToast(`${meal.name} added to cart!`, "success");
    } catch (err) {
      console.error(err);
      showToast(`Failed to add ${meal.name} to cart.`, "error");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <Box>
      <Typography
        variant="h4"
        fontWeight="bold"
        align="center"
        gutterBottom
        color="primary"
        mt={11}
        mb={2}
      >
        Explore Our Menu
      </Typography>

      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          mb: 4,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FiltersPopup
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          rating={rating}
          setRating={setRating}
          vegOnly={vegOnly}
          setVegOnly={setVegOnly}
          setCurrentPage={setCurrentPage}
        />
      </Box>

      {/* Meals Grid */}
      <MealsGrid
        meals={currentMeals}
        isLoading={isLoading}
        addingId={addingId}
        handleAddToCart={handleAddToCart}
        mealsPerPage={mealsPerPage}
      />

      {/* Pagination */}
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

      {/* Opening Hours */}
      <Box sx={{ mt: 6 }}>
        <OpeningHours />
      </Box>
    </Box>
  );
}
