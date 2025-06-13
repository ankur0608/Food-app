import { useForm } from "react-hook-form";
import styles from "./Signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "./Store/theme.jsx";
import { FaRegUser } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { TbLockPassword } from "react-icons/tb";

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
      localStorage.setItem("signupData", JSON.stringify(data));
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        alert(result.error || "Signup failed");
        return;
      }
      localStorage.setItem("token", result.token);
      localStorage.setItem("justSignedUp", "true");
      navigate("/login");
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  }

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
          <label htmlFor="signup-username" className={styles.label}>
            Username:
          </label>
          <FaRegUser className={styles.icon} />
          <input
            className={styles.input}
            type="text"
            id="signup-username"
            placeholder="Username"
            {...register("username", { required: "Username is required" })}
          />
          {errors.username && (
            <small className={styles.small}>{errors.username.message}</small>
          )}
        </div>

        {/* Email */}
        <div className={styles.inputGroup}>
          <label htmlFor="signup-email" className={styles.label}>
            Email:
          </label>
          <IoMailOutline className={styles.icon} />
          <input
            className={styles.input}
            type="email"
            id="signup-email"
            placeholder="Your Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <small className={styles.small}>{errors.email.message}</small>
          )}
        </div>

        {/* Password */}
        <div className={styles.inputGroup}>
          <label htmlFor="signup-password" className={styles.label}>
            Password:
          </label>
          <TbLockPassword className={styles.icon} />
          <input
            className={styles.input}
            type="password"
            id="signup-password"
            placeholder="Password"
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

        {/* Confirm Password */}
        <div className={styles.inputGroup}>
          <label htmlFor="signup-confirmPassword" className={styles.label}>
            Confirm Password:
          </label>
          <TbLockPassword className={styles.icon} />
          <input
            className={styles.input}
            type="password"
            id="signup-confirmPassword"
            placeholder="Confirm Password"
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <small className={styles.small}>
              {errors.confirmPassword.message}
            </small>
          )}
        </div>

        <Link to="/login" className={styles.Link}>
          Already have an account?
        </Link>

        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default Signup;
