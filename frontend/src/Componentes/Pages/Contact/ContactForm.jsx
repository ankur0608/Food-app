"use client";
import { useCallback, useState } from "react";
import styles from "./Contact.module.css";
import { useForm } from "react-hook-form";
import { FaRegUser } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { TbDeviceMobile } from "react-icons/tb";
import { LuCalendarDays, LuClock9 } from "react-icons/lu";
import { PiUsersThreeLight } from "react-icons/pi";
import { useTheme } from "../../Store/theme.jsx";
import { useToast } from "../../Store/ToastContext.jsx";

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { theme } = useTheme();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = useCallback(
    async (data) => {
      setLoading(true);
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
          showToast(result.error || "Failed to submit", "error");
          setLoading(false);
          return;
        }

        showToast("Reservation submitted successfully!", "success");
        reset();
        setSubmitted(true); // Show success message
      } catch (error) {
        console.error("🚨 Error submitting reservation:", error);
        showToast("Something went wrong. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    },
    [reset, showToast]
  );

  return (
    <div className={`${styles["contact-container"]} ${styles[theme]}`}>
      <h2>Make a Reservation</h2>
      <p className={styles.subtitle}>
        Reserve your table quickly and easily. Fill in the details below and
        we’ll confirm your booking.
      </p>

      {submitted ? (
        <div className={styles.successMessage}>
          🎉 Thank you! Your reservation has been received.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["contact-form"]}
        >
          {/* First + Last Name */}
          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label htmlFor="firstName">First Name</label>
              <div className={styles["input-wrapper"]}>
                <FaRegUser className={styles.icon} />
                <input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  autoComplete="given-name"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  className={`${styles.input} ${
                    errors.firstName ? styles.errorInput : ""
                  }`}
                />
              </div>
              {errors.firstName && (
                <p className={styles.error}>{errors.firstName.message}</p>
              )}
            </div>

            <div className={styles["form-group"]}>
              <label htmlFor="lastName">Last Name</label>
              <div className={styles["input-wrapper"]}>
                <FaRegUser className={styles.icon} />
                <input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  autoComplete="family-name"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  className={`${styles.input} ${
                    errors.lastName ? styles.errorInput : ""
                  }`}
                />
              </div>
              {errors.lastName && (
                <p className={styles.error}>{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className={styles["form-group"]}>
            <label htmlFor="email">Email</label>
            <div className={styles["input-wrapper"]}>
              <IoMailOutline className={styles.icon} />
              <input
                id="email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email",
                  },
                })}
                className={`${styles.input} ${
                  errors.email ? styles.errorInput : ""
                }`}
              />
            </div>
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className={styles["form-group"]}>
            <label htmlFor="phone">Phone</label>
            <div className={styles["input-wrapper"]}>
              <TbDeviceMobile className={styles.icon} />
              <input
                id="phone"
                type="tel"
                placeholder="Phone"
                autoComplete="tel"
                {...register("phone", { required: "Phone number is required" })}
                className={`${styles.input} ${
                  errors.phone ? styles.errorInput : ""
                }`}
              />
            </div>
            {errors.phone && (
              <p className={styles.error}>{errors.phone.message}</p>
            )}
          </div>

          {/* Date + Time */}
          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label htmlFor="date">Date</label>
              <div className={styles["input-wrapper"]}>
                <LuCalendarDays className={styles.icon} />
                <input
                  id="date"
                  type="date"
                  autoComplete="off"
                  {...register("date", { required: "Date is required" })}
                  className={`${styles.input} ${
                    errors.date ? styles.errorInput : ""
                  }`}
                />
              </div>
              {errors.date && (
                <p className={styles.error}>{errors.date.message}</p>
              )}
            </div>

            <div className={styles["form-group"]}>
              <label htmlFor="time">Time</label>
              <div className={styles["input-wrapper"]}>
                <LuClock9 className={styles.icon} />
                <input
                  id="time"
                  type="time"
                  autoComplete="off"
                  {...register("time", { required: "Time is required" })}
                  className={`${styles.input} ${
                    errors.time ? styles.errorInput : ""
                  }`}
                />
              </div>
              {errors.time && (
                <p className={styles.error}>{errors.time.message}</p>
              )}
            </div>
          </div>

          {/* Guests */}
          <div className={styles["form-group"]}>
            <label htmlFor="guests">Guests</label>
            <div className={styles["input-wrapper"]}>
              <PiUsersThreeLight className={styles.icon} />
              <input
                id="guests"
                type="number"
                min="1"
                max="20"
                placeholder="Number of Guests"
                autoComplete="off"
                {...register("guests", { required: "Guest count is required" })}
                className={`${styles.input} ${
                  errors.guests ? styles.errorInput : ""
                }`}
              />
            </div>
            {errors.guests && (
              <p className={styles.error}>{errors.guests.message}</p>
            )}
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Booking..." : "Book Now"}
          </button>
        </form>
      )}
    </div>
  );
}
