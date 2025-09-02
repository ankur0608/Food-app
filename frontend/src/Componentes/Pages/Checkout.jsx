// src/Componentes/Pages/CheckoutForm.jsx
"use client";

import { useForm, Controller } from "react-hook-form";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../Store/CartContext.jsx";
import { FaPhone, FaRegUser } from "react-icons/fa6";
import { IoMailOutline } from "react-icons/io5";
import { FaRegAddressBook } from "react-icons/fa6";
import axios from "axios";
import logo from "../../assets/main-logo.png";

// MUI
import {
  Paper,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  Button,
  Alert,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const steps = ["User Details", "Address", "Payment"];

const STORAGE_KEY = "checkout-progress";

const CheckoutForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, clearCart } = useContext(CartContext);
  const total = location.state?.total || 0;

  const [showPaymentToast, setShowPaymentToast] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const savedUser = JSON.parse(localStorage.getItem("user")) || {};
  const savedProgress = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

  const {
    control,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: savedUser.username || "",
      email: savedUser.email || "",
      mobile: "",
      addressLine: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      ...savedProgress.values, // restore previous form values
    },
  });

  useEffect(() => {
    // Restore active step
    if (savedProgress.step) {
      setActiveStep(savedProgress.step);
    }
  }, []);

  // Save progress on form change
  useEffect(() => {
    const subscription = watch((values) => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ step: activeStep, values })
      );
    });
    return () => subscription.unsubscribe();
  }, [watch, activeStep]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Razorpay
  const handlePayment = async (formData) => {
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
                ...formData,
                items,
                user_id: savedUser.id,
              }),
            }
          );

          if (!saveRes.ok) {
            return alert("Payment completed but failed to save!");
          }

          clearCart();
          localStorage.removeItem(STORAGE_KEY); // clear progress after success
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
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("❌ Payment setup failed:", error);
      alert("Something went wrong while setting up your payment.");
    }
  };

  // Step navigation
  const handleNext = async () => {
    const valid = await trigger(
      activeStep === 0
        ? ["name", "email", "mobile"]
        : ["addressLine", "city", "state", "pincode", "country"]
    );
    if (valid) setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const onSubmit = (data) => {
    if (activeStep === steps.length - 1) {
      handlePayment(data);
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{ maxWidth: 650, mx: "auto", mt: 12, mb: 10, p: 4, borderRadius: 3 }}
    >
      {showPaymentToast && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Payment completed successfully. Redirecting...
        </Alert>
      )}

      <Typography variant="h5" fontWeight={600} textAlign="center" mb={3}>
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

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Step 1: User details */}
        {activeStep === 0 && (
          <Stack spacing={2}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Full Name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Full Name"
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
                  message: "Enter valid mobile number",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mobile Number"
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
          </Stack>
        )}

        {/* Step 2: Address */}
        {activeStep === 1 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="addressLine"
                control={control}
                rules={{ required: "Address Line is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address Line"
                    error={!!errors.addressLine}
                    helperText={errors.addressLine?.message}
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
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="city"
                control={control}
                rules={{ required: "City is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="City"
                    error={!!errors.city}
                    helperText={errors.city?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="pincode"
                control={control}
                rules={{
                  required: "Pincode is required",
                  pattern: {
                    value: /^[0-9]{5,6}$/,
                    message: "Enter valid pincode",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Pincode"
                    error={!!errors.pincode}
                    helperText={errors.pincode?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="state"
                control={control}
                rules={{ required: "State is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="State"
                    error={!!errors.state}
                    helperText={errors.state?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="country"
                control={control}
                rules={{ required: "Country is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Country"
                    error={!!errors.country}
                    helperText={errors.country?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        )}

        {/* Step 3: Payment */}
        {/* Step 3: Payment */}
        {activeStep === 2 && (
          <Stack spacing={3}>
            <Typography variant="h6" fontWeight={600}>
              Review Your Cart
            </Typography>

            {items.length > 0 ? (
              <Paper variant="outlined">
                <Table sx={{ minWidth: 400 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Box
                              component="img"
                              src={item.image}
                              alt={item.name}
                              sx={{
                                width: 50,
                                height: 50,
                                borderRadius: 1,
                                objectFit: "cover",
                              }}
                            />
                            <Typography>{item.name}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="right">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} align="right" fontWeight={700}>
                        Total
                      </TableCell>
                      <TableCell align="right" fontWeight={700}>
                        ₹{parseFloat(total).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>
            ) : (
              <Typography color="text.secondary">Your cart is empty</Typography>
            )}

            <Typography variant="body1" textAlign="center" mt={2}>
              Click below to complete your payment securely.
            </Typography>
          </Stack>
        )}

        {/* Navigation buttons */}
        <Stack direction="row" justifyContent="space-between" mt={4}>
          {activeStep > 0 && (
            <Button onClick={handleBack} variant="outlined">
              Back
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="submit" variant="contained" color="primary">
              Proceed to Pay
            </Button>
          )}
        </Stack>
      </form>
    </Paper>
  );
};

export default CheckoutForm;
