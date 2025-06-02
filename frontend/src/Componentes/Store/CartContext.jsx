import React, { createContext, useReducer, useEffect } from "react";

const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {},
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
          quantity: updatedAddItems[existingAddIndex].quantity + 1,
        };
      } else {
        updatedAddItems.push({ ...action.item, quantity: 1 });
      }

      return { items: updatedAddItems };

    case "REMOVE_ITEM":
      const existingRemoveIndex = state.items.findIndex(
        (item) => item.id === action.id
      );

      if (existingRemoveIndex === -1) return state;

      const updatedRemoveItems = [...state.items];
      const itemToRemove = updatedRemoveItems[existingRemoveIndex];

      if (itemToRemove.quantity === 1) {
        updatedRemoveItems.splice(existingRemoveIndex, 1);
      } else {
        updatedRemoveItems[existingRemoveIndex] = {
          ...itemToRemove,
          quantity: itemToRemove.quantity - 1,
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

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartState));
  }, [cartState]);

  const addItem = (item) => dispatch({ type: "ADD_ITEM", item });
  const removeItem = (id) => dispatch({ type: "REMOVE_ITEM", id });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const contextValue = {
    items: cartState.items,
    addItem,
    removeItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

export { CartContext, CartContextProvider };
