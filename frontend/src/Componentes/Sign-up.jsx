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

  const BASE_URL = "https://food-app-d8r3.onrender.com";

  // ✅ Signup with email/password
  const onSubmit = async (data) => {
    try {
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: { full_name: data.name }, // store name in user_metadata
            emailRedirectTo: `${window.location.origin}/login?verified=true`,
          },
        });

      if (signUpError) {
        showToast(signUpError.message || "Signup failed", "error");
        return;
      }

      const user = signUpData.user;
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));

        // Optional: assign welcome coupon via backend
        try {
          await fetch(`${BASE_URL}/assign-new-user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: user.id,
              name: data.name,
              email: data.email,
            }),
          });
        } catch (err) {
          console.error("⚠️ Failed to assign coupon:", err);
        }
      }

      showToast(
        "🎉 Signup successful! Please check your email to verify your account.",
        "success"
      );

      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      console.error("❌ Signup error:", err);
      showToast("Something went wrong. Please try again.", "error");
    }
  };

  // ✅ Google signup/login
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/google-redirect` },
    });
    if (error) showToast("❌ Google signup/login failed", "error");
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
                {...register("name", {
                  required: "Name is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Name must contain only letters",
                  },
                })}
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
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                    message: "Only Gmail addresses allowed",
                  },
                })}
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
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?!.*\s).{8,15}$/,
                    message:
                      "8–15 chars, uppercase, lowercase, number & special char required",
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
