import React, { useState } from "react";
import {
  Paper,
  Typography,
  Divider,
  Stack,
  TextField,
  Button,
} from "@mui/material";

export default function CartSummary({
  items,
  totalAmount,
  discount,
  setDiscount,
  coupon,
  setCoupon,
  deliveryCharges,
  finalAmount,
  navigate,
  userId, // pass current user id
}) {
  const [loading, setLoading] = useState(false);

  const applyCoupon = async () => {
    if (!coupon) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, code: coupon }),
      });
      const data = await res.json();

      if (data.valid) {
        setDiscount(data.discount);
        alert(`🎉 Coupon applied! You got ${data.discount}% off`);
      } else {
        setDiscount(0);
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setDiscount(0);
      alert("❌ Failed to validate coupon");
    }
    setLoading(false);
  };

  return (
    <Paper sx={{ p: 3, position: "sticky", top: 80 }}>
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
        <Typography variant="body1">Discount: -₹{discount}</Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="h6" fontWeight="bold">
          Total: ₹{finalAmount}
        </Typography>
      </Stack>

      <Stack spacing={1} mt={2}>
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
          disabled={loading}
        >
          {loading ? "Applying..." : "Apply"}
        </Button>
      </Stack>

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
  );
}
