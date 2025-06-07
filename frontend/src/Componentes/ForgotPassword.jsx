import { useForm } from "react-hook-form";
// import input from "./input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ForgotPassword.module.css";

export default function ForgotPassword() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  function onSubmit(data) {
    console.log("Email for password reset:", data.email);
    setMessage("A password reset link has been sent to your email.");
    navigate("/login");
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Forgot Password</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={styles.form}
      >
        <div>
          <input
            className={styles.input}
            type="email"
            label="Email :"
            placeholder="Your Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
          />
          {errors.email && (
            <small className={styles.small}>{errors.email.message}</small>
          )}
        </div>

        <div>
          <button
            type="submit"
            className={styles.button}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending Reset Link..." : "Send Reset Link"}
          </button>
        </div>
      </form>

      {/* Success message */}
      {message && <div className={styles.successMessage}>{message}</div>}
    </div>
  );
}
