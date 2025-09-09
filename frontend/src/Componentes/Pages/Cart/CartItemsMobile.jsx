import React from "react";
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";

export default function CartItemsMobile({ items, addItem, removeItem, user }) {
  return (
    <>
      {items.map(({ id, name, price, quantity, image }) => (
        <Card key={id} sx={{ mb: 2, borderRadius: 3, boxShadow: 3, p: 1.5 }}>
          <CardContent sx={{ p: "8px !important" }}>
            <Stack direction="row" spacing={2} alignItems="center">
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

              <Stack spacing={0.8} flex={1}>
                <Typography fontWeight="bold" fontSize="1rem" noWrap>
                  {name}
                </Typography>
                <Typography color="text.secondary" fontSize="0.9rem">
                  ₹{price} × {quantity} ={" "}
                  <Typography component="span" fontWeight="bold" color="primary">
                    ₹{(price * quantity).toFixed(2)}
                  </Typography>
                </Typography>

                <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mt: 0.5 }}>
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

                  <Typography fontWeight="bold" fontSize="0.95rem">
                    {quantity}
                  </Typography>

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
                    onClick={() => addItem({ id, name, price, quantity: 1 }, user.id)}
                  >
                    <Add fontSize="small" />
                  </IconButton>

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
                    onClick={() => removeItem(id, quantity, user.id)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
