import styles from "./PrivacyPolicy.module.css";
import { useTheme } from "./Store/theme";

export default function PrivacyPolicy() {
  const { theme } = useTheme();

  return (
    <div
      className={`${styles.privacyPolicy} ${
        theme === "dark" ? styles.dark : styles.light
      }`}
    >
      <h1 className={styles.hading}>Privacy Policy</h1>
      <p>Last updated: May 12, 2025</p>

      <section>
        <h2>1. Introduction</h2>
        <p>
          We respect your privacy and are committed to protecting your personal
          data. This privacy policy explains how we collect, use, and share your
          information when you use our website.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <ul>
          <li>Personal details (e.g., name, email address)</li>
          <li>Usage data (e.g., pages visited, clicks)</li>
          <li>Cookies and tracking data</li>
        </ul>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <p>We use the collected data for various purposes:</p>
        <ul>
          <li>To provide and maintain our service</li>
          <li>To notify you about changes to our service</li>
          <li>To provide customer support</li>
          <li>To gather analysis to improve our service</li>
        </ul>
      </section>

      <section>
        <h2>4. Sharing Your Data</h2>
        <p>
          We do not sell your personal data. We may share information with
          third-party vendors who help us operate the site, provided they agree
          to keep the data confidential.
        </p>
      </section>

      <section>
        <h2>5. Security</h2>
        <p>
          We use industry-standard security measures to protect your data, but
          no method of transmission over the Internet is 100% secure.
        </p>
      </section>

      <section>
        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access, update, or delete your personal information</li>
          <li>Withdraw consent at any time</li>
          <li>Complain to a data protection authority</li>
        </ul>
      </section>

      <section>
        <h2>7. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at: <a href="mailto:privacy@yourdomain.com">privacy@yourdomain.com</a>
        </p>
      </section>
    </div>
  );
}
