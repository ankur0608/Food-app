import styles from "./OpeningHours.module.css";
import { useTheme } from "./Store/theme";
export default function OpeningHours() {
  const { theme } = useTheme();
  return (
    <section className={`${styles.openingHoursSection} ${styles[theme]}`}>
      <h2 className={styles.heading}>Open Time</h2>
      <p className={styles.days}>Sunday – Friday</p>
      <div className={styles.hours}>
        <div className={styles.timeBlock}>
          <h3>Brunch</h3>
          <p>11:00 – 12:00</p>
        </div>
        <div className={styles.timeBlock}>
          <h3>Lunch</h3>
          <p>13:00 – 17:00</p>
        </div>
        <div className={styles.timeBlock}>
          <h3>Dinner</h3>
          <p>18:00 – 20:00</p>
        </div>
      </div>
    </section>
  );
}
