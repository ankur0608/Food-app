import { useForm } from "react-hook-form";
import styles from "./Contact.module.css";
import { useTheme } from "../Store/theme.jsx";
import { FaRegUser } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { TbDeviceMobile } from "react-icons/tb";
import { LuCalendarDays } from "react-icons/lu"; // for Date
import { LuClock9 } from "react-icons/lu"; // for Time
import { PiUsersThreeLight } from "react-icons/pi"; // for Guests

function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { theme } = useTheme();

  const onSubmit = async (data) => {
    console.log("📦 Sending reservation data:", data); // DEBUG

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
        alert(result.error || "Failed to submit");
        return;
      }

      alert("Reservation submitted successfully!");
      reset();
    } catch (error) {
      console.error("🚨 Error submitting reservation:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <div className={`${styles["contact-container"]} ${styles[theme]}`}>
        <h1>Make a Reservation</h1>
        {/* <p>Get in touch with the restaurant</p> */}

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
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
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
    </>
  );
}

export default Contact;
