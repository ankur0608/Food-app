// src/Componentes/Cart/MiniCartDrawer.jsx
import React, { useContext } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Stack,
  Divider,
  Button,
  Avatar,
} from "@mui/material";
import { Add, Remove, Delete, Close } from "@mui/icons-material";
import { CartContext } from "../Componentes/Store/CartContext";
import { useNavigate } from "react-router-dom";

export default function MiniCartDrawer({ open, onClose }) {
  const { items, addItem, removeItem, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "90vw", sm: 420 },
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          borderRadius: "12px 0 0 12px",
          boxShadow: "-4px 0 20px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        p={2}
      >
        <Typography variant="h6" fontWeight="bold">
          🛒 Your Cart
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Stack>
      <Divider />

      {/* Cart Items */}
      <Box flex={1} overflow="auto" px={2} py={1}>
        {items.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 4, textAlign: "center" }}
          >
            Your cart is empty
          </Typography>
        ) : (
          <Stack spacing={2}>
            {items.map(({ id, name, price, quantity, image }) => (
              <Box
                key={id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 2,
                  p: 1.5,
                  boxShadow: 1,
                  transition: "0.2s",
                  "&:hover": { boxShadow: 3, transform: "scale(1.02)" },
                }}
              >
                <Avatar
                  src={image}
                  alt={name}
                  variant="rounded"
                  sx={{ width: 60, height: 60, mr: 2 }}
                />
                <Box flex={1}>
                  <Typography variant="subtitle1" fontWeight="bold" noWrap>
                    {name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₹{price} × {quantity}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="primary"
                  >
                    ₹{(price * quantity).toFixed(2)}
                  </Typography>

                  {/* Quantity Controls */}
                  <Stack direction="row" spacing={1} mt={1}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeItem(id, 1, user.id)}
                    >
                      <Remove fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() =>
                        addItem({ id, name, price, quantity: 1 }, user.id)
                      }
                    >
                      <Add fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeItem(id, quantity, user.id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      {/* Sticky Footer */}
      <Box sx={{ p: 2, borderTop: "1px solid #eee" }}>
        <Stack spacing={2}>
          <Typography
            variant="h6"
            fontWeight="bold"
            textAlign="right"
            color="primary"
          >
            Total: ₹{totalAmount.toFixed(2)}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ borderRadius: 2 }}
            onClick={() => {
              onClose();
              navigate("/checkout", { state: { total: totalAmount } });
            }}
          >
            Checkout
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ borderRadius: 2 }}
            onClick={() => {
              onClose();
              navigate("/cart");
            }}
          >
            View Full Cart
          </Button>
          <Button
            variant="text"
            color="error"
            onClick={() => clearCart(user.id)}
          >
            Clear Cart
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}
