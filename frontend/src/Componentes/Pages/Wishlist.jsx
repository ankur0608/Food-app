import { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  Skeleton,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { CartContext } from "../Store/CartContext.jsx";
import { useToast } from "../Store/ToastContext.jsx";
import { supabase } from "../../../supabaseClient.js";

export default function Wishlist() {
  const { addItem } = useContext(CartContext);
  const { showToast } = useToast();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return setLoading(false);

      try {
        const { data, error } = await supabase
          .from("wishlists")
          .select("food_id, foods(*)")
          .eq("user_id", user.id);

        if (error) throw error;

        const items = data.map((w) => w.foods);
        setWishlist(items);
      } catch (err) {
        console.error("Failed to fetch wishlist:", err.message);
        showToast("Failed to load wishlist", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (item) => {
    if (!user) {
      showToast("Please login first", "error");
      return;
    }

    const exists = wishlist.find((w) => w.id === item.id);

    try {
      if (!exists) {
        const { error } = await supabase
          .from("wishlists")
          .insert([{ user_id: user.id, food_id: item.id }]);
        if (error) throw error;
        setWishlist([...wishlist, item]);
        showToast("Added to wishlist", "success");
      } else {
        const { error } = await supabase
          .from("wishlists")
          .delete()
          .eq("user_id", user.id)
          .eq("food_id", item.id);
        if (error) throw error;
        setWishlist(wishlist.filter((w) => w.id !== item.id));
        showToast("Removed from wishlist", "info");
      }
    } catch (err) {
      console.error("Wishlist error:", err.message);
      showToast("Failed to update wishlist", "error");
    }
  };

  const handleAddToCart = async (item) => {
    if (!user) {
      showToast("Please login to add items to cart", "error");
      return;
    }
    try {
      await addItem({ ...item, quantity: 1 }, user.id);
      showToast(`${item.name} added to cart!`, "success");
    } catch (err) {
      console.error(err);
      showToast(`Failed to add ${item.name} to cart`, "error");
    }
  };

  if (loading)
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Grid container spacing={3}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={3} mt={10} key={i}>
              <Skeleton
                variant="rectangular"
                height={200}
                width={300}
                sx={{ borderRadius: 2 }}
              />
              <Skeleton width="60%" sx={{ mt: 1 }} />
              <Skeleton width="40%" />
              <Skeleton
                variant="rectangular"
                height={36}
                sx={{ mt: 1, borderRadius: 1 }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );

  if (wishlist.length === 0)
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h5">Your wishlist is empty 😔</Typography>
      </Box>
    );

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight="bold" mb={3} color="primary">
        Your Wishlist
      </Typography>

      <Grid container spacing={2}>
        {wishlist.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.id}>
            <Box
              sx={{
                borderRadius: 2,
                p: 2,
                position: "relative",
                boxShadow: 3, // subtle shadow instead of border
                backgroundColor: "background.paper",
              }}
            >
              <IconButton
                sx={{ position: "absolute", top: 8, right: 8 }}
                onClick={() => toggleWishlist(item)}
              >
                {wishlist.find((w) => w.id === item.id) ? (
                  <Favorite color="error" />
                ) : (
                  <FavoriteBorder />
                )}
              </IconButton>

              <Box
                component="img"
                src={item.image}
                alt={item.name}
                sx={{
                  width: "100%",
                  height: 150,
                  objectFit: "cover",
                  borderRadius: 1,
                  mb: 1,
                }}
              />

              <Typography variant="h6">{item.name}</Typography>
              <Typography variant="body1" color="text.secondary">
                ${item.price.toFixed(2)}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 1 }}
                onClick={() => handleAddToCart(item)}
              >
                Add to Cart
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
