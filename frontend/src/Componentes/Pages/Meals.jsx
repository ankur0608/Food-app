// src/Componentes/Pages/Meals.jsx
import { useState, useContext, useMemo } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Skeleton,
  Pagination,
  Link,
  TextField,
  InputAdornment,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import { CartContext } from "../Store/CartContext.jsx";
import { useTheme } from "../Store/theme";
import OpeningHours from "../OpeningHours.jsx";
import OverallRating from "../RatingOverall.jsx";

export default function Meals() {
  const [currentPage, setCurrentPage] = useState(1);
  const [addingId, setAddingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const mealsPerPage = 8;

  const { addItem } = useContext(CartContext);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch meals
  const { data: meals = [], isLoading } = useQuery({
    queryKey: ["meals"],
    queryFn: async () => {
      const res = await axios.get("https://food-app-d8r3.onrender.com/meals");
      return res.data;
    },
  });

  // Categories
  const categories = useMemo(
    () => ["All", ...new Set(meals.map((meal) => meal.category))],
    [meals]
  );

  // Filter meals
  const filteredMeals = meals.filter((meal) => {
    const matchesCategory =
      selectedCategory === "All" || meal.category === selectedCategory;

    const matchesSearch = meal.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMeals.length / mealsPerPage);
  const currentMeals = filteredMeals.slice(
    (currentPage - 1) * mealsPerPage,
    currentPage * mealsPerPage
  );

  // Add to cart
  const handleAddToCart = async (meal) => {
    if (!user) {
      navigate("/signup");
      return;
    }

    setAddingId(meal.id);

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

    setAddingId(null);
  };

  const handleImageError = (e) => {
    e.target.src = "/assets/default-meal.jpg";
  };

  return (
    <Box sx={{ py: 2, px: { xs: 2, md: 6 } }}>
      {/* Title */}
      <Typography
        variant="h4"
        fontWeight="bold"
        align="center"
        gutterBottom
        color="primary"
        mt={3}
      >
        Explore Our Menu
      </Typography>

      {/* Category Filter */}
      {/* Category Filter */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: { xs: 1, sm: 1.5, md: 2 }, // tighter on mobile
          mb: 4,
          mt: 2,
          px: { xs: 0.5, sm: 1 },
        }}
      >
        {categories.map((cat) => (
          <Button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
            sx={{
              textTransform: "capitalize",
              borderRadius: "20px", // smaller pill for mobile
              px: { xs: 1.5, sm: 2.5, md: 3 },
              py: { xs: 0.4, sm: 0.7, md: 1 },
              fontSize: { xs: "0.7rem", sm: "0.85rem", md: "1rem" },
              fontWeight: 600,
              minWidth: "auto", // prevents large empty buttons
              color: selectedCategory === cat ? "#fff" : "primary.main",
              backgroundColor:
                selectedCategory === cat ? "primary.main" : "transparent",
              border: "1.5px solid",
              borderColor:
                selectedCategory === cat ? "primary.main" : "rgba(0,0,0,0.2)",
              "&:hover": {
                backgroundColor:
                  selectedCategory === cat
                    ? "primary.dark"
                    : "rgba(0,0,0,0.05)",
              },
              transition: "all 0.3s ease",
            }}
          >
            {cat}
          </Button>
        ))}
      </Box>

      {/* Search */}
      {/* <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <TextField
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search meals (e.g. Dinner)"
          variant="outlined"
          sx={{ width: { xs: "100%", sm: "60%", md: "40%" } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch />
              </InputAdornment>
            ),
          }}
        />
      </Box> */}

      {/* Meals Grid */}
      {/* Meals Grid */}
      <Grid
        container
        spacing={{ xs: 2, sm: 3 }} // smaller gaps on mobile, bigger on desktop
        alignItems="stretch"
      >
        {isLoading ? (
          Array.from({ length: mealsPerPage }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                sx={{
                  height: { xs: 400, sm: 430, md: 450 },
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Skeleton variant="rectangular" width="100%" height={180} />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="rounded" width="100%" height={36} />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : currentMeals.length > 0 ? (
          currentMeals.map((meal) => (
            <Grid
              item
              key={meal.id}
              xs={12} // full width on mobile
              sm={6} // 2 per row on small screens
              md={4} // 3 per row on medium
              lg={3} // 4 per row on large
              sx={{
                marginBottom: "20px",
                // On desktop force fixed 4 per row (23%)
                "@media (min-width:1200px)": {
                  flex: "0 0 23%",
                  maxWidth: "23%",
                },
              }}
            >
              <Link
                component={RouterLink}
                to={`/meals/${meal.name}`}
                underline="none"
                style={{ width: "100%" }}
              >
                <Card
                  sx={{
                    height: { xs: 470, sm: 430, md: 450 },
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Meal Image */}
                  <CardMedia
                    component="img"
                    image={meal.image}
                    alt={meal.name}
                    onError={handleImageError}
                    sx={{
                      height: 180,
                      objectFit: "cover",
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12,
                    }}
                  />

                  {/* Meal Content */}
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        {meal.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          minHeight: "3.6em",
                          maxWidth: "18rem",
                          mb: 1,
                        }}
                      >
                        {meal.description}
                      </Typography>
                      <OverallRating foodId={meal.id} />
                      <Typography
                        sx={{ mt: 1, fontWeight: "bold", color: "#1d1d1db0" }}
                      >
                        ₹{meal.price}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 2,
                        py: 1.5,
                        fontWeight: "bold",
                        borderRadius: 2,
                      }}
                      onClick={() => handleAddToCart(meal)}
                      disabled={addingId === meal.id}
                    >
                      {addingId === meal.id ? "Adding..." : "Add To Cart"}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" align="center" sx={{ width: "100%", mt: 4 }}>
            No meals found.
          </Typography>
        )}
      </Grid>

      {/* Pagination */}
      <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            variant="outlined"
            shape="rounded"
            color="primary"
          />
        )}
      </Box>

      {/* Opening Hours */}
      <Box sx={{ mt: 6 }}>
        <OpeningHours />
      </Box>
    </Box>
  );
}
