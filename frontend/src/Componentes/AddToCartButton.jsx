// src/Componentes/Pages/AddToCartButton.jsx
import React, { useState, useContext } from "react";
import { CartContext } from "../Store/CartContext";
import { Button } from "@mui/material";

export default function AddToCartButton({ meal }) {
  const { addItem } = useContext(CartContext);
  const [addingId, setAddingId] = useState(null);

  const handleAddToCart = async (meal) => {
    setAddingId(meal.id);

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login first");
      setAddingId(null);
      return;
    }

    await addItem(
      { id: meal.id, name: meal.name, price: meal.price, quantity: 1 },
      user.id
    );

    setAddingId(null);
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => handleAddToCart(meal)}
      disabled={addingId === meal.id}
    >
      {addingId === meal.id ? "Adding..." : "Add To Cart"}
    </Button>
  );
}
