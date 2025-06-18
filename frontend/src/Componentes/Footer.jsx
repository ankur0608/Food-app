import styles from "./Footer.module.css";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaArrowUp,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <address className={styles.column}>
          <h2>Pragmatic Coders</h2>
          <p>Empowering your ideas through software.</p>
          <p>
            <FaMapMarkerAlt /> ul. Opolska 100, 31-323 Kraków, Poland
          </p>
          <p>
            <FaPhoneAlt /> <a href="tel:+91783871783">+91 783 871 783</a>
          </p>
          <div className={styles.contactEmail}>
            <FaEnvelope className={styles.icon} />
            <a href="mailto:contact@pragmaticcoders.com">
              contact@pragmaticcoders.com
            </a>
          </div>
        </address>

        <nav className={styles.column} aria-label="Quick Links">
          <h3>Quick Links</h3>
          <Link to="/home">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/meals">Meals</Link>
          <Link to="/contact">Contact Us</Link>
        </nav>

        <nav className={styles.column} aria-label="Useful Links">
          <h3>Useful Links</h3>
          <Link to="/PrivacyPolicy">Privacy Policy</Link>
          <Link to="/terms-of-use">Terms of Use</Link>
          <Link to="/sitemap">Sitemap</Link>
        </nav>
      </div>

      <section className={styles.socialSection} aria-label="Social Media">
        <h3>Follow Us</h3>
        <div className={styles.social}>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
          >
            <FaFacebook />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Twitter"
          >
            <FaTwitter />
          </a>
          <a
            href="https://www.linkedin.com/in/ankur-patel-86b65a35a"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
        </div>
      </section>

      <div className={styles.bottom}>
        <p>© 2025 Pragmatic Coders. All rights reserved.</p>
      </div>

      <button
        className={styles.scrollButton}
        onClick={() => {
          const root = document.getElementById("root");
          if (root && root.scrollTop > 0) {
            root.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
        aria-label="Back to Top"
      >
        <FaArrowUp /> Back to Top
      </button>
    </footer>
  );
}

export default Footer;
