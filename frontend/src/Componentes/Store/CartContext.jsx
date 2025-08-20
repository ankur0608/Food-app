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

  // Load cart from Supabase
  useEffect(() => {
    if (!userId) return;

    const loadCart = async () => {
      const { data, error } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", userId);

      if (!error && data) {
        const formatted = data.map((row) => ({
          id: row.meal_id,
          name: row.name,
          price: row.price,
          quantity: row.quantity,
        }));
        dispatch({ type: "SET_ITEMS", payload: formatted });
      }
    };

    loadCart();
  }, [userId]);

  const addItem = async (newItem, userId) => {
    dispatch({ type: "ADD_ITEM", payload: newItem });

    if (userId) {
      await supabase.from("cart").upsert(
        {
          user_id: userId,
          meal_id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          quantity: newItem.quantity,
        },
        { onConflict: ["user_id", "meal_id"] }
      );
    }
  };

  const removeItem = async (mealId, qty = 1, userId) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id: mealId, quantity: qty } });

    if (userId) {
      const { data } = await supabase
        .from("cart")
        .select("quantity")
        .eq("user_id", userId)
        .eq("meal_id", mealId)
        .single();

      if (data && data.quantity > qty) {
        await supabase
          .from("cart")
          .update({ quantity: data.quantity - qty })
          .eq("user_id", userId)
          .eq("meal_id", mealId);
      } else {
        await supabase
          .from("cart")
          .delete()
          .eq("user_id", userId)
          .eq("meal_id", mealId);
      }
    }
  };

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
