import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../../Store/CartContext";
import { useForm } from "react-hook-form";
import axios from "axios";
import logo from "../../../assets/main-logo.png";

const STORAGE_KEY = "checkout-progress";

export const useCheckoutLogic = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, clearCart } = useContext(CartContext);
  const total = location.state?.total || 0;

  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const savedProgress = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

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
      coupon_code: "", // optional coupon input
      ...savedProgress.values,
    },
  });

  // Restore step if saved
  useEffect(() => {
    if (savedProgress.step) setActiveStep(savedProgress.step);
  }, []);

  // Save progress to localStorage whenever form changes
  useEffect(() => {
    const subscription = watch((values) => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ step: activeStep, values })
      );
    });
    return () => subscription.unsubscribe();
  }, [watch, activeStep]);

  // Load Razorpay script once
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async (formData) => {
    try {
      // 1️⃣ Create Razorpay order
      const res = await axios.post(
        "https://food-app-d8r3.onrender.com/create-order",
        { amount: total * 100, currency: "INR" }
      );
      const order = res.data;

      // 2️⃣ Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // replace with your live key
        amount: order.amount,
        currency: "INR",
        name: "Meal Checkout",
        description: "Thank you for your purchase!",
        image: logo,
        order_id: order.id,
        handler: async (response) => {
          // Save payment in backend
          const payload = {
            razorpay_order_id: order.id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: order.amount / 100,
            currency: order.currency,
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile,
            address: `${formData.addressLine}, ${formData.city}, ${formData.state}, ${formData.pincode}, ${formData.country}`,
            items,
            user_id: savedUser?.id,
            coupon_code: formData.coupon_code || null, // optional
          };

          try {
            const saveRes = await fetch(
              "https://food-app-d8r3.onrender.com/save-payment",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              }
            );

            if (!saveRes.ok) {
              console.error("❌ Payment save failed");
              return alert(
                "Payment could not be saved. Please contact support."
              );
            }

            // Clear cart & progress
            clearCart();
            localStorage.removeItem(STORAGE_KEY);
            setShowPaymentPopup(true);
          } catch (err) {
            console.error("❌ Payment save request failed:", err);
            alert("Something went wrong while saving your payment.");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: { color: "#ff6600" },
      };

      // 3️⃣ Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("❌ Payment setup failed:", error);
      alert("Something went wrong while setting up your payment.");
    }
  };

  const onSubmit = (data) => {
    if (activeStep === 2) {
      handlePayment(data);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  return {
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
  };
};
