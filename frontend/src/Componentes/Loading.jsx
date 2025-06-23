// src/components/LoadingSpinner.jsx
import styles from "../Componentes/Loading.module.css";

export default function LoadingSpinner() {
  return (
    <div className={styles.spinnerWrapper}>
      <div className={styles.loader}></div>
    </div>
  );
}
