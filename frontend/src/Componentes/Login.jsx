import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoMailOutline } from "react-icons/io5";
import { TbLockPassword } from "react-icons/tb";

import styles from "./Login.module.css";
import { useTheme } from "./Store/theme.jsx";
import { supabase } from "../../supabaseClient.js";
import { useToast } from "./Store/ToastContext.jsx"; // ✅ global toast
import googleLogo from "../assets/google.png";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { showToast } = useToast(); // ✅ use global toast

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get("verified") === "true") {
      showToast("Email verified successfully!", "success");
    }
  }, [location.search, showToast]);

  const onSubmit = async (data) => {
    try {
      const { data: sessionData, error } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (error) {
        showToast(`❌ ${error.message || "Login failed"}`, "error");
        return;
      }

      localStorage.setItem("user", JSON.stringify(sessionData.user));
      showToast("Login successful!", "success");

      setTimeout(() => navigate("/"), 500);
    } catch {
      showToast("❌ Something went wrong. Please try again.", "error");
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://food-app-five-mu.vercel.app/google-redirect",
      },
    });

    if (error) showToast("❌ Google login failed", "error");
  };

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <h2 className={styles.heading}>Login</h2>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            <IoMailOutline className={styles.icon} /> Email
          </label>
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
            autoComplete="username"
          />
          {errors.email && (
            <small className={styles.small}>{errors.email.message}</small>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            <TbLockPassword className={styles.icon} /> Password
          </label>
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
            autoComplete="current-password"
          />
          {errors.password && (
            <small className={styles.small}>{errors.password.message}</small>
          )}
        </div>

        <button className={styles.button} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className={styles.divider}>or</div>

      <button
        className={styles.googleButton}
        onClick={handleGoogleLogin}
        type="button"
      >
        <img src={googleLogo} alt="Google logo" className={styles.googleIcon} />
        Continue with Google
      </button>

      <div className={styles.accountPrompt}>
        <span className={styles.text}>Don't have an account? </span>
        <Link to="/signup" className={styles.Link}>
          Sign up
        </Link>
      </div>
    </div>
  );
}
