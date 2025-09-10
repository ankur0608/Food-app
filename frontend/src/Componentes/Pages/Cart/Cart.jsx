import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, Box } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { CartContext } from "../../Store/CartContext";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CartEmpty from "./CartEmpty";
import CartItemsTable from "./CartItemsTable";
import CartItemsMobile from "./CartItemsMobile";
import CartSummary from "./CartSummary";
import CartActions from "./CartActions";
import styles from "./Cart.module.css";

export default function Cart() {
  const { items, addItem, removeItem, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const deliveryCharges = 50;

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const finalAmount = (totalAmount - discount + deliveryCharges).toFixed(2);

  return (
    <div>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ textAlign: "center", color: "primary.main", pt: 12 }}
      >
        <ShoppingCart sx={{ fontSize: 32, mr: 1 }} />
        Shopping Cart
      </Typography>

      <Box
        sx={{ width: "100%", px: isMobile ? 1 : 3, py: 2 }}
        className={styles.cartContainer}
      >
        {items.length === 0 ? (
          <CartEmpty navigate={navigate} />
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              {!isMobile ? (
                <CartItemsTable
                  items={items}
                  addItem={addItem}
                  removeItem={removeItem}
                  user={user}
                />
              ) : (
                <CartItemsMobile
                  items={items}
                  addItem={addItem}
                  removeItem={removeItem}
                  user={user}
                />
              )}
              <CartActions
                navigate={navigate}
                clearCart={clearCart}
                user={user}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CartSummary
                items={items}
                totalAmount={totalAmount}
                discount={discount}
                setDiscount={setDiscount}
                coupon={coupon}
                setCoupon={setCoupon}
                deliveryCharges={deliveryCharges}
                finalAmount={finalAmount}
                navigate={navigate}
                userId={user?.id} // ✅ Pass current user id
              />
            </Grid>
          </Grid>
        )}
      </Box>
    </div>
  );
}
