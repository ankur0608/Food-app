import React from "react";
import { Button } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import styles from "./Cart.module.css";

export default function CartActions({ navigate, clearCart, user }) {
  return (
    <div className={styles.btn}>
      <Button
        variant="outlined"
        sx={{ mt: 2, borderRadius: 2 }}
        onClick={() => navigate("/meals")}
        startIcon={<ShoppingCart />}
      >
        Continue Shopping
      </Button>
      <Button
        variant="contained"
        color="error"
        sx={{ mt: 2, borderRadius: 2 }}
        onClick={() => clearCart(user.id)}
      >
        Clear Cart
      </Button>
    </div>
  );
}
