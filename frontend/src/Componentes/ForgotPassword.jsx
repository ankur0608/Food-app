import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ForgotPassword.module.css";
import { IoMailOutline } from "react-icons/io5";
import { useTheme } from "./Store/theme";
import { supabase } from "../../supabaseClient";

export default function ForgotPassword() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { theme } = useTheme();
  async function onSubmit(data) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: "https://your-vercel-app-name.vercel.app/reset-password",
      });

      if (error) {
        setMessage("Failed to send reset link: " + error.message);
      } else {
        setMessage("A password reset link has been sent to your email.");
        // Optional: delay before redirecting
        setTimeout(() => navigate("/login"), 4000);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setMessage("Something went wrong. Please try again later.");
    }
  }

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <h1 className={styles.heading}>Forgot Password</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={styles.form}
      >
        <div className={styles.inputGroup}>
          <IoMailOutline className={styles.icon} />
          <input
            className={styles.input}
            type="email"
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
