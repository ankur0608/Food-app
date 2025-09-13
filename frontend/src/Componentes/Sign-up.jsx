"use client";

import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../supabaseClient.js";
import { useTheme } from "./Store/theme.jsx";
import { useToast } from "./Store/ToastContext.jsx";
import googleLogo from "../assets/google.png";

// Icons
import { FaRegUser } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { TbLockPassword } from "react-icons/tb";

import styles from "./Signup.module.css";

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { showToast } = useToast();

  // ✅ Handle normal signup
  const onSubmit = async (data) => {
    try {
      const { name, email, password } = data;

      // Supabase signup with email+password
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }, // store user’s name in metadata
          emailRedirectTo: `${window.location.origin}/login?verified=true`,
        },
      });

      if (error) throw error;

      showToast("📧 Check your email to confirm your account!", "info");
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className={styles.form}
        >
          <h1 className={styles.heading}>Sign up</h1>

          {/* Name */}
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              Name
            </label>
            <div className={styles.inputWrapper}>
              <FaRegUser className={styles.icon} />
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                className={styles.input}
                {...register("name", { required: "Name is required" })}
              />
            </div>
            {errors.name && (
              <small className={styles.small}>{errors.name.message}</small>
            )}
          </div>

          {/* Email */}
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <div className={styles.inputWrapper}>
              <IoMailOutline className={styles.icon} />
              <input
                type="email"
                id="email"
                placeholder="Enter your Gmail address"
                className={styles.input}
                {...register("email", { required: "Email is required" })}
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
              <TbLockPassword className={styles.icon} />
              <input
                type="password"
                id="password"
                placeholder="Enter a strong password"
                className={styles.input}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "At least 8 characters required",
                  },
                })}
              />
            </div>
            {errors.password && (
              <small className={styles.small}>{errors.password.message}</small>
            )}
          </div>

          <Link to="/login" className={styles.Link}>
            Already have an account?
          </Link>

          <button
            type="submit"
            className={styles.button}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Signup"}
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
        <h2 className={styles.googleHeading}>Sign up with</h2>
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
