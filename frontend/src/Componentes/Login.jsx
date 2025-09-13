"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoMailOutline } from "react-icons/io5";
import { TbLockPassword } from "react-icons/tb";
import { supabase } from "../../supabaseClient.js";
import { useTheme } from "./Store/theme.jsx";
import { useToast } from "./Store/ToastContext.jsx";
import googleLogo from "../assets/google.png";
import styles from "./Login.module.css";

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

  // ✅ Handle redirect after email verification
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get("verified") === "true") {
      supabase.auth.signOut().then(() => {
        showToast("✅ Email verified successfully! Please login.", "success");
      });
    }
  }, [location.search, showToast]);

  // ✅ Handle normal login
  const onSubmit = async (data) => {
    try {
      const { email, password } = data;

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      showToast("🎉 Logged in successfully!", "success");
      navigate("/"); // redirect to homepage
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  // ✅ Handle Google login
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`, // redirect back to app
        },
      });
      if (error) throw error;
    } catch (error) {
      showToast(error.message, "error");
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

      {/* Right side: Google login (desktop) */}
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
