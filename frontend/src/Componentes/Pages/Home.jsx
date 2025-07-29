import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import homeimage from "../../assets/bg (1).png";
import Slider from "../Slider/ProductSlider.jsx";
import { useTheme } from "../Store/theme.jsx";
import { FaLeaf, FaCarrot, FaAppleAlt, FaDrumstickBite } from "react-icons/fa";

function Home() {
  const { theme } = useTheme();

  return (
    <>
      <div className={styles.rightImage}>
        <img src={homeimage} alt="Cultural Fair" className={styles.image} />
      </div>
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
          <div className={styles.btnbar}>
            <Link to="/meals" className={styles.button}>
              Explorer Menu
            </Link>
            <Link to="/contact" className={styles.buttonTable}>
              Book A Table
            </Link>
          </div>
        </div>
      </section>{" "}
      <section className={styles.featuresSection}>
        <h2 className={styles.title}>Why Choose Us?</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <FaLeaf className={styles.icon} />
            <h3 className={styles.text}>Premium Quality</h3>
            <p className={styles.text}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque
              congue arcu.
            </p>
          </div>

          <div className={styles.card}>
            <FaCarrot className={styles.iconVegetables} />
            <h3 className={styles.text}>Seasonal Vegetables</h3>
            <p className={styles.text}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque
              congue arcu.
            </p>
          </div>

          <div className={styles.card}>
            <FaAppleAlt className={styles.iconFruit} />
            <h3 className={styles.text}>Fresh Fruit</h3>
            <p className={styles.text}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque
              congue arcu.
            </p>
          </div>

          <div className={styles.card}>
            <FaDrumstickBite className={styles.iconnon} />
            <h3 className={styles.text}>Non-Vegetarian Delights</h3>
            <p className={styles.text}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque
              congue arcu.
            </p>
          </div>
        </div>
      </section>
      <section className={styles.sliderSection}>
        <Slider />
      </section>
    </>
  );
}

export default Home;
