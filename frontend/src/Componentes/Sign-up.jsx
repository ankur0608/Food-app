import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import styles from "./Signup.module.css";
import Modal from "./Modal.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "./Store/theme.jsx";

function Signup() {
  const modalRef = useRef();
  const [modalOpen, setModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  const password = watch("password");
  const navigate = useNavigate();
  const { theme } = useTheme();

  async function onSubmit(data) {
    try {
      localStorage.setItem("signupData", JSON.stringify(data));
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        alert(result.error || "Signup failed");
        return;
      }
      localStorage.setItem("token", result.token);
      localStorage.setItem("justSignedUp", "true");
      modalRef.current.open();
      setModalOpen(true);
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  }

  function handleModalClose() {
    setModalOpen(false);
    navigate("/login");
  }

  return (
    <>
      <Modal
        ref={modalRef}
        buttonCaption="Okay"
        onModalclose={handleModalClose}
      >
        <h1 style={{ color: "green", fontWeight: "bold" }}>Signup successful!</h1>
        <h2>Welcome</h2>
      </Modal>

      <div className={`${styles.container} ${theme} ${modalOpen ? styles.blurred : ""}`}>
        <h1 className={styles.heading}>Signup</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className={styles.form}
        >
          <div>
            <label htmlFor="signup-username" className={styles.label}>
              Username:
            </label>
            <input
              className={styles.input}
              type="text"
              id="signup-username"
              placeholder="Username"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <small className={styles.small}>{errors.username.message}</small>
            )}
          </div>
          <div>
            <label htmlFor="signup-email" className={styles.label}>
              Email:
            </label>
            <input
              className={styles.input}
              type="email"
              id="signup-email"
              placeholder="Your Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <small className={styles.small}>{errors.email.message}</small>
            )}
          </div>
          <div>
            <label htmlFor="signup-password" className={styles.label}>
              Password:
            </label>
            <input
              className={styles.input}
              type="password"
              id="signup-password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },
                maxLength: { value: 10, message: "Maximum 10 characters" },
              })}
            />
            {errors.password && (
              <small className={styles.small}>{errors.password.message}</small>
            )}
          </div>
          <div>
            <label htmlFor="signup-confirmPassword" className={styles.label}>
              Confirm Password:
            </label>
            <input
              className={styles.input}
              type="password"
              id="signup-confirmPassword"
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <small className={styles.small}>{errors.confirmPassword.message}</small>
            )}
          </div>
          <Link to="/Login" className={styles.Link}>
            Already have an Account?
          </Link>
          <div>
            <button
              type="submit"
              className={styles.button}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Signup;
