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

  const handlePayment = async (formData) => {
    try {
      const res = await axios.post(
        "https://food-app-d8r3.onrender.com/create-order",
        {
          amount: total * 100,
          currency: "INR",
        }
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
                address: `${formData.addressLine}, ${formData.city}, ${formData.state}, ${formData.pincode}, ${formData.country}`,
                items,
                user_id: savedUser?.id,
              }),
            }
          );
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

  const onSubmit = (data) => {
    if (activeStep === 2) handlePayment(data);
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
