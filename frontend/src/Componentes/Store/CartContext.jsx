"use client";

import React, { createContext, useReducer, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CartContext = createContext();

function CartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const idx = state.findIndex((item) => item.id === action.item.id);
      if (idx !== -1) {
        const updated = [...state];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + action.item.quantity,
        };
        return updated;
      }
      return [...state, action.item];
    }

    case "REMOVE_ITEM": {
      const idx = state.findIndex((item) => item.id === action.item.id);
      if (idx === -1) return state;

      const updated = [...state];
      const current = updated[idx];

      if (current.quantity <= action.item.quantity) {
        updated.splice(idx, 1);
      } else {
        updated[idx] = {
          ...current,
          quantity: current.quantity - action.item.quantity,
        };
      }
      return updated;
    }

    case "CLEAR_CART":
      return [];

    case "SET_CART":
      return action.items;

    default:
      return state;
  }
}

function CartContextProvider({ children }) {
  let storedCart;
  try {
    const parsed = JSON.parse(localStorage.getItem("cartItems"));
    storedCart = Array.isArray(parsed) ? parsed : [];
  } catch {
    storedCart = [];
  }

  const [cartState, dispatch] = useReducer(CartReducer, storedCart);

  const [checkoutData, setCheckoutData] = useState(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem("checkoutData"));
      return parsed || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartState));
  }, [cartState]);

  useEffect(() => {
    if (checkoutData) {
      localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    }
  }, [checkoutData]);

  // Add Item (+)
  const addItem = async (item, userId) => {
    try {
      const { data: existing } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", userId)
        .eq("meal_id", item.id)
        .single();

      if (existing) {
        const newQty = existing.quantity + item.quantity;
        await supabase
          .from("cart")
          .update({ quantity: newQty })
          .eq("user_id", userId)
          .eq("meal_id", item.id);

        dispatch({
          type: "ADD_ITEM",
          item: { ...item, quantity: item.quantity }, // keep it consistent
        });
      } else {
        await supabase.from("cart").insert({
          user_id: userId,
          meal_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        });

        dispatch({ type: "ADD_ITEM", item });
      }
    } catch (error) {
      console.error("Error adding item:", error.message);
    }
  };

  // Remove Item (-)
  const removeItem = async (id, userId, qty = 1) => {
    try {
      const { data: existing } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", userId)
        .eq("meal_id", id)
        .single();

      if (!existing) return;

      if (existing.quantity > qty) {
        const newQty = existing.quantity - qty;
        await supabase
          .from("cart")
          .update({ quantity: newQty })
          .eq("user_id", userId)
          .eq("meal_id", id);

        dispatch({
          type: "REMOVE_ITEM",
          item: { id, quantity: qty },
        });
      } else {
        await supabase
          .from("cart")
          .delete()
          .eq("user_id", userId)
          .eq("meal_id", id);

        dispatch({
          type: "REMOVE_ITEM",
          item: { id, quantity: existing.quantity },
        });
      }
    } catch (error) {
      console.error("Error removing item:", error.message);
    }
  };

  const clearCart = async (userId) => {
    dispatch({ type: "CLEAR_CART" });
    if (userId) {
      await supabase.from("cart").delete().eq("user_id", userId);
    }
  };

  const loadCartFromSupabase = async (userId) => {
    const { data } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", userId);

    if (data) {
      const items = data.map((item) => ({
        id: item.meal_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));
      dispatch({ type: "SET_CART", items });
    }
  };

  return (
    <CartContext.Provider
      value={{
        items: cartState,
        addItem,
        removeItem,
        clearCart,
        loadCartFromSupabase,
        checkoutData,
        setCheckoutData,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export { CartContext, CartContextProvider };
