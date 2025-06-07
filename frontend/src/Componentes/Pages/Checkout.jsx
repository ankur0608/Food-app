import { useForm } from "react-hook-form";
import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Checkout.module.css";
import Modal from "../Modal";
import { CartContext } from "../Store/CartContext.jsx";
import { FaPhone } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";
import { FaRegAddressBook } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";

const CheckoutForm = () => {
  const modalRef = useRef();
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useContext(CartContext);

  const total = location.state?.total || 0;

  const savedData = JSON.parse(localStorage.getItem("signupData")) || {};
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: savedData.username || "",
      email: savedData.email || "",
      mobile: "",
      address: ""
    }
  });

  const onSubmit = (data) => {
    console.log("checkout:", data);
    localStorage.removeItem("cartItems");
    clearCart();
    modalRef.current.open();
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    navigate("/");
  };

  return (
    <>
      <Modal
        ref={modalRef}
        buttonCaption="Okay"
        onModalclose={handleModalClose}
      >
        <h1 style={{ color: "green", fontWeight: "bold" }}>
          Order Successful!
        </h1>
        <h2>Thank you for your order!</h2>
      </Modal>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.checkoutForm} noValidate>
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
          {errors.name && <span className={styles.error}>{errors.name.message}</span>}
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
          {errors.email && <span className={styles.error}>{errors.email.message}</span>}
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
          {errors.mobile && <span className={styles.error}>{errors.mobile.message}</span>}
        </div>

        <div className={styles.inputGroup}>
          <FaRegAddressBook className={styles.inputIcon} />
          <input
            {...register("address", { required: "Shipping Address is required" })}
            placeholder="Shipping Address"
            className={styles.formInput}
          />
          {errors.address && <span className={styles.error}>{errors.address.message}</span>}
        </div>

        <button type="submit" className={styles.formButton}>
          Proceed to Pay
        </button>
      </form>
    </>
  );
};

export default CheckoutForm;
