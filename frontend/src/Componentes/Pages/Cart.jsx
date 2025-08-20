// src/Componentes/Pages/Cart.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import { CartContext } from "../Store/CartContext";

export default function Cart() {
  const { items, addItem, removeItem, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: 800, mx: "auto", mt: 4, p: 2 }}
    >
      <Typography variant="h5" gutterBottom>
        Your Cart
      </Typography>

      {items.length === 0 ? (
        <Typography variant="body1">Your cart is empty.</Typography>
      ) : (
        <>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="center">Item</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Qty</TableCell>
                <TableCell align="center">Total</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map(({ id, name, price, quantity }) => (
                <TableRow key={id}>
                  <TableCell align="center">{name}</TableCell>
                  <TableCell align="center">₹{price}</TableCell>
                  <TableCell align="center">{quantity}</TableCell>
                  <TableCell align="center">
                    ₹{(price * quantity).toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => removeItem(id, 1, user.id)}
                      >
                        -
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() =>
                          addItem({ id, name, price, quantity: 1 }, user.id)
                        }
                      >
                        +
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Typography
            variant="h6"
            align="right"
            sx={{ mt: 2, fontWeight: "bold" }}
          >
            Total: ₹{totalAmount.toFixed(2)}
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            <Button variant="outlined" onClick={() => navigate("/meals")}>
              Continue Shopping
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                navigate("/checkout", {
                  state: { total: totalAmount.toFixed(2) },
                })
              }
            >
              Checkout
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => clearCart(user.id)}
            >
              Clear Cart
            </Button>
          </Stack>
        </>
      )}
    </TableContainer>
  );
}
