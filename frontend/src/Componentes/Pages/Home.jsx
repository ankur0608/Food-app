import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import homeimage from "../../assets/home-image.jpeg";
import Slider from "../Slider/ProductSlider.jsx";
import { useTheme } from "../Store/theme.jsx";
import { FaLeaf, FaCarrot, FaAppleAlt, FaDrumstickBite } from "react-icons/fa";

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

        <section className={styles.featuresSection}>
          <h2 className={styles.title}>Why Choose Us?</h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <FaLeaf className={styles.icon} />
              <h3>Premium Quality</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque
                congue arcu.
              </p>
            </div>

            <div className={styles.card}>
              <FaCarrot className={styles.icon} />
              <h3>Seasonal Vegetables</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque
                congue arcu.
              </p>
            </div>

            <div className={styles.card}>
              <FaAppleAlt className={styles.icon} />
              <h3>Fresh Fruit</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque
                congue arcu.
              </p>
            </div>

            <div className={styles.card}>
              <FaDrumstickBite className={styles.icon} />
              <h3>Non-Vegetarian Delights</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque
                congue arcu.
              </p>
            </div>
          </div>
        </section>
      </section>
      <section className={styles.sliderSection}>
        <Slider />
      </section>
    </>
  );
}

export default Home;
