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

  // console.log("📌 Initial items:", items);
  // console.log("📌 Total amount:", total);
  console.log("📌 Saved user:", savedUser);
  console.log("📌 Saved progress:", savedProgress);

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
      coupon_code: "",
      ...savedProgress.values,
    },
  });

  console.log("📌 Form default values:", {
    ...savedProgress.values,
    name: savedUser.username || "",
    email: savedUser.email || "",
  });

  // Restore step if saved
  useEffect(() => {
    if (savedProgress.step) {
      console.log("🔄 Restoring saved step:", savedProgress.step);
      setActiveStep(savedProgress.step);
    }
  }, []);

  // Save progress to localStorage whenever form changes
  useEffect(() => {
    const subscription = watch((values) => {
      console.log("💾 Form changed, saving progress:", values);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ step: activeStep, values })
      );
    });
    return () => subscription.unsubscribe();
  }, [watch, activeStep]);

  // Load Razorpay script once
  useEffect(() => {
    console.log("🔗 Loading Razorpay script");
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async (formData) => {
    console.log("💳 handlePayment called with formData:", formData);

    try {
      // 1️⃣ Create Razorpay order
      const res = await axios.post(
        "https://food-app-d8r3.onrender.com/create-order",
        { amount: total * 100, currency: "INR" }
      );
      const order = res.data;
      console.log("📝 Razorpay order created:", order);

      // 2️⃣ Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Meal Checkout",
        description: "Thank you for your purchase!",
        image: logo,
        order_id: order.id,
        handler: async (response) => {
          console.log("✅ Razorpay payment success response:", response);

          const payload = {
            razorpay_order_id: order.id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: order.amount / 100,
            currency: order.currency,
            name: formData.name,
            email: formData.email,
            address: `${formData.addressLine}, ${formData.city}, ${formData.state}, ${formData.pincode}, ${formData.country}`,
            mobile: formData.mobile,

            items,
            user_id: savedUser?.id,
            coupon_code: formData.coupon_code || null,
          };

          console.log("📤 Sending payment payload to backend:", payload);

          try {
            const saveRes = await fetch(
              "https://food-app-d8r3.onrender.com/save-payment",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              }
            );

            console.log("📥 Backend response status:", saveRes.status);

            if (!saveRes.ok) {
              console.error("❌ Payment save failed");
              return alert(
                "Payment could not be saved. Please contact support."
              );
            }

            clearCart();
            localStorage.removeItem(STORAGE_KEY);
            console.log("🧹 Cart cleared and localStorage removed");
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

      console.log("🛠️ Opening Razorpay checkout with options:", options);

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("❌ Payment setup failed:", error);
      alert("Something went wrong while setting up your payment.");
    }
  };

  const onSubmit = (data) => {
    console.log(
      "📤 onSubmit called with data:",
      data,
      "activeStep:",
      activeStep
    );
    if (activeStep === 2) {
      handlePayment(data);
    } else {
      setActiveStep((prev) => {
        console.log("➡️ Moving to next step:", prev + 1);
        return prev + 1;
      });
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
