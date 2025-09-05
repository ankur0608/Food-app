import styles from "./AboutUs.module.css";

function HeroSection({ title, description, image, priority = false }) {
  return (
    <section className={styles.heroSection}>
      <div className={styles.text}>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className={styles.imageWrapper}>
        <img
          src={image}
          alt={title}
          className={styles.image}
          {...(priority
            ? { fetchpriority: "high", decoding: "async" }
            : { loading: "lazy", decoding: "async" })}
          width="600"
          height="400"
          srcSet={`${image}?w=400 400w, ${image}?w=800 800w`}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </section>
  );
}

export default HeroSection;
