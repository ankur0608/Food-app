import React, { useContext, useEffect } from "react";
import { CartContext } from "../Store/CartContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../Store/theme";
import styles from "./Cart.module.css"; // Import CSS Module

export default function Cart() {
  const { theme } = useTheme();
  const { items, addItem, removeItem, clearCart, checkoutData } =
    useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signup");
    }
  }, [navigate]);

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function handleContinueShopping() {
    navigate("/Meals");
  }

  function handleCheckout() {
    navigate("/checkout", {
      state: { total: totalAmount.toFixed(2) },
    });
  }

  return (
    <div className={`${styles.cartContainer} ${styles[theme]}`}>
      <h2 className={styles.title}>Your Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className={styles.cartTableWrapper}>
            <table className={styles.cartTable}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td data-label="Item">{item.name}</td>
                    <td data-label="Price">${item.price}</td>
                    <td data-label="Qty">{item.quantity}</td>
                    <td data-label="Total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td data-label="Actions">
                      <button
                        aria-label={`Add one ${item.name}`}
                        className={styles.button}
                        onClick={() => addItem({ ...item, quantity: 1 })}
                      >
                        +
                      </button>
                      <button
                        aria-label={`Remove one ${item.name}`}
                        className={styles.button}
                        onClick={() => removeItem(item.id)}
                      >
                        -
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className={styles.total}>Total: ${totalAmount.toFixed(2)}</h3>

          {checkoutData && (
            <div className={styles.checkoutInfo}>
              <h4>Last Checkout Info:</h4>
              <p>
                <strong>Name:</strong> {checkoutData.name}
              </p>
              <p>
                <strong>Email:</strong> {checkoutData.email}
              </p>
              <p>
                <strong>Address:</strong> {checkoutData.address}
              </p>
              <p>
                <strong>Total:</strong> $
                {parseFloat(checkoutData.total).toFixed(2)}
              </p>
            </div>
          )}

          <div className={styles.cartActions}>
            <button
              className={styles.continueBtn}
              onClick={handleContinueShopping}
            >
              Continue Shopping
            </button>
            <button className={styles.checkoutBtn} onClick={handleCheckout}>
              Checkout
            </button>
          </div>

          <button className={styles.clearBtn} onClick={clearCart}>
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
}
