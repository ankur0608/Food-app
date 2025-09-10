import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoMailOutline } from "react-icons/io5";
import { TbLockPassword } from "react-icons/tb";

import styles from "./Login.module.css";
import { useTheme } from "./Store/theme.jsx";
import { supabase } from "../../supabaseClient.js";
import { useToast } from "./Store/ToastContext.jsx";
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
  const { showToast } = useToast();

  const BASE_URL = "https://food-app-d8r3.onrender.com";

  // ✅ Handle redirect after email verification
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get("verified") === "true") {
      // Supabase might auto-login → force logout to require manual login
      supabase.auth.signOut().then(() => {
        showToast("✅ Email verified successfully! Please login.", "success");
      });
    }
  }, [location.search, showToast]);

  // ✅ Login with email + password
  const onSubmit = async (data) => {
    try {
      const { data: sessionData, error } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (error) {
        showToast(`${error.message || "Login failed"}`, "error");
        return;
      }

      const user = sessionData.user;
      localStorage.setItem("user", JSON.stringify(user));
      showToast("🎉 Login successful!", "success");

      // ✅ Assign new-user coupon
      try {
        await fetch(`${BASE_URL}/assign-new-user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            name: user.user_metadata?.full_name || "Guest",
            email: user.email,
          }),
        });
      } catch (err) {
        console.error("Failed to assign coupon:", err);
      }

      setTimeout(() => navigate("/"), 500);
    } catch {
      showToast("❌ Something went wrong. Please try again.", "error");
    }
  };

  // ✅ Google login
  const handleGoogleLogin = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/google-redirect` },
    });

    if (error) return showToast("❌ Google login failed", "error");

    if (user) {
      try {
        await fetch(`${BASE_URL}/assign-new-user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            name: user.user_metadata?.full_name || "Guest",
            email: user.email,
          }),
        });
      } catch (err) {
        console.error("Failed to assign coupon:", err);
      }
    }
  };

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      {/* Left side: form */}
      <div className={styles.formSide}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <h1 className={styles.heading}>Login</h1>

          {/* Email */}
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <div className={styles.inputWrapper}>
              <IoMailOutline className={styles.inputIcon} />
              <input
                id="email"
                className={styles.input}
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required" })}
                autoComplete="username"
              />
            </div>
            {errors.email && (
              <small className={styles.small}>{errors.email.message}</small>
            )}
          </div>

          {/* Password */}
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.inputWrapper}>
              <TbLockPassword className={styles.inputIcon} />
              <input
                id="password"
                className={styles.input}
                type="password"
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
                autoComplete="current-password"
              />
            </div>
            {errors.password && (
              <small className={styles.small}>{errors.password.message}</small>
            )}
          </div>

          <Link to="/forgotpassword" className={styles.Link}>
            Forgot password?
          </Link>
          <Link to="/signup" className={styles.Link2}>
            Don’t have an account?
          </Link>

          <button
            className={styles.button}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          {/* Mobile Google button */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className={`${styles.googleButton} ${styles.mobileGoogle}`}
          >
            <img
              src={googleLogo}
              alt="Google logo"
              className={styles.googleIcon}
            />
            Continue with Google
          </button>
        </form>
      </div>

      {/* Right side: Google login (desktop only) */}
      <div className={styles.rightSide}>
        <h2 className={styles.googleHeading}>Login with</h2>
        <button
          onClick={handleGoogleLogin}
          type="button"
          className={styles.googleButton}
        >
          <img
            src={googleLogo}
            alt="Google logo"
            className={styles.googleIcon}
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
