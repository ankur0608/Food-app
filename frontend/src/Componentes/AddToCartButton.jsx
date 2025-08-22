// src/Componentes/Pages/AddToCartButton.jsx
import React, { useState, useContext } from "react";
import { CartContext } from "../Componentes/Store/CartContext";
import { Button } from "@mui/material";

export default function AddToCartButton({ food }) {
  const { addItem } = useContext(CartContext);
  const [addingId, setAddingId] = useState(null);

  const handleAddToCart = async (food) => {
    setAddingId(food.id);

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login first");
      setAddingId(null);
      return;
    }

    // ✅ Only store food_id and user_id in cart
    await addItem({ food_id: food.id, quantity: 1 }, user.id);

    setAddingId(null);
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => handleAddToCart(food)}
      disabled={addingId === food.id}
    >
      {addingId === food.id ? "Adding..." : "Add To Cart"}
    </Button>
  );
}
