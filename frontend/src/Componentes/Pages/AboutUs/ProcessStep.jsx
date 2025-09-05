import styles from "./AboutUs.module.css";

function ProcessStep({ step, reverse }) {
  return (
    <div
      className={`${styles.stepItem} ${reverse ? styles.reverseStep : ""}`}
      style={{ contentVisibility: "auto", containIntrinsicSize: "400px" }}
    >
      <div className={styles.stepImageWrapper}>
        <img
          src={step.image}
          alt={step.title}
          className={styles.stepImage}
          loading="lazy"
          decoding="async"
          width="600"
          height="400"
          srcSet={`${step.image}?w=400 400w, ${step.image}?w=800 800w`}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className={styles.stepContent}>
        <span className={styles.stepNumber}>{step.number}</span>
        <h3 className={styles.stepTitle}>{step.title}</h3>
        <p className={styles.stepDescription}>{step.description}</p>
      </div>
    </div>
  );
}

export default ProcessStep;
