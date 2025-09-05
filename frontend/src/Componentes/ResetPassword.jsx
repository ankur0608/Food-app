import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient.js";
import { useToast } from "./Store/ToastContext.jsx";
import styles from "./ResetPassword.module.css";

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async ({ password }) => {
    try {
      const { data, error } = await supabase.auth.updateUser({ password });

      if (error) {
        showToast(error.message || "Password reset failed", "error");
        return;
      }

      showToast("✅ Password reset successful! Please login.", "success");
      setTimeout(() => navigate("/login"), 1000);
    } catch {
      showToast("❌ Something went wrong. Try again.", "error");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h1 className={styles.heading}>Reset Password</h1>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            New Password
          </label>
          <input
            id="password"
            type="password"
            className={styles.input}
            placeholder="Enter new password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "At least 8 characters" },
            })}
          />
          {errors.password && (
            <small className={styles.small}>{errors.password.message}</small>
          )}
        </div>

        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
