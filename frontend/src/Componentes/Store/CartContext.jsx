// src/Componentes/Store/CartContext.jsx
import React, { createContext, useReducer, useEffect } from "react";
import { supabase } from "../../../supabaseClient";

export const CartContext = createContext();

const initialState = {
  items: [],
  checkoutData: null,
};

function cartReducer(state, action) {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, items: action.payload };

    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (existingIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity:
            updatedItems[existingIndex].quantity + action.payload.quantity,
        };
        return { ...state, items: updatedItems };
      } else {
        return { ...state, items: [...state.items, action.payload] };
      }
    }

    case "REMOVE_ITEM": {
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (existingIndex >= 0) {
        const updatedItems = [...state.items];
        const item = updatedItems[existingIndex];
        if (item.quantity > action.payload.quantity) {
          updatedItems[existingIndex] = {
            ...item,
            quantity: item.quantity - action.payload.quantity,
          };
        } else {
          updatedItems.splice(existingIndex, 1);
        }
        return { ...state, items: updatedItems };
      }
      return state;
    }

    case "CLEAR_CART":
      return { ...state, items: [] };

    default:
      return state;
  }
}

export function CartContextProvider({ children, userId }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // 🔥 Load cart from Supabase with JOIN foods
  useEffect(() => {
    if (!userId) return;

    const loadCart = async () => {
      const { data, error } = await supabase
        .from("cart")
        .select(
          `
          food_id,
          quantity,
          foods (
            id,
            name,
            price,
            image
          )
        `
        )
        .eq("user_id", userId);

      if (error) {
        console.error("Error loading cart:", error.message);
        return;
      }

      if (data) {
        const formatted = data.map((row) => ({
          id: row.food_id,
          name: row.foods?.name,
          price: row.foods?.price,
          quantity: row.quantity,
          image: row.foods?.image || null, // ✅ map to image
        }));
        dispatch({ type: "SET_ITEMS", payload: formatted });
      }
    };

    loadCart();
  }, [userId]);

  // Add item
  const addItem = async (newItem, userId) => {
    dispatch({ type: "ADD_ITEM", payload: newItem });

    if (userId) {
      await supabase.from("cart").upsert(
        {
          user_id: userId,
          food_id: newItem.id,
          quantity: newItem.quantity,
        },
        { onConflict: ["user_id", "food_id"] }
      );
    }
  };

  // Remove item
  const removeItem = async (foodId, qty = 1, userId) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id: foodId, quantity: qty } });

    if (userId) {
      const { data } = await supabase
        .from("cart")
        .select("quantity")
        .eq("user_id", userId)
        .eq("food_id", foodId)
        .single();

      if (data && data.quantity > qty) {
        await supabase
          .from("cart")
          .update({ quantity: data.quantity - qty })
          .eq("user_id", userId)
          .eq("food_id", foodId);
      } else {
        await supabase
          .from("cart")
          .delete()
          .eq("user_id", userId)
          .eq("food_id", foodId);
      }
    }
  };

  // Clear cart
  const clearCart = async (userId) => {
    dispatch({ type: "CLEAR_CART" });
    if (userId) {
      await supabase.from("cart").delete().eq("user_id", userId);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        clearCart,
        checkoutData: state.checkoutData,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
