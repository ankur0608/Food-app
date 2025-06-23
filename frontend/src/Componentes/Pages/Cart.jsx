import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../Store/CartContext";
import { useTheme } from "../Store/theme";
import styles from "./Cart.module.css";

export default function Cart() {
  const { theme } = useTheme();
  const { items, addItem, removeItem, clearCart, checkoutData } =
    useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/signup");
    }
  }, [navigate]);

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleContinueShopping = () => navigate("/meals");
  const handleCheckout = () =>
    navigate("/checkout", { state: { total: totalAmount.toFixed(2) } });

  return (
    <div className={`${styles.cartContainer} ${styles[theme]}`}>
      <h2 className={styles.title}>Your Cart</h2>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {/*  Cart Table */}
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
                    <td data-label="Item">{name}</td>
                    <td data-label="Price">${price}</td>
                    <td data-label="Qty">{quantity}</td>
                    <td data-label="Total">${(price * quantity).toFixed(2)}</td>
                    <td data-label="Actions">
                      <button
                        aria-label={`Remove one ${name}`}
                        className={styles.button}
                        onClick={() => removeItem(id)}
                      >
                        -
                      </button>
                      <button
                        aria-label={`Add one ${name}`}
                        className={styles.button}
                        onClick={() =>
                          addItem({ id, name, price, quantity: 1 })
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

          {/*  Total */}
          <h3 className={styles.total}>Total: ${totalAmount.toFixed(2)}</h3>

          {/* Last Checkout Data */}
          {checkoutData && (
            <div className={styles.checkoutInfo}>
              <h4>Last Checkout Info:</h4>
              {["name", "email", "address"].map((field) => (
                <p key={field}>
                  <strong>
                    {field.charAt(0).toUpperCase() + field.slice(1)}:
                  </strong>{" "}
                  {checkoutData[field]}
                </p>
              ))}
              <p>
                <strong>Total:</strong> $
                {parseFloat(checkoutData.total).toFixed(2)}
              </p>
            </div>
          )}

          {/*  Action Buttons */}
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
