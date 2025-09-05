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
  Alert,
  Stack,
  Button,
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

  const [showPaymentToast, setShowPaymentToast] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const savedUser = JSON.parse(localStorage.getItem("user")) || {};
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
                ...formData,
                items,
                user_id: savedUser.id,
              }),
            }
          );

          if (!saveRes.ok) return alert("Payment saved failed!");

          clearCart();
          localStorage.removeItem(STORAGE_KEY);
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
    <Paper
      elevation={6}
      sx={{ maxWidth: 650, mx: "auto", mt: 12, mb: 10, p: 4, borderRadius: 3 }}
      role="form"
      aria-label="Checkout form"
    >
      {showPaymentToast && (
        <Alert severity="success" sx={{ mb: 2 }} role="alert">
          Payment completed successfully. Redirecting...
        </Alert>
      )}

      <Typography
        variant="h5"
        fontWeight={600}
        textAlign="center"
        mb={3}
        aria-label="Checkout title"
      >
        Checkout
      </Typography>

      <Typography
        variant="subtitle1"
        fontWeight={500}
        textAlign="center"
        mb={3}
        aria-label="Total amount"
      >
        Total Amount: ₹{parseFloat(total).toFixed(2)}
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel aria-label={`Step ${label}`}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Suspense fallback={<Typography>Loading step...</Typography>}>
          {activeStep === 0 && (
            <UserDetailsForm control={control} errors={errors} />
          )}
          {activeStep === 1 && (
            <AddressForm control={control} errors={errors} />
          )}
          {activeStep === 2 && <PaymentReview items={items} total={total} />}
        </Suspense>

        {/* Navigation */}
        <Stack direction="row" justifyContent="space-between" mt={4}>
          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              variant="outlined"
              aria-label="Back button"
            >
              Back
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              aria-label="Next button"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              aria-label="Proceed to payment"
            >
              Proceed to Pay
            </Button>
          )}
        </Stack>
      </form>
    </Paper>
  );
};

export default CheckoutForm;
