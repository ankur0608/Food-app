import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "./Store/theme.jsx";
import { IoMailOutline } from "react-icons/io5";
import { TbLockPassword } from "react-icons/tb";
import googleLogo from "../assets/google.png";
import { supabase } from "../../supabaseClient.js";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();
  const { theme } = useTheme();
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(data) {
    setErrorMsg("");
    try {
      const response = await fetch("https://food-app-d8r3.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        setErrorMsg(result.message || "Login failed");
        return;
      }
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.removeItem("justSignedUp");
      navigate("/"); // Redirect to home
    } catch (error) {
      setErrorMsg("Something went wrong. Please try again.");
    }
  }

  // Google login handler
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/google-redirect",
      },
    });
    if (error) setErrorMsg("Google login failed");
  };

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <h2 className={styles.heading}>Login</h2>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputGroup}>
          <span className={styles.icon}><IoMailOutline /></span>
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
            autoComplete="username"
          />
          {errors.email && <small className={styles.small}>{errors.email.message}</small>}
        </div>
        <div className={styles.inputGroup}>
          <span className={styles.icon}><TbLockPassword /></span>
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
            autoComplete="current-password"
          />
          {errors.password && <small className={styles.small}>{errors.password.message}</small>}
        </div>
        {errorMsg && <div className={styles.small}>{errorMsg}</div>}
        <button className={styles.button} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className={styles.divider}>or</div>
      <button onClick={handleGoogleLogin} className={styles.googleButton} type="button">
        <img src={googleLogo} alt="Google logo" className={styles.googleIcon} />
        Continue with Google
      </button>
      <div className={styles.accountPrompt}>
        <span className={styles.text}>Don't have an account? </span>
        <Link to="/signup" className={styles.Link}>Sign up</Link>
      </div>
    </div>
  );
}
