import { useForm } from "react-hook-form";
import styles from "./Contact.module.css";
import { useTheme } from "../Store/theme.jsx";
function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { theme } = useTheme();
  function onSubmit(data) {
    console.log("FormData:", data);
    reset();
  }

  return (
    <>
      <div className={`${styles["contact-container"]} ${styles[theme]}`}>
        <h1>Contact Us</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["contact-form"]}
        >
          {/* First Name */}
          <div className={styles["form-group"]}>
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              placeholder="Enter your First Name"
              {...register("firstName", { required: "First name is required" })}
              className={styles.input}
            />
            {errors.firstName && (
              <p className={styles.error}>{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div className={styles["form-group"]}>
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              placeholder="Enter your Last Name"
              {...register("lastName", { required: "Last name is required" })}
              className={styles.input}
            />
            {errors.lastName && (
              <p className={styles.error}>{errors.lastName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className={styles["form-group"]}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Please enter a valid email",
                },
              })}
              className={styles.input}
            />
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
          </div>

          {/* Mobile Number */}
          <div className={styles["form-group"]}>
            <label htmlFor="mobile">Mobile Number</label>
            <input
              id="mobile"
              type="number"
              placeholder="Enter your Mobile Number"
              {...register("mobile", { required: "Mobile number is required" })}
              className={styles.input}
            />
            {errors.mobile && (
              <p className={styles.error}>{errors.mobile.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button type="submit" className={styles.button}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Contact;
