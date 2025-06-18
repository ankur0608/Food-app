import { useForm } from "react-hook-form";
import styles from "./Contact.module.css";
import { useTheme } from "../Store/theme.jsx";
import { FaRegUser } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { TbDeviceMobile } from "react-icons/tb";

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
    <div className={`${styles["contact-container"]} ${styles[theme]}`}>
      <h1>Contact Us</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["contact-form"]}
      >
        {/* First Name */}
        <div className={styles["form-group"]}>
          <label htmlFor="firstName">First Name</label>
          <div className={styles["input-wrapper"]}>
            <FaRegUser className={styles.icon} />
            <input
              id="firstName"
              type="text"
              placeholder="Enter your First Name"
              {...register("firstName", { required: "First name is required" })}
              className={styles.input}
            />
          </div>
          {errors.firstName && (
            <p className={styles.error}>{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div className={styles["form-group"]}>
          <label htmlFor="lastName">Last Name</label>
          <div className={styles["input-wrapper"]}>
            <FaRegUser className={styles.icon} />
            <input
              id="lastName"
              type="text"
              placeholder="Enter your Last Name"
              {...register("lastName", { required: "Last name is required" })}
              className={styles.input}
            />
          </div>
          {errors.lastName && (
            <p className={styles.error}>{errors.lastName.message}</p>
          )}
        </div>

        {/* Email */}
        <div className={styles["form-group"]}>
          <label htmlFor="email">Email</label>
          <div className={styles["input-wrapper"]}>
            <IoMailOutline className={styles.icon} />
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
          </div>
          {errors.email && (
            <p className={styles.error}>{errors.email.message}</p>
          )}
        </div>

        {/* Mobile Number */}
        <div className={styles["form-group"]}>
          <label htmlFor="mobile">Mobile Number</label>
          <div className={styles["input-wrapper"]}>
            <TbDeviceMobile className={styles.icon} />
            <input
              id="mobile"
              type="number"
              placeholder="Enter your Mobile Number"
              {...register("mobile", {
                required: "Mobile number is required",
              })}
              className={styles.input}
            />
          </div>
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
  );
}

export default Contact;
