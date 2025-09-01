// src/Componentes/Pages/CheckoutForm.jsx
"use client";

import { useForm, Controller } from "react-hook-form";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../Store/CartContext.jsx";
import { FaPhone, FaRegUser, FaRegAddressBook } from "react-icons/fa6";
import { IoMailOutline } from "react-icons/io5";
import axios from "axios";
import logo from "../../assets/main-logo.png";

// MUI imports
import {
  Paper,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  Button,
  Alert,
} from "@mui/material";

const CheckoutForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, clearCart } = useContext(CartContext);
  const total = location.state?.total || 0;

  const [showPaymentToast, setShowPaymentToast] = useState(false);

  const savedData = JSON.parse(localStorage.getItem("user")) || {};

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: savedData.username || "",
      email: savedData.email || "",
      mobile: "",
      address: "",
    },
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const onSubmit = async (formData) => {
    try {
      const res = await axios.post(
        "https://food-app-d8r3.onrender.com/create-order",
        { amount: total * 100, currency: "INR" }
      );
      const order = res.data;

      const options = {
        key: "rzp_test_7jWpAfUxjwYR6P",
        amount: order.amount,
        currency: "INR",
        name: "Meal Checkout",
        description: "Thank you for your purchase!",
        image: logo,
        order_id: order.id,
        handler: async function (response) {
          const saveRes = await fetch(
            "https://food-app-d8r3.onrender.com/save-payment",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: order.id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: order.amount / 100,
                currency: order.currency,
                name: formData.name,
                email: formData.email,
                mobile: formData.mobile,
                address: formData.address,
                items,
                user_id: savedData.id,
              }),
            }
          );

          if (!saveRes.ok) {
            return alert("Payment completed but failed to save!");
          }

          clearCart();
          setShowPaymentToast(true);
          setTimeout(() => {
            setShowPaymentToast(false);
            navigate("/payment-history");
          }, 3000);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: { color: "#0f172a" },
        method: {
          netbanking: true,
          card: true,
          upi: true,
          wallet: true,
          emi: false,
          paylater: false,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("❌ Payment setup failed:", error);
      alert("Something went wrong while setting up your payment.");
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 15,
        mb: 15,
        p: 4,
        borderRadius: 3,
      }}
    >
      {showPaymentToast && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Payment completed successfully. Redirecting...
        </Alert>
      )}

      <Typography variant="h5" fontWeight={600} textAlign="center" mb={2}>
        Checkout
      </Typography>

      <Typography
        variant="subtitle1"
        fontWeight={500}
        textAlign="center"
        mb={3}
      >
        Total Amount: ₹{parseFloat(total).toFixed(2)}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2}>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Full Name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Full Name"
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaRegUser />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                variant="outlined"
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IoMailOutline />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Controller
            name="mobile"
            control={control}
            rules={{
              required: "Mobile Number is required",
              pattern: {
                value: /^[0-9]{10,15}$/,
                message: "Please enter a valid mobile number",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Mobile Number"
                variant="outlined"
                type="tel"
                error={!!errors.mobile}
                helperText={errors.mobile?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaPhone />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Controller
            name="address"
            control={control}
            rules={{ required: "Shipping Address is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Shipping Address"
                variant="outlined"
                multiline
                rows={2}
                error={!!errors.address}
                helperText={errors.address?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaRegAddressBook />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            Proceed to Pay
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default CheckoutForm;
