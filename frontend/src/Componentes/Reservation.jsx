import { useForm } from "react-hook-form";
import styles from "./Reservation.module.css";
import { useTheme } from "./Store/theme";
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

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.row}>
          {/* Date */}
          <div className={styles.group}>
            <label>Date</label>
            <input
              type="date"
              {...register("date", { required: "Date is required" })}
              className={styles.input}
            />
            {errors.date && (
              <p className={styles.error}>{errors.date.message}</p>
            )}
          </div>

          {/* Time */}
          <div className={styles.group}>
            <label>Time</label>
            <input
              type="time"
              {...register("time", { required: "Time is required" })}
              className={styles.input}
            />
            {errors.time && (
              <p className={styles.error}>{errors.time.message}</p>
            )}
          </div>

          {/* Guests */}
          <div className={styles.group}>
            <label>Guests</label>
            <input
              type="number"
              min="1"
              max="20"
              placeholder="Number of Guests"
              {...register("guests", { required: "Guest count is required" })}
              className={styles.input}
            />
            {errors.guests && (
              <p className={styles.error}>{errors.guests.message}</p>
            )}
          </div>
        </div>

        <button type="submit" className={styles.button}>
          Reserve
        </button>
      </form>
    </div>
  );
}
