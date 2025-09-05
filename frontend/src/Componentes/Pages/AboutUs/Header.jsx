import styles from "./AboutUs.module.css";

function Header({ title }) {
  return (
    <header className={styles.header}>
      <h1 className={styles.heading}>{title}</h1>
    </header>
  );
}

export default Header;
