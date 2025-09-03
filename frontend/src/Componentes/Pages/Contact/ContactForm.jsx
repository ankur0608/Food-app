"use client";
import styles from "./Contact.module.css";
import { useForm } from "react-hook-form";
import { FaRegUser } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { TbDeviceMobile } from "react-icons/tb";
import { LuCalendarDays, LuClock9 } from "react-icons/lu";
import { PiUsersThreeLight } from "react-icons/pi";
import { useTheme } from "../../Store/theme.jsx";
import { useToast } from "../../Store/ToastContext.jsx"; // import your toast context

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { theme } = useTheme();
  const { showToast } = useToast(); // ✅ get toast function

  const onSubmit = async (data) => {
    console.log("📦 Sending reservation data:", data);

    try {
      const response = await fetch(
        "https://food-app-d8r3.onrender.com/contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      console.log("📥 Server response:", result);

      if (!response.ok) {
        showToast(result.error || "Failed to submit", "error"); // ✅ toast error
        return;
      }

      showToast("Reservation submitted successfully!", "success"); // ✅ toast success
      reset();
    } catch (error) {
      console.error("🚨 Error submitting reservation:", error);
      showToast("Something went wrong. Please try again.", "error"); // ✅ toast error
    }
  };

  return (
    <div className={`${styles["contact-container"]} ${styles[theme]}`}>
      <h1>Make a Reservation</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["contact-form"]}
      >
        {/* First + Last Name */}
        <div className={styles["form-row"]}>
          <div className={styles["form-group"]}>
            <label>First Name</label>
            <div className={styles["input-wrapper"]}>
              <FaRegUser className={styles.icon} />
              <input
                type="text"
                placeholder="First Name"
                {...register("firstName", {
                  required: "First name is required",
                })}
                className={styles.input}
              />
            </div>
            {errors.firstName && (
              <p className={styles.error}>{errors.firstName.message}</p>
            )}
          </div>

          <div className={styles["form-group"]}>
            <label>Last Name</label>
            <div className={styles["input-wrapper"]}>
              <FaRegUser className={styles.icon} />
              <input
                type="text"
                placeholder="Last Name"
                {...register("lastName", { required: "Last name is required" })}
                className={styles.input}
              />
            </div>
            {errors.lastName && (
              <p className={styles.error}>{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className={styles["form-group"]}>
          <label>Email</label>
          <div className={styles["input-wrapper"]}>
            <IoMailOutline className={styles.icon} />
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email",
                },
              })}
              className={styles.input}
            />
          </div>
          {errors.email && (
            <p className={styles.error}>{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className={styles["form-group"]}>
          <label>Phone</label>
          <div className={styles["input-wrapper"]}>
            <TbDeviceMobile className={styles.icon} />
            <input
              type="tel"
              placeholder="Phone"
              {...register("phone", { required: "Phone number is required" })}
              className={styles.input}
            />
          </div>
          {errors.phone && (
            <p className={styles.error}>{errors.phone.message}</p>
          )}
        </div>

        {/* Date + Time */}
        <div className={styles["form-row"]}>
          <div className={styles["form-group"]}>
            <label>Date</label>
            <div className={styles["input-wrapper"]}>
              <LuCalendarDays className={styles.icon} />
              <input
                type="date"
                {...register("date", { required: "Date is required" })}
                className={styles.input}
              />
            </div>
            {errors.date && (
              <p className={styles.error}>{errors.date.message}</p>
            )}
          </div>

          <div className={styles["form-group"]}>
            <label>Time</label>
            <div className={styles["input-wrapper"]}>
              <LuClock9 className={styles.icon} />
              <input
                type="time"
                {...register("time", { required: "Time is required" })}
                className={styles.input}
              />
            </div>
            {errors.time && (
              <p className={styles.error}>{errors.time.message}</p>
            )}
          </div>
        </div>

        {/* Guests */}
        <div className={styles["form-group"]}>
          <label>Guests</label>
          <div className={styles["input-wrapper"]}>
            <PiUsersThreeLight className={styles.icon} />
            <input
              type="number"
              min="1"
              max="20"
              placeholder="Number of Guests"
              {...register("guests", { required: "Guest count is required" })}
              className={styles.input}
            />
          </div>
          {errors.guests && (
            <p className={styles.error}>{errors.guests.message}</p>
          )}
        </div>

        <button type="submit" className={styles.button}>
          Book Now
        </button>
      </form>
    </div>
  );
}
