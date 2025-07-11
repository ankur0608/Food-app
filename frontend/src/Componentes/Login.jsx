import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoMailOutline } from "react-icons/io5";
import { TbLockPassword } from "react-icons/tb";

import styles from "./Login.module.css";
import { useTheme } from "./Store/theme.jsx";
import { supabase } from "../../supabaseClient.js";
import Toast from "./Toast.jsx";
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

  const [errorMsg, setErrorMsg] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get("verified") === "true") {
      setToast({ message: "✅ Email verified successfully!", type: "success" });
    }
  }, [location.search]);

  const onSubmit = async (data) => {
    setErrorMsg("");

    try {
      const { data: sessionData, error } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (error) {
        setErrorMsg(error.message || "Login failed");
        return;
      }

      localStorage.setItem("user", JSON.stringify(sessionData.user));
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/google-redirect`,
      },
    });

    if (error) {
      setToast({ message: "❌ Google login failed", type: "error" });
    }
  };

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <h2 className={styles.heading}>Login</h2>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            <IoMailOutline className={styles.icon} />
            Email
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
            <TbLockPassword className={styles.icon} />
            Password
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
        onClick={handleGoogleLogin}
        className={styles.googleButton}
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
