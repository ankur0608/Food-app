import { useForm } from "react-hook-form";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Checkout.module.css";
import { CartContext } from "../Store/CartContext.jsx";
import { FaPhone, FaRegUser, FaRegAddressBook } from "react-icons/fa6";
import { IoMailOutline } from "react-icons/io5";
import axios from "axios";

const CheckoutForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useContext(CartContext);
  const total = location.state?.total || 0;

  const [showPaymentToast, setShowPaymentToast] = useState(false);

  const savedData = JSON.parse(localStorage.getItem("signupData")) || {};
  const {
    register,
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
        { amount: total * 100, currency: "USD" }
      );
      const order = res.data;

      const options = {
        key: "rzp_test_7jWpAfUxjwYR6P",
        amount: order.amount,
        currency: "USD",
        name: "Meal Checkout",
        description: "Thank you for your purchase!",
        image: "/assets/logo.png",
        order_id: order.id,
        handler: async function (response) {
          const saveRes = await fetch(
            "https://food-app-d8r3.onrender.com/save-payment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
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
                items:
                  JSON.parse(localStorage.getItem("cartItems"))?.items || [],
              }),
            }
          );

          if (!saveRes.ok) {
            console.error("❌ Failed to save payment");
            return alert("Payment completed but failed to save!");
          }

          localStorage.removeItem("cartItems");
          clearCart();

          const orderDetails = {
            razorpay_order_id: order.id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: order.amount / 100,
            currency: order.currency,
            buyer: {
              name: formData.name,
              email: formData.email,
              mobile: formData.mobile,
              address: formData.address,
            },
            date: new Date().toLocaleString(),
          };

          localStorage.setItem("orderDetails", JSON.stringify(orderDetails));

          // ✅ Show success toast before navigating
          setShowPaymentToast(true);
          setTimeout(() => {
            setShowPaymentToast(false);
            navigate("/order-summary");
          }, 3000);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: {
          color: "#0f172a",
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
    <>
      {showPaymentToast && (
        <div className={styles.toast}>
          ✅ Payment completed successfully. Redirecting to summary...
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.checkoutForm}
        noValidate
      >
        <h2 className={styles.heading}>Checkout</h2>

        <p className={styles.totalAmount}>
          Total Amount: ${parseFloat(total).toFixed(2)}
        </p>

        <div className={styles.inputGroup}>
          <FaRegUser className={styles.inputIcon} />
          <input
            {...register("name", { required: "Full Name is required" })}
            placeholder="Full Name"
            className={styles.formInput}
          />
          {errors.name && (
            <span className={styles.error}>{errors.name.message}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <IoMailOutline className={styles.inputIcon} />
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            type="email"
            placeholder="Email"
            className={styles.formInput}
          />
          {errors.email && (
            <span className={styles.error}>{errors.email.message}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <FaPhone className={styles.inputIcon} />
          <input
            {...register("mobile", {
              required: "Mobile Number is required",
              pattern: {
                value: /^[0-9]{10,15}$/,
                message: "Please enter a valid mobile number",
              },
            })}
            placeholder="Mobile Number"
            className={styles.formInput}
            type="tel"
          />
          {errors.mobile && (
            <span className={styles.error}>{errors.mobile.message}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <FaRegAddressBook className={styles.inputIcon} />
          <input
            {...register("address", {
              required: "Shipping Address is required",
            })}
            placeholder="Shipping Address"
            className={styles.formInput}
          />
          {errors.address && (
            <span className={styles.error}>{errors.address.message}</span>
          )}
        </div>

        <button type="submit" className={styles.formButton}>
          Proceed to Pay
        </button>
      </form>
    </>
  );
};

export default CheckoutForm;
