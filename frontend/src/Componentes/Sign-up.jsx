import { useForm } from "react-hook-form";
import styles from "./Signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "./Store/theme.jsx";
import { FaRegUser } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { TbLockPassword } from "react-icons/tb";
import googleLogo from "../assets/google.png";
import { supabase } from "../../supabaseClient.js";

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  const password = watch("password");
  const navigate = useNavigate();
  const { theme } = useTheme();

  async function onSubmit(data) {
    try {
      const response = await fetch(
        "https://food-app-d8r3.onrender.com/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Signup failed");
        return;
      }

      localStorage.setItem("token", result.token);
      navigate("/login");
    } catch (error) {
      console.error("❌ Network or server error:", error);
      alert("Something went wrong. Please try again.");
    }
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/google-redirect`,
      },
    });

    if (error) alert("Google login failed");
  };

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <h1 className={styles.heading}>Sign up</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={styles.form}
      >
        {/* Name */}
        <div className={styles.inputGroup}>
          <label htmlFor="name" className={styles.label}>
            <FaRegUser className={styles.icon} />
            Name
          </label>
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

        {/* Email */}
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            <IoMailOutline className={styles.icon} />
            Email
          </label>
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

        {/* Password */}
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            <TbLockPassword className={styles.icon} />
            Password
          </label>
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
                  "Password must be 8-15 chars, with uppercase, lowercase, number, special char & no spaces",
              },
            })}
          />
        </div>
        {errors.password && (
          <small className={styles.small}>{errors.password.message}</small>
        )}

        <Link to="/login" className={styles.Link}>
          Already have an account?
        </Link>

        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Signup"}
        </button>
      </form>

      <div className={styles.divider}>OR</div>

      <button onClick={handleGoogleLogin} className={styles.googleButton}>
        <img src={googleLogo} alt="Google logo" className={styles.googleIcon} />
        Continue with Google
      </button>
    </div>
  );
}

export default Signup;
