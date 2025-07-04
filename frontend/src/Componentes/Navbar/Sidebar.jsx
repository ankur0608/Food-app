// Sidebar.jsx
import styles from "./Sidebar.module.css";
import { IoClose } from "react-icons/io5";

export default function Sidebar({ isOpen, onClose, children }) {
  return (
    <>
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <IoClose size={28} />
        </button>
        {children}
      </div>
      {isOpen && <div className={styles.backdrop} onClick={onClose} />}
    </>
  );
}
