import styles from "./AboutUs.module.css";

function TeamMember({ name, title, description, image, reverse = false }) {
  return (
    <section className={`${styles.heroSection} ${reverse ? styles.reverse : ""}`}>
      {image && (
        <div className={styles.imageWrapper}>
          <img
            src={image}
            alt={title}
            className={styles.image}
            loading="lazy"
            decoding="async"
            width="600"
            height="400"
            srcSet={`${image}?w=400 400w, ${image}?w=800 800w`}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}
      <div className={styles.text}>
        <h3>{title}</h3>
        <p className={styles.managerName}>{name}</p>
        <p>{description}</p>
      </div>
    </section>
  );
}

export default TeamMember;
