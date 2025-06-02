import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import fashionImg from "../../assets/react.svg";
import Slider from "../Slider/ProductSlider.jsx";
import { useTheme } from "../Store/theme.jsx";

function Home() {
  const { theme } = useTheme();

  return (
    <>
      <div className={`${styles.container} ${styles[theme]}`}>
        <div className={styles.leftContent}>
          <h1 className={styles.heading}>Welcome to Our Platform!</h1>
          <p className={styles.paragraph}>
            Step into the vibrant world of 
            <span> local melas and cultural fairs</span> — all in one place!
            From traditional crafts and festive foods to thrilling rides and
            live performances, there's something for everyone to enjoy.
          </p>
          <ul className={styles.features}>
            <li>🎪 Explore Cultural Heritage</li>
            <li>🛍️ Shop Unique Handicrafts & Local Goods</li>
            <li>🎉 Family-Friendly & Culturally Rich Events</li>
          </ul>

          <Link to="/meals" className={styles.button}>
            Order Now
          </Link>
        </div>
        <div className={styles.rightImage}>
          <img src={fashionImg} alt="Fashion" className={styles.image} />
        </div>
      </div>
      <Slider />
    </>
  );
}

export default Home;
