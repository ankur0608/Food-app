import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import styles from "./Signup.module.css";
import Modal from "./Modal";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "./Store/theme.jsx";
export default function Login() {
  const modalRef = useRef();
  const [modalOpen, setModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { theme } = useTheme();
  async function onSubmit(data) {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    try {
      if (!response.ok) {
        alert(result.error || "Login failed");
        return;
      }

      console.log("Login success:", result);
      localStorage.setItem("token", result.token);
      localStorage.removeItem("justSignedUp");

      modalRef.current.open();
      setModalOpen(true);
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Something went wrong. Please try again.");
    }
  }
  const handleModalClose = () => {
    setModalOpen(false);
    navigate("/Home");
  };
  return (
    <>
      <Modal
        ref={modalRef}
        buttonCaption="Okay"
        onModalclose={handleModalClose}
      >
        <h1>Login successful!</h1>
        <h2>Welcome</h2>
      </Modal>
      <div className={theme}>
        <div
          className={`${styles.container} ${modalOpen ? styles.blurred : ""}`}
        >
          <h1 className={styles.heading}>Login</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className={styles.form}
          >
            <div>
              <label htmlFor="login-email" className={styles.label}>
                Email:
              </label>
              <input
                className={styles.input}
                type="email"
                id="login-email"
                placeholder="Your Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    message: "",
                  },
                })}
              />
              {errors.email && (
                <small className={styles.small}>{errors.email.message}</small>
              )}
            </div>
            <div>
              <label htmlFor="login-password" className={styles.label}>
                Password:
              </label>
              <input
                className={styles.input}
                type="password"
                id="login-password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {errors.password && (
                <small className={styles.small}>{errors.password.message}</small>
              )}
            </div>
            <Link to="/ForgotPassword" className={styles.Link}>
              Forgot Password
            </Link>
            <div>
              <button type="submit" className={styles.button}>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
