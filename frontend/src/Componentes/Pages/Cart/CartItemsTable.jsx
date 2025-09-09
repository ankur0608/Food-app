import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Stack,
  Box,
  IconButton,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import styles from "./Cart.module.css";

export default function CartItemsTable({ items, addItem, removeItem, user }) {
  return (
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
                <Stack direction="row" spacing={2} alignItems="center">
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
                <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                  <IconButton
                    size="small"
                    color="error"
                    className={styles.qtyButton}
                    onClick={() => removeItem(id, 1, user.id)}
                  >
                    <Remove fontSize="small" />
                  </IconButton>
                  <Typography>{quantity}</Typography>
                  <IconButton
                    size="small"
                    color="primary"
                    className={styles.qtyButton}
                    onClick={() => addItem({ id, name, price, quantity: 1 }, user.id)}
                  >
                    <Add fontSize="small" />
                  </IconButton>
                </Stack>
              </TableCell>
              <TableCell align="center">₹{(price * quantity).toFixed(2)}</TableCell>
              <TableCell align="center">
                <IconButton color="error" onClick={() => removeItem(id, quantity, user.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
