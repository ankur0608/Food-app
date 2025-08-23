import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function useUserWishlist(userId) {
  const [wishlist, setWishlist] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("wishlists")
          .select("food_id")
          .eq("user_id", userId);

        if (error) throw error;

        // Convert array to map for faster lookup
        const wishlistMap = {};
        data.forEach((item) => {
          wishlistMap[item.food_id] = true;
        });
        setWishlist(wishlistMap);
      } catch (err) {
        console.error("Failed to load wishlist:", err);
        setWishlist({});
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userId]);

  // Returns boolean whether a food is wishlisted
  const isWishlisted = (foodId) => !!wishlist[foodId];

  // Toggle wishlist status
  const toggleWishlist = async (foodId) => {
    if (!userId) return;

    try {
      if (!wishlist[foodId]) {
        const { error } = await supabase
          .from("wishlists")
          .insert([{ user_id: userId, food_id: foodId }]);
        if (error) throw error;
        setWishlist((prev) => ({ ...prev, [foodId]: true }));
      } else {
        const { error } = await supabase
          .from("wishlists")
          .delete()
          .eq("user_id", userId)
          .eq("food_id", foodId);
        if (error) throw error;
        setWishlist((prev) => {
          const copy = { ...prev };
          delete copy[foodId];
          return copy;
        });
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
    }
  };

  return { wishlist, loading, isWishlisted, toggleWishlist };
}
