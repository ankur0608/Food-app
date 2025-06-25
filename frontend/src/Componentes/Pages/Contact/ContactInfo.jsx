import styles from "./ContactInfo.module.css";
import Conteact1 from "../../../assets/conteact1.png";
import Conteact2 from "../../../assets/conteact2.png";
import { useTheme } from "../../Store/theme";
export default function ContactInfo() {
  const { theme } = useTheme();
  return (
    <>
      <div className={`${styles["mainheader"]}  ${styles[theme]}`}>
        <h1>Get in Touch With Us</h1>
      </div>
      <section className={`${styles["contactSection"]} ${styles[theme]}`}>
        <div className={styles.infoBlock}>
          <img src={Conteact1} alt="Decorated table" className={styles.image} />
          <div className={styles.contactText}>
            <p>
              We can be contacted via <br />
              email <a href="mailto:info@foodzero.com">info@foodzero.com</a>
              <br />
              or telephone on <a href="tel:+48652346000">+48 652 346 000</a>
            </p>
          </div>
        </div>
        <div className={styles.infoBlock}>
          <img
            src={Conteact2}
            alt="Restaurant exterior"
            className={styles.image2}
          />
          <div className={styles.addressText}>
            <p>We are located in 1959 Sepulveda Blvd. Culver City, CA. 90230</p>
            <button className={styles.mapButton}>View in maps</button>
          </div>
        </div>
      </section>
    </>
  );
}
