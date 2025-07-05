import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "./Store/theme.jsx";
import { IoMailOutline } from "react-icons/io5";
import { TbLockPassword } from "react-icons/tb";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();
  const { theme } = useTheme();

  async function onSubmit(data) {
    try {
      const response = await fetch("https://food-app-d8r3.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Login failed");
        return;
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.removeItem("justSignedUp");
    } catch (error) {
      console.error("🔥 Network or server error:", error);
      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <>
      <div
        className={`${styles.container} ${modalOpen ? styles.blurred : ""} ${
          styles[theme]
        }`}
      >
        <h1 className={styles.heading}>Login</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className={styles.form}
        >
          {/* Email */}
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              <IoMailOutline className={styles.icon} />
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className={styles.input}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
            />
          </div>
          {errors.email && (
            <small className={styles.small}>{errors.email.message}</small>
          )}

          {/* Password */}
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              <TbLockPassword className={styles.icon} />
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className={styles.input}
              {...register("password", {
                required: "Password is required",
              })}
            />
          </div>
          {errors.password && (
            <small className={styles.small}>{errors.password.message}</small>
          )}

          <Link to="/ForgotPassword" className={styles.Link}>
            Forgot Password?
          </Link>

          <button
            type="submit"
            className={styles.button}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          <div className={styles.accountPrompt}>
            <span className={styles.text}>Don't have an account? </span>
            <Link to="/signup" className={styles.Link}>
              Signup
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
