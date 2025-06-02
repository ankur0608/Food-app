import { useForm } from "react-hook-form";
import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Checkout.module.css";
import Modal from "../Modal";
import { CartContext } from "../Store/CartContext.jsx";

const CheckoutForm = () => {
  const { register, handleSubmit, setValue } = useForm();
  const modalRef = useRef();
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { clearCart } = useContext(CartContext);

  const total = location.state?.total || 0;

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("signupData"));
    if (savedData) {
      setValue("name", savedData.username);
      setValue("email", savedData.email);
    }
  }, [setValue]);

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

      <form onSubmit={handleSubmit(onSubmit)} className={styles.checkoutForm}>
        <h2 className={styles.heading}>Checkout</h2>

        <p className={styles.totalAmount}>
          Total Amount: ${parseFloat(total).toFixed(2)}
        </p>

        <input
          {...register("name")}
          placeholder="Full Name"
          className={styles.formInput}
        />

        <input
          {...register("email")}
          placeholder="Email"
          className={styles.formInput}
        />

        <input
          {...register("address", { required: true })}
          placeholder="Shipping Address"
          className={styles.formInput}
        />

        <button type="submit" className={styles.formButton}>
          Proceed to Pay
        </button>
      </form>
    </>
  );
};

export default CheckoutForm;
