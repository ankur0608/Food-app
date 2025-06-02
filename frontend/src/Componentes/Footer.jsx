import styles from "./Footer.module.css";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.grid}>
          <div className={styles.column}>
            <h2>Pragmatic Coders</h2>
            <p>Empowering your ideas through software.</p>
            <p>
              <FaMapMarkerAlt /> ul. Opolska 100, 31-323 Kraków, Poland
            </p>
            <p>
              <FaPhoneAlt /> +91 783 871 783
            </p>
            <div className={styles.contactEmail}>
              <FaEnvelope className={styles.icon} />
              <a href="mailto:contact@pragmaticcoders.com">
                contact@pragmaticcoders.com
              </a>
            </div>
          </div>

          <div className={styles.column}>
            <h3>Quick Links</h3>
            <Link to="/home">Home</Link>
            <Link to="about">About</Link>
            <Link to="/meals">Meals</Link>

            <Link to="/contact">Contact Us</Link>
          </div>

          <div className={styles.column}>
            <h3>Useful Links</h3>
            <Link to="/PrivacyPolicy">Privacy Policy</Link>
            <Link to="/terms-of-use">Terms of Use</Link>
            <Link to="/sitemap">Sitemap</Link>
          </div>
        </div>

        <div className={styles.socialSection}>
          <h3>Follow Us</h3>
          <div className={styles.social}>
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <FaFacebook />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <FaLinkedin />
            </a>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>© 2025 Pragmatic Coders. All rights reserved.</p>
        </div>

        <button
          className={styles.scrollButton}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <FaArrowUp /> Back to Top
        </button>
      </footer>
    </>
  );
}

export default Footer;
