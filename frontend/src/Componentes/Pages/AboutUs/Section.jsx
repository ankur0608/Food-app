import styles from "./AboutUs.module.css";

function Section({ title, children, customClass }) {
  return (
    <section
      className={`${styles.section} ${customClass || ""}`}
      style={{ contentVisibility: "auto", containIntrinsicSize: "500px" }}
    >
      <h2 className={styles.subheading}>{title}</h2>
      {children}
    </section>
  );
}

export default Section;
