import { useForm } from "react-hook-form";
import Input from "./Input";
import { useRef, useState } from "react";
import styles from "./Signup.module.css";
import Modal from "./Modal.jsx";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const modalRef = useRef();
  const [modalOpen, setModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  const password = watch("password");
  const navigate = useNavigate();
  async function onSubmit(data) {
    console.log("Signup Data:", data);
    localStorage.setItem("signupData", JSON.stringify(data));
    const response = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    try {
      if (!response.ok) {
        alert(result.error || "Signup failed");
        return;
      }

      console.log("Signup success:", result);
      localStorage.setItem("token", result.token);
      localStorage.setItem("justSignedUp", "true");
      modalRef.current.open();
      setModalOpen(true);
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Something went wrong. Please try again.");
    }
  }

  function handleModalClose() {
    setModalOpen(false);
    navigate("/login");
  }
  return (
    <>
      <Modal
        ref={modalRef}
        buttonCaption="Okay"
        onModalclose={handleModalClose}
      >
        <h1 style={{ color: "Green", fontWeight: "bold" }}>
          Signup successful!
        </h1>
        <h2>Welcome</h2>
      </Modal>
      <div>
        <div
          className={`${styles.container} ${modalOpen ? styles.blurred : ""}`}
        >
          <h1 className={styles.heading}>Signup</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className={styles.form}
          >
            <div>
              <Input
                className={styles.input}
                type="text"
                name="username"
                label="Username :"
                placeholder="Username"
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && (
                <small className={styles.small}>
                  {errors.username.message}
                </small>
              )}
            </div>
            <div>
              <Input
                className={styles.input}
                type="email"
                label="Email :"
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
              <Input
                className={styles.input}
                type="password"
                label="Password :"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "minimum 6 number is required.",
                  },
                  maxLength: { value: 10, message: "maximum 10 number." },
                })}
              />
              {errors.password && (
                <small className={styles.small}>
                  {errors.password.message}
                </small>
              )}
            </div>
            <Input
              className={styles.input}
              type="password"
              label="Confirm Password :"
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
            <Link to="/Login" className={styles.Link}>
              Already have an Account
            </Link>
            <div>
              <button
                type="submit"
                className={styles.button}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
