// src/Componentes/Pages/Cart.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  TextField,
  Divider,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { Add, Remove, Delete, ShoppingCart } from "@mui/icons-material";
import { CartContext } from "../Store/CartContext";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
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

  const applyCoupon = () => {
    if (coupon === "SAVE50") {
      setDiscount(50);
    } else {
      setDiscount(0);
    }
  };

  return (
    <div>
      {/* Title */}
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ textAlign: "center", color: "primary.main", mb: 0, mt: 0, pt: 12 }}
      >
        <ShoppingCart sx={{ fontSize: 32, mr: 1, verticalAlign: "middle" }} />
        Shopping Cart
      </Typography>

      <Box
        sx={{ width: "100%", px: isMobile ? 1 : 3, py: 2 }}
        className={styles.cartContainer}
      >
        {items.length === 0 ? (
          <Paper
            className={styles.emptyCart}
            elevation={3}
            sx={{
              p: 4,
              mb: 20,
              textAlign: "center",
              borderRadius: 3,
              background: "linear-gradient(135deg, #f9fafc, #ffffff)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <Box
              sx={{
                fontSize: "3rem",
                mb: 5,
              }}
            >
              🛒
            </Box>
            <Typography variant="h5" fontWeight="600" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Looks like you haven’t added anything yet. Explore delicious meals
              and start your order!
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/meals")}
              startIcon={<ShoppingCart />}
              sx={{
                borderRadius: "50px",
                px: 4,
                py: 1.2,
                fontWeight: 600,
                background: "linear-gradient(90deg, #ff6f61, #ff8e53)", // gradient button
                "&:hover": {
                  background: "linear-gradient(90deg, #ff4c4c, #ff7043)",
                },
              }}
            >
              Browse Foods
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {/* Left: Items */}
            <Grid item xs={12} md={8}>
              {/* Desktop: Table */}
              {!isMobile && (
                <TableContainer
                  component={Paper}
                  className={styles.cartTable}
                  sx={{ borderRadius: 2, boxShadow: 2 }}
                >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="center">Price</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="center">Total</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map(({ id, name, price, quantity, image }) => (
                        <TableRow key={id} hover>
                          <TableCell>
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                            >
                              <Box
                                component="img"
                                src={image}
                                alt={name}
                                sx={{
                                  width: 60,
                                  height: 60,
                                  borderRadius: 1,
                                  objectFit: "cover",
                                }}
                              />
                              <Typography>{name}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="center">₹{price}</TableCell>
                          <TableCell align="center">
                            <Stack
                              direction="row"
                              spacing={1}
                              justifyContent="center"
                              alignItems="center"
                            >
                              <IconButton
                                size="small"
                                color="error"
                                className={styles.qtyButton}
                                onClick={() => removeItem(id, 1, user.id)}
                              >
                                <Remove
                                  fontSize="small"
                                  sx={{
                                    border: "1px solid #d4d4d4ff",
                                    borderRadius: "50%", // makes it round
                                    width: 20,
                                    height: 20,
                                    padding: 0.5,
                                    bgcolor: "#f9f9f9",
                                    "&:hover": {
                                      bgcolor: "#e0e0e0",
                                    },
                                  }}
                                />
                              </IconButton>
                              <Typography>{quantity}</Typography>
                              <IconButton
                                size="small"
                                color="primary"
                                className={styles.qtyButton}
                                onClick={() =>
                                  addItem(
                                    { id, name, price, quantity: 1 },
                                    user.id
                                  )
                                }
                              >
                                <Add
                                  fontSize="small"
                                  sx={{
                                    border: "1px solid #d4d4d4ff",
                                    borderRadius: "50%", // makes it round
                                    width: 20,
                                    height: 20,
                                    padding: 0.5,
                                    bgcolor: "#f9f9f9",
                                    "&:hover": {
                                      bgcolor: "#e0e0e0",
                                    },
                                  }}
                                />
                              </IconButton>
                            </Stack>
                          </TableCell>
                          <TableCell align="center">
                            ₹{(price * quantity).toFixed(2)}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="error"
                              onClick={() => removeItem(id, quantity, user.id)}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Mobile: Card view */}
              {isMobile &&
                items.map(({ id, name, price, quantity, image }) => (
                  <div>
                    <Card
                      key={id}
                      sx={{
                        mb: 2,
                        borderRadius: 3,
                        boxShadow: 3,
                        p: 1.5,
                      }}
                    >
                      <CardContent sx={{ p: "8px !important" }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          {/* Product Image */}
                          <Box
                            component="img"
                            src={image}
                            alt={name}
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: 2,
                              objectFit: "cover",
                              boxShadow: 1,
                            }}
                          />

                          {/* Product Info */}
                          <Stack spacing={0.8} flex={1}>
                            <Typography
                              fontWeight="bold"
                              fontSize="1rem"
                              noWrap
                            >
                              {name}
                            </Typography>
                            <Typography
                              color="text.secondary"
                              fontSize="0.9rem"
                            >
                              ₹{price} × {quantity} ={" "}
                              <Typography
                                component="span"
                                fontWeight="bold"
                                color="primary"
                              >
                                ₹{(price * quantity).toFixed(2)}
                              </Typography>
                            </Typography>

                            {/* Quantity Controls */}
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1.2}
                              sx={{ mt: 0.5 }}
                            >
                              {/* - Button */}
                              <IconButton
                                size="small"
                                sx={{
                                  border: "1px solid #ddd",
                                  borderRadius: "50%",
                                  width: 32,
                                  height: 32,
                                  bgcolor: "#fafafa",
                                  "&:hover": { bgcolor: "#f0f0f0" },
                                }}
                                onClick={() => removeItem(id, 1, user.id)}
                              >
                                <Remove fontSize="small" />
                              </IconButton>

                              {/* Quantity Number */}
                              <Typography
                                fontWeight="bold"
                                fontSize="0.95rem"
                                minWidth={20}
                                textAlign="center"
                              >
                                {quantity}
                              </Typography>

                              {/* + Button */}
                              <IconButton
                                size="small"
                                sx={{
                                  border: "1px solid #ddd",
                                  borderRadius: "50%",
                                  width: 32,
                                  height: 32,
                                  bgcolor: "#fafafa",
                                  "&:hover": { bgcolor: "#f0f0f0" },
                                }}
                                onClick={() =>
                                  addItem(
                                    { id, name, price, quantity: 1 },
                                    user.id
                                  )
                                }
                              >
                                <Add fontSize="small" />
                              </IconButton>

                              {/* Delete Button */}
                              <IconButton
                                size="small"
                                sx={{
                                  ml: "auto",
                                  color: "white",
                                  bgcolor: "error.main",
                                  "&:hover": { bgcolor: "error.dark" },
                                  width: 36,
                                  height: 36,
                                  borderRadius: "50%",
                                }}
                                onClick={() =>
                                  removeItem(id, quantity, user.id)
                                }
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Stack>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </div>
                ))}

              {/* Continue Shopping */}
              <div className={styles.btn}>
                <Button
                  variant="outlined"
                  sx={{ mt: 2, borderRadius: 2 }}
                  onClick={() => navigate("/meals")}
                  startIcon={<ShoppingCart />}
                >
                  Continue Shopping
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  sx={{ mt: 2, borderRadius: 2 }}
                  onClick={() => clearCart(user.id)}
                >
                  Clear Cart
                </Button>
              </div>
            </Grid>

            {/* Right: Summary */}
            <Grid item xs={12} md={4}>
              <Paper
                className={styles.summaryBox}
                sx={{
                  p: 3,
                  position: isMobile ? "static" : "sticky",
                  top: 80,
                }}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Order Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Stack spacing={1}>
                  <Typography variant="body1">Items: {items.length}</Typography>
                  <Typography variant="body1">
                    Subtotal: ₹{totalAmount.toFixed(2)}
                  </Typography>
                  <Typography variant="body1">
                    Delivery Charges: ₹{deliveryCharges}
                  </Typography>
                  <Typography variant="body1">
                    Discount: -₹{discount}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Total: ₹{finalAmount}
                  </Typography>
                </Stack>

                {/* Coupon */}
                <Stack spacing={1} mt={2} className={styles.couponBox}>
                  <TextField
                    size="small"
                    label="Coupon Code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={applyCoupon}
                    sx={{ borderRadius: 2 }}
                  >
                    Apply
                  </Button>
                </Stack>

                {/* Checkout & Clear */}
                <Stack spacing={2} mt={5}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: 2 }}
                    onClick={() =>
                      navigate("/checkout", { state: { total: finalAmount } })
                    }
                  >
                    Proceed to Checkout
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </div>
  );
}
