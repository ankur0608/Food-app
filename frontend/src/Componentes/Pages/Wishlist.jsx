// import { useEffect, useState } from "react";
// import { supabase } from "../../../supabaseClient.js";
// import WishlistButton from "../../hooks/useUserWishlist.jsx";
// import { Box, Typography, CircularProgress, Grid, Paper } from "@mui/material";

// export default function WishlistPage({ userId }) {
//   const [wishlistItems, setWishlistItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchWishlist = async () => {
//       if (!userId) return;
//       setLoading(true);

//       try {
//         // Fetch all wishlist entries for this user
//         const { data: wishlistData, error: wishlistError } = await supabase
//           .from("wishlists")
//           .select("*")
//           .eq("user_id", userId);

//         if (wishlistError) {
//           console.error("Error fetching wishlist:", wishlistError);
//           setWishlistItems([]);
//         } else if (wishlistData?.length) {
//           // Optional: Fetch actual food details if you have a 'foods' table
//           const foodIds = wishlistData.map((item) => item.food_id);
//           const { data: foodsData, error: foodsError } = await supabase
//             .from("foods")
//             .select("*")
//             .in("id", foodIds);

//           if (foodsError) {
//             console.error("Error fetching food data:", foodsError);
//             setWishlistItems(wishlistData); // fallback to just wishlist ids
//           } else {
//             // Map wishlist to actual food data
//             const mapped = wishlistData.map((wish) => ({
//               ...wish,
//               food: foodsData.find((f) => f.id === wish.food_id) || null,
//             }));
//             setWishlistItems(mapped);
//           }
//         } else {
//           setWishlistItems([]);
//         }
//       } catch (err) {
//         console.error("Unexpected error fetching wishlist:", err);
//         setWishlistItems([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWishlist();
//   }, [userId]);

//   // if (loading)
//   //   return (
//   //     <Box display="flex" justifyContent="center" mt={5}>
//   //       <CircularProgress />
//   //     </Box>
//   //   );

//   if (!wishlistItems.length)
//     return (
//       <Typography variant="h6" align="center" mt={5}>
//         Your wishlist is empty.
//       </Typography>
//     );

//   return (
//     <Box p={2}>
//       <Typography variant="h4" mb={3}>
//         Your Wishlist
//       </Typography>
//       <Grid container spacing={2}>
//         {wishlistItems.map((item) => (
//           <Grid item xs={12} sm={6} md={4} key={item.id}>
//             <Paper elevation={3} style={{ padding: "16px" }}>
//               <Typography variant="h6">
//                 {item.food?.name || item.food_id}
//               </Typography>
//               <Typography variant="body2" color="textSecondary">
//                 {item.food?.description || "No description"}
//               </Typography>
//               <Box mt={1}>
//                 <WishlistButton userId={userId} foodId={item.food_id} />
//               </Box>
//             </Paper>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// }
