"use client";
import { useState, Suspense, lazy } from "react";
import { useForm } from "react-hook-form";
import {
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Stack,
  Button,
  Box,
} from "@mui/material";
import PaymentSuccessDialog from "../PaymentSuccessDialog";
import { useCheckoutLogic } from "../useCheckoutLogic";

const UserDetailsForm = lazy(() => import("../steps/UserDetailsForm"));
const AddressForm = lazy(() => import("../steps/AddressForm"));
const PaymentReview = lazy(() => import("../steps/PaymentReview"));

const steps = ["User Details", "Address", "Payment"];

const CheckoutForm = () => {
  const {
    items,
    total,
    activeStep,
    setActiveStep,
    control,
    errors,
    handleSubmit,
    trigger,
    onSubmit,
    showPaymentPopup,
    setShowPaymentPopup,
    navigate,
  } = useCheckoutLogic();

  const handleNext = async () => {
    const valid = await trigger(
      activeStep === 0
        ? ["name", "email", "mobile"]
        : ["addressLine", "city", "state", "pincode", "country"]
    );
    if (valid) setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

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

        {/* Stepper */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            mb: 5,
            "& .MuiStepIcon-root": { color: "#d1d5db" },
            "& .MuiStepIcon-root.Mui-active": { color: "#ff6600" },
            "& .MuiStepIcon-root.Mui-completed": { color: "#4ade80" },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Form */}
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
                sx={{ borderRadius: 3, px: 4, py: 1.2, textTransform: "none" }}
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
                onClick={handleSubmit(onSubmit)}
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
      <PaymentSuccessDialog
        open={showPaymentPopup}
        onClose={() => {
          setShowPaymentPopup(false);
          navigate("/payment-history");
        }}
      />
    </>
  );
};

export default CheckoutForm;
