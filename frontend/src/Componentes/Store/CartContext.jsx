import React, { createContext, useReducer, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const CartContext = createContext({
  items: [],
  addItem: (item, userId) => {},
  removeItem: (id, userId, quantity) => {},
  clearCart: (userId) => {},
  loadCartFromSupabase: (userId) => {},
});

function CartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM":
      const existingAddIndex = state.items.findIndex(
        (item) => item.id === action.item.id
      );
      const updatedAddItems = [...state.items];

      if (existingAddIndex !== -1) {
        updatedAddItems[existingAddIndex] = {
          ...updatedAddItems[existingAddIndex],
          quantity:
            updatedAddItems[existingAddIndex].quantity + action.item.quantity,
        };
      } else {
        updatedAddItems.push({ ...action.item });
      }

      return { items: updatedAddItems };

    case "REMOVE_ITEM":
      const existingRemoveIndex = state.items.findIndex(
        (item) => item.id === action.id
      );

      if (existingRemoveIndex === -1) return state;

      const updatedRemoveItems = [...state.items];
      const itemToRemove = updatedRemoveItems[existingRemoveIndex];

      if (itemToRemove.quantity <= action.quantity) {
        updatedRemoveItems.splice(existingRemoveIndex, 1);
      } else {
        updatedRemoveItems[existingRemoveIndex] = {
          ...itemToRemove,
          quantity: itemToRemove.quantity - action.quantity,
        };
      }

      return { items: updatedRemoveItems };

    case "CLEAR_CART":
      return { items: [] };

    case "SET_CART":
      return { items: action.items };

    default:
      return state;
  }
}

function CartContextProvider({ children }) {
  const initialCart = JSON.parse(localStorage.getItem("cartItems")) || {
    items: [],
  };
  const [cartState, dispatch] = useReducer(CartReducer, initialCart);

  // Sync localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartState));
  }, [cartState]);

  // Supabase functions
  const addItem = async (item, userId) => {
    dispatch({ type: "ADD_ITEM", item });

    if (userId) {
      const { data, error } = await supabase
        .from("cart")
        .upsert({
          user_id: userId,
          meal_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })
        .eq("meal_id", item.id);

      if (error) console.error("Supabase addItem error:", error);
    }
  };

  const removeItem = async (id, userId, quantity = 1) => {
    dispatch({ type: "REMOVE_ITEM", id, quantity });

    if (userId) {
      const { data, error } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", userId)
        .eq("meal_id", id);

      if (error) {
        console.error("Supabase removeItem error:", error);
        return;
      }

      if (data.length > 0) {
        const item = data[0];
        if (item.quantity <= quantity) {
          await supabase
            .from("cart")
            .delete()
            .eq("user_id", userId)
            .eq("meal_id", id);
        } else {
          await supabase
            .from("cart")
            .update({ quantity: item.quantity - quantity })
            .eq("user_id", userId)
            .eq("meal_id", id);
        }
      }
    }
  };

  const clearCart = async (userId) => {
    dispatch({ type: "CLEAR_CART" });

    if (userId) {
      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("user_id", userId);
      if (error) console.error("Supabase clearCart error:", error);
    }
  };

  const loadCartFromSupabase = async (userId) => {
    const { data, error } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", userId);
    if (error) {
      console.error("Supabase loadCartFromSupabase error:", error);
      return;
    }
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

  const contextValue = {
    items: cartState.items,
    addItem,
    removeItem,
    clearCart,
    loadCartFromSupabase,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

export { CartContext, CartContextProvider };
