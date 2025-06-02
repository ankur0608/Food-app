import styles from "./Newsletter.module.css";
import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import Modal from "./Modal";
import { useTheme } from "./Store/theme";
export default function Newsletter() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { theme } = useTheme();

  const [isModalOpen, setModalOpen] = useState(false);
  const modalRef = useRef();

  function onSubmit(data) {
    console.log("Subscribed with:", data.email);
    modalRef.current.open();
    setModalOpen(true); // Open modal on success
    reset(); // Clear form
  }

  function handleModalClose() {
    setModalOpen(false);
  }

  return (
    <>
      <Modal
        ref={modalRef}
        open={isModalOpen}
        buttonCaption="Okay"
        onModalclose={handleModalClose}
        isSuccess={true}
      >
        <h1 style={{ color: "green", fontWeight: "bold" }}>Subscribed!</h1>
        <p>You’ll now receive the latest updates and offers via email.</p>
      </Modal>

      {/* Newsletter Form */}
      <section
        className={`${styles.newsletter} ${
          theme === "dark" ? styles.dark : styles.light
        }`}
        aria-label="Newsletter Signup"
      >
        <h3 className={styles.heading}>Subscribe</h3>
        <p className={styles.subtext}>
          Get updates and offers straight to your inbox.
        </p>

        {errors.email && <p className={styles.error}>{errors.email.message}</p>}

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            placeholder="Your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
            className={styles.input}
            aria-label="Email address"
          />
          <button type="submit" className={styles.button}>
            Subscribe
          </button>
        </form>
      </section>
    </>
  );
}
