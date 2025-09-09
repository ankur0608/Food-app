"use client";

import { useEffect, useState, useContext, Suspense, lazy } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../../../Store/CartContext";
import { useForm } from "react-hook-form";
import axios from "axios";
import logo from "../../../../assets/main-logo.png";

// MUI
import {
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";

// Lazy load step components
const UserDetailsForm = lazy(() => import("../steps/UserDetailsForm"));
const AddressForm = lazy(() => import("../steps/AddressForm"));
const PaymentReview = lazy(() => import("../steps/PaymentReview"));

const steps = ["User Details", "Address", "Payment"];
const STORAGE_KEY = "checkout-progress";

const CheckoutForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, clearCart } = useContext(CartContext);
  const total = location.state?.total || 0;

  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const savedUser = JSON.parse(localStorage.getItem("user")) || {};
  const user_id = savedUser.id || null;
  const savedProgress = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

  const {
    control,
    handleSubmit,
    trigger,
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
      ...savedProgress.values,
    },
  });

  useEffect(() => {
    if (savedProgress.step) setActiveStep(savedProgress.step);
  }, []);

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

  // Razorpay payment handler
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
                name: formData.name,
                email: formData.email,
                mobile: formData.mobile,
                // 👇 Combine into single text field
                address: `${formData.addressLine}, ${formData.city}, ${formData.state}, ${formData.pincode}, ${formData.country}`,
                items,
                user_id: user_id,
              }),
            }
          );
          console.log("💾 Saving payment info:", user_id);
          if (!saveRes.ok) return alert("Payment save failed!");

          clearCart();
          localStorage.removeItem(STORAGE_KEY);
          setShowPaymentPopup(true);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: { color: "#ff6600" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("❌ Payment setup failed:", error);
      alert("Something went wrong while setting up your payment.");
    }
  };

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
    if (activeStep === steps.length - 1) handlePayment(data);
  };

  return (
    <>
      <Paper
        elevation={8}
        sx={{
          maxWidth: 750,
          mx: "auto",
          mt: 10,
          mb: 12,
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          bgcolor: "background.paper",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          mb={2}
          color="primary"
        >
          Checkout
        </Typography>

        <Typography
          variant="h6"
          fontWeight={500}
          textAlign="center"
          mb={4}
          color="text.secondary"
        >
          Total Amount: <strong>₹{parseFloat(total).toFixed(2)}</strong>
        </Typography>

        {/* Modern Stepper */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            mb: 5,
            "& .MuiStepIcon-root": {
              color: "#d1d5db",
            },
            "& .MuiStepIcon-root.Mui-active": {
              color: "#ff6600",
            },
            "& .MuiStepIcon-root.Mui-completed": {
              color: "#4ade80",
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Suspense fallback={<Typography>Loading step...</Typography>}>
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: "#fafafa",
                mb: 4,
                boxShadow: "inset 0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              {activeStep === 0 && (
                <UserDetailsForm control={control} errors={errors} />
              )}
              {activeStep === 1 && (
                <AddressForm control={control} errors={errors} />
              )}
              {activeStep === 2 && (
                <PaymentReview items={items} total={total} />
              )}
            </Box>
          </Suspense>

          {/* Navigation */}
          <Stack direction="row" justifyContent="space-between" mt={4}>
            {activeStep > 0 && (
              <Button
                onClick={handleBack}
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.2,
                  textTransform: "none",
                }}
              >
                Back
              </Button>
            )}
            {activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.2,
                  textTransform: "none",
                  background: "linear-gradient(90deg,#ff6600,#ff8533)",
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit(onSubmit)} // 👈 call manually
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.2,
                  textTransform: "none",
                  fontWeight: 600,
                  background: "linear-gradient(90deg,#ff6600,#ff8533)",
                }}
              >
                Proceed to Pay
              </Button>
            )}
          </Stack>
        </form>
      </Paper>

      {/* Payment Success Popup */}
      <Dialog
        open={showPaymentPopup}
        onClose={() => {
          setShowPaymentPopup(false);
          navigate("/payment-history");
        }}
        aria-labelledby="payment-success-dialog"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          id="payment-success-dialog"
          sx={{ fontWeight: 700, textAlign: "center", mt: 1, color: "primary" }}
        >
          🎉 Payment Successful
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", py: 2 }}>
          <Typography variant="body1" color="text.secondary">
            Thank you for your purchase! Your payment has been processed
            successfully.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            variant="contained"
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.2,
              textTransform: "none",
              background: "linear-gradient(90deg,#ff6600,#ff8533)",
            }}
            onClick={() => {
              setShowPaymentPopup(false);
              navigate("/payment-history");
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CheckoutForm;
