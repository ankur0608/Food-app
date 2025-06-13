import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import homeimage from "../../assets/home-image.jpeg";
import Slider from "../Slider/ProductSlider.jsx";
import { useTheme } from "../Store/theme.jsx";

function Home() {
  const { theme } = useTheme();

  return (
    <>
      <section className={`${styles.container} ${styles[theme]}`}>
        <div className={styles.leftContent}>
          <h1 className={styles.heading}>
            Welcome to <span className={styles.highlight}>Our Platform!</span>
          </h1>
          <p className={styles.paragraph}>
            Step into the vibrant world of
            <span className={styles.bold}>local melas and cultural fairs</span>
            all in one place!
            <br />
            From traditional crafts and festive foods to thrilling rides and
            live performances, there's something for everyone to enjoy.
          </p>
          <ul className={styles.features}>
            <li>
              <span className={styles.emoji}>🎪</span> Explore Cultural Heritage
            </li>
            <li>
              <span className={styles.emoji}>🛍️</span> Shop Unique Handicrafts &
              Local Goods
            </li>
            <li>
              <span className={styles.emoji}>🎉</span> Family-Friendly &
              Culturally Rich Events
            </li>
          </ul>
          <Link to="/meals" className={styles.button}>
            Order Now
          </Link>
        </div>
        <div className={styles.rightImage}>
          <img src={homeimage} alt="Cultural Fair" className={styles.image} />
        </div>
      </section>
      <section className={styles.sliderSection}>
        <Slider />
      </section>
    </>
  );
}

export default Home;
