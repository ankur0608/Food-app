import { useEffect, useState, useContext } from "react";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { CartContext } from "../Store/CartContext.jsx";
import { supabase } from "../../../supabaseClient.js";

export default function WishlistButton({ userId, foodId }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch wishlist status for this food & user
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("wishlists")
          .select("*")
          .eq("user_id", userId)
          .eq("food_id", foodId)
          .maybeSingle(); // ✅ prevents 406 if no row exists

        if (error) {
          console.error("Wishlist fetch error:", error);
          setIsWishlisted(false); // default to false on error
        } else {
          setIsWishlisted(!!data); // true if data exists
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setIsWishlisted(false);
      } finally {
        setLoading(false);
      }
    };

    if (userId && foodId) fetchWishlist();
  }, [userId, foodId]);

  const toggleWishlist = async () => {
    try {
      if (!userId) return;

      if (isWishlisted) {
        // Remove from wishlist
        const { error } = await supabase
          .from("wishlists")
          .delete()
          .eq("user_id", userId)
          .eq("food_id", foodId);

        if (error) throw error;
        setIsWishlisted(false);
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from("wishlists")
          .insert([{ user_id: userId, food_id: foodId }]);

        if (error) throw error;
        setIsWishlisted(true);
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
    }
  };

  if (loading) return <span>Loading...</span>;

  return (
    <span onClick={toggleWishlist} style={{ cursor: "pointer" }}>
      {isWishlisted ? <Favorite color="error" /> : <FavoriteBorder />}
    </span>
  );
}
