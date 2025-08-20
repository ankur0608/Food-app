import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../Store/CartContext";
import styles from "./Cart.module.css";

export default function Cart() {
  const {
    items = [],
    addItem,
    removeItem,
    clearCart,
    loadCartFromSupabase,
    checkoutData,
  } = useContext(CartContext);

  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/signup");
      return;
    }
    setUser(storedUser);
    loadCartFromSupabase(storedUser.id);
  }, [navigate, loadCartFromSupabase]);

  if (!user) return null;

  const totalAmount = (items || []).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className={styles.cartContainer}>
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
                {items.map(({ id, name, price, quantity }) => (
                  <tr key={id}>
                    <td>{name}</td>
                    <td>₹{price}</td>
                    <td>{quantity}</td>
                    <td>₹{(price * quantity).toFixed(2)}</td>
                    <td>
                      <button onClick={() => removeItem(id, user.id, 1)}>
                        -
                      </button>
                      <button
                        onClick={() =>
                          addItem({ id, name, price, quantity: 1 }, user.id)
                        }
                      >
                        +
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className={styles.total}>Total: ₹{totalAmount.toFixed(2)}</h3>

          {checkoutData && (
            <div className={styles.checkoutInfo}>
              <h4>Last Checkout Info:</h4>
              {["name", "email", "address"].map((field) => (
                <p key={field}>
                  <strong>{field}:</strong> {checkoutData[field]}
                </p>
              ))}
              <p>
                <strong>Total:</strong> ₹
                {parseFloat(checkoutData.total).toFixed(2)}
              </p>
            </div>
          )}

          <div className={styles.cartActions}>
            <button onClick={() => navigate("/meals")}>
              Continue Shopping
            </button>
            <button
              onClick={() =>
                navigate("/checkout", {
                  state: { total: totalAmount.toFixed(2) },
                })
              }
            >
              Checkout
            </button>
          </div>

          <button
            className={styles.clearBtn}
            onClick={() => clearCart(user.id)}
          >
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
}
