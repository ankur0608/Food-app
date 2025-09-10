import React, { useState } from "react";
import {
  Paper,
  Typography,
  Divider,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import { useToast } from "../../Store/ToastContext.jsx";

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
  userId, // current user id
}) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const applyCoupon = async () => {
    if (!coupon.trim()) {
      showToast("⚠️ Please enter a coupon code", "error");
      return;
    }

    if (!userId) {
      showToast("❌ Please login to apply a coupon", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://food-app-d8r3.onrender.com/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, code: coupon.trim() }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setDiscount(0);
        showToast(`❌ ${errorData.message || "Invalid coupon"}`, "error");
        return;
      }

      const data = await res.json();

      if (data.valid) {
        setDiscount(data.discount);
        showToast(
          `🎉 Coupon applied! You got ${data.discount}% off`,
          "success"
        );
      } else {
        setDiscount(0);
        showToast(`❌ ${data.message}`, "error");
      }
    } catch (err) {
      console.error(err);
      setDiscount(0);
      showToast("❌ Failed to validate coupon", "error");
    } finally {
      setLoading(false);
    }
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
          disabled={loading}
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
