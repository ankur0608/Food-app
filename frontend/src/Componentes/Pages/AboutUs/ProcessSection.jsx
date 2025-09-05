import styles from "./AboutUs.module.css";
import ProcessStep from "./ProcessStep";

function ProcessSection({ steps }) {
  return (
    <section className={styles.processSection}>
      <h2 className={styles.heading}>Sophisticated Process</h2>
      <div className={styles.steps}>
        {steps.map((step, index) => (
          <ProcessStep key={step.number} step={step} reverse={index % 2 !== 0} />
        ))}
      </div>
    </section>
  );
}

export default ProcessSection;
