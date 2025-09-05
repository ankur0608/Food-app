import { useForm } from "react-hook-form";
import styles from "./Reservation.module.css";
import { useTheme } from "./Store/theme";
import { LuCalendarDays, LuClock9 } from "react-icons/lu";
import { PiUsersThreeLight } from "react-icons/pi";

export default function Reservation() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { theme } = useTheme();

  function onSubmit(data) {
    console.log("Form Data:", data);
    reset();
  }

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <h1 className={styles.title}>Make Reservation</h1>
      <p className={styles.subtitle}>Get in touch with the restaurant</p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.form}
        aria-label="Reservation form"
      >
        <div className={styles.row}>
          {/* Date */}
          <div className={styles.group}>
            <label htmlFor="date">Date</label>
            <div className={styles.inputWrapper}>
              <LuCalendarDays className={styles.icon} aria-hidden="true" />
              <input
                id="date"
                type="date"
                aria-label="Select reservation date"
                {...register("date", { required: "Date is required" })}
                className={styles.input}
              />
            </div>
            {errors.date && (
              <p role="alert" className={styles.error}>
                {errors.date.message}
              </p>
            )}
          </div>

          {/* Time */}
          <div className={styles.group}>
            <label htmlFor="time">Time</label>
            <div className={styles.inputWrapper}>
              <LuClock9 className={styles.icon} aria-hidden="true" />
              <input
                id="time"
                type="time"
                aria-label="Select reservation time"
                {...register("time", { required: "Time is required" })}
                className={styles.input}
              />
            </div>
            {errors.time && (
              <p role="alert" className={styles.error}>
                {errors.time.message}
              </p>
            )}
          </div>

          {/* Guests */}
          <div className={styles.group}>
            <label htmlFor="guests">Guests</label>
            <div className={styles.inputWrapper}>
              <PiUsersThreeLight className={styles.icon} aria-hidden="true" />
              <input
                id="guests"
                type="number"
                min="1"
                max="20"
                placeholder="Number of Guests"
                aria-label="Enter number of guests"
                {...register("guests", { required: "Guest count is required" })}
                className={styles.input}
              />
            </div>
            {errors.guests && (
              <p role="alert" className={styles.error}>
                {errors.guests.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className={styles.button}
          aria-label="Submit reservation"
        >
          Reserve
        </button>
      </form>
    </div>
  );
}
