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
  const handleScrollTop = () => {
    const root = document.getElementById("root");
    const target = root?.scrollTop > 0 ? root : window;
    target.scrollTo({ top: 0, behavior: "smooth" });
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt />,
      text: "ul. Opolska 100, 31-323 Kraków, Poland",
    },
    {
      icon: <FaPhoneAlt />,
      text: <a href="tel:+91783871783">+91 783 871 783</a>,
    },
    {
      icon: <FaEnvelope />,
      text: (
        <a href="mailto:contact@pragmaticcoders.com">
          contact@pragmaticcoders.com
        </a>
      ),
    },
  ];

  const quickLinks = [
    { to: "/home", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/meals", label: "Meals" },
    { to: "/contact", label: "Contact Us" },
  ];

  const usefulLinks = [
    { to: "/PrivacyPolicy", label: "Privacy Policy" },
    { to: "/terms-of-use", label: "Terms of Use" },
    { to: "/sitemap", label: "Sitemap" },
  ];

  const socialLinks = [
    {
      href: "https://facebook.com",
      icon: <FaFacebook />,
      label: "Facebook",
    },
    {
      href: "https://instagram.com",
      icon: <FaInstagram />,
      label: "Instagram",
    },
    {
      href: "https://twitter.com",
      icon: <FaTwitter />,
      label: "Twitter",
    },
    {
      href: "https://www.linkedin.com/in/ankur-patel-86b65a35a",
      icon: <FaLinkedin />,
      label: "LinkedIn",
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <address className={styles.column}>
          <h2>Pragmatic Coders</h2>
          <p>Empowering your ideas through software.</p>
          {contactInfo.map(({ icon, text }, i) => (
            <p key={i}>
              {icon} <span className={styles.contactText}>{text}</span>
            </p>
          ))}
        </address>

        <nav className={styles.column} aria-label="Quick Links">
          <h3>Quick Links</h3>
          {quickLinks.map(({ to, label }) => (
            <Link key={to} to={to}>
              {label}
            </Link>
          ))}
        </nav>

        <nav className={styles.column} aria-label="Useful Links">
          <h3>Useful Links</h3>
          {usefulLinks.map(({ to, label }) => (
            <Link key={to} to={to}>
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <section className={styles.socialSection} aria-label="Social Media">
        <h3>Follow Us</h3>
        <div className={styles.social}>
          {socialLinks.map(({ href, icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
            >
              {icon}
            </a>
          ))}
        </div>
      </section>

      <div className={styles.bottom}>
        <p>© 2025 Pragmatic Coders. All rights reserved.</p>
      </div>

      <button
        className={styles.scrollButton}
        onClick={handleScrollTop}
        aria-label="Back to Top"
      >
        <FaArrowUp /> Back to Top
      </button>
    </footer>
  );
}

export default Footer;
