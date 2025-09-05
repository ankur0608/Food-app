import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient.js";
import { useToast } from "./Store/ToastContext.jsx";
import styles from "./ForgotPassword.module.css";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { showToast } = useToast();

  const onSubmit = async ({ email }) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        showToast(error.message || "Failed to send reset link", "error");
        return;
      }

      showToast("📧 Password reset link sent! Check your email.", "success");
    } catch {
      showToast("❌ Something went wrong. Please try again.", "error");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h1 className={styles.heading}>Forgot Password</h1>

        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            type="email"
            className={styles.input}
            placeholder="Enter your email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <small className={styles.small}>{errors.email.message}</small>
          )}
        </div>

        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send reset link"}
        </button>

        <Link to="/login" className={styles.Link}>
          Back to login
        </Link>
      </form>
    </div>
  );
}
