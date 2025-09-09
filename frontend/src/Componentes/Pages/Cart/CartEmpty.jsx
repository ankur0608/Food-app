import React from "react";
import { Paper, Typography, Button, Box } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import styles from "./Cart.module.css";

export default function CartEmpty({ navigate }) {
  return (
    <Paper
      className={styles.emptyCart}
      elevation={3}
      sx={{
        p: 4,
        mb: 20,
        textAlign: "center",
        borderRadius: 3,
        background: "linear-gradient(135deg, #f9fafc, #ffffff)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <Box sx={{ fontSize: "3rem", mb: 5 }}>🛒</Box>
      <Typography variant="h5" fontWeight="600" gutterBottom>
        Your cart is empty
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Looks like you haven’t added anything yet. Explore delicious meals and
        start your order!
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={() => navigate("/meals")}
        startIcon={<ShoppingCart />}
        sx={{
          borderRadius: "50px",
          px: 4,
          py: 1.2,
          fontWeight: 600,
          background: "linear-gradient(90deg, #ff6f61, #ff8e53)",
          "&:hover": {
            background: "linear-gradient(90deg, #ff4c4c, #ff7043)",
          },
        }}
      >
        Browse Foods
      </Button>
    </Paper>
  );
}
