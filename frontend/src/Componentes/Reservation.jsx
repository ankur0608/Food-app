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

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.row}>
          {/* Date */}
          <div className={styles.group}>
            <label>Date</label>
            <div className={styles.inputWrapper}>
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

          {/* Time */}
          <div className={styles.group}>
            <label>Time</label>
            <div className={styles.inputWrapper}>
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

          {/* Guests */}
          <div className={styles.group}>
            <label>Guests</label>
            <div className={styles.inputWrapper}>
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
        </div>

        <button type="submit" className={styles.button}>
          Reserve
        </button>
      </form>
    </div>
  );
}
