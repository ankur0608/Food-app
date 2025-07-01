import { useForm } from "react-hook-form";
import styles from "./Signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "./Store/theme.jsx";
import { FaRegUser } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { TbLockPassword } from "react-icons/tb";
import { supabase } from "../../supabaseClient.js";
import googleLogo from "../assets/google.png";

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

  // Your form submission for traditional signup
  async function onSubmit(data) {
    try {
      // console.log("📦 Sending signup data:", data);

      const response = await fetch(
        "https://food-app-d8r3.onrender.com/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      // console.log("✅ Server response:", result);

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

  // Google login handler
  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/google-redirect`, // ✅ MUST match Supabase dashboard
      },
    });

    if (error) {
      console.error("Google login error:", error.message);
      alert("Google sign-in failed");
    }
  };

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <h1 className={styles.heading}>Signup</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={styles.form}
      >
        {/* Username */}
        <div className={styles.inputGroup}>
          <label htmlFor="username" className={styles.label}>
            Username:
          </label>
          <FaRegUser className={styles.icon} />
          <input
            type="text"
            id="username"
            placeholder="Enter your name"
            className={styles.input}
            {...register("username", { required: "Username is required" })}
          />
          {errors.username && (
            <small className={styles.small}>{errors.username.message}</small>
          )}
        </div>

        {/* Email */}
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            Email:
          </label>
          <IoMailOutline className={styles.icon} />
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
          {errors.email && (
            <small className={styles.small}>{errors.email.message}</small>
          )}
        </div>

        {/* Mobile */}
        {/* <div className={styles.inputGroup}>
          <label htmlFor="mobile" className={styles.label}>
            Mobile Number:
          </label>
          <BsPhone className={styles.icon} />
          <input
            type="tel"
            id="mobile"
            placeholder="Enter 10-digit number"
            className={styles.input}
            {...register("mobile", {
              required: "Mobile number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Mobile number must be 10 digits",
              },
            })}
          />
          {errors.mobile && (
            <small className={styles.small}>{errors.mobile.message}</small>
          )}
        </div> */}

        {/* Password */}
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            Password:
          </label>
          <TbLockPassword className={styles.icon} />
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            className={styles.input}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters required",
              },
              maxLength: {
                value: 10,
                message: "Maximum 10 characters allowed",
              },
            })}
          />
          {errors.password && (
            <small className={styles.small}>{errors.password.message}</small>
          )}
        </div>

        <Link to="/login" className={styles.Link}>
          Already have an account?
        </Link>

        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Signup"}
        </button>
      </form>

      <div className={styles.divider}>OR</div>

      <button onClick={handleGoogleSignup} className={styles.googleButton}>
        <img src={googleLogo} alt="Google logo" className={styles.googleIcon} />
        Continue with Google
      </button>
    </div>
  );
}

export default Signup;
