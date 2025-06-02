import styles from "./AboutUs.module.css";
import { useTheme } from "../Store/theme";

function AboutUs() {
  const { theme } = useTheme();

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <h1 className={styles.heading}>About Us</h1>

      <section className={styles.section}>
        <h2 className={styles.subheading}>Who We Are</h2>
        <p>
          Welcome to <strong>MelaConnect</strong> — a passionate team bringing
          the joy and culture of traditional melas (fairs) to a modern audience.
          We celebrate the diversity, color, and community spirit found in every
          local fair across India and beyond.
        </p>
        <p>
          Since our founding in <strong>2023</strong>, MelaConnect has grown
          from a small idea into a nationwide platform connecting visitors,
          vendors, and organizers with melas both big and small. Our goal is to
          make every fair more accessible, enjoyable, and impactful.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>Our Mission</h2>
        <p>
          At <strong>MelaConnect</strong>, our mission is to{" "}
          <strong>
            revive, support, and digitize traditional fair culture
          </strong>{" "}
          for the modern world. From village haats to festive city melas, we
          help preserve heritage while creating new opportunities for artisans,
          performers, and local businesses.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>Our Vision</h2>
        <p>
          We envision a world where every community has a platform to celebrate
          its culture, where artisans thrive, and where traditions meet
          technology. Our goal is to become the go-to destination for
          discovering, attending, and participating in melas across regions and
          seasons.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>What We Do</h2>
        <p>
          We organize, promote, and support a wide variety of melas — from
          festive fairs and seasonal markets to art showcases and food
          carnivals. Our platform enables users to find melas near them, buy
          tickets, register as vendors, and explore rich local experiences.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>Our Values</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <strong>Culture & Heritage</strong>: We honor and promote
            traditional arts, crafts, and community festivals.
          </li>
          <li className={styles.listItem}>
            <strong>Inclusion</strong>: We create spaces where all communities
            feel welcomed and celebrated.
          </li>
          <li className={styles.listItem}>
            <strong>Empowerment</strong>: We support local vendors, artisans,
            and performers through exposure and opportunities.
          </li>
          <li className={styles.listItem}>
            <strong>Innovation</strong>: We use modern tools to simplify event
            discovery, participation, and enjoyment.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>Meet Our Team</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <strong>Ankur Patel</strong> — <em>Founder & Director</em>:
            Passionate about preserving India’s cultural heritage through
            technology and outreach.
          </li>
          <li className={styles.listItem}>
            <strong>Priyank Patel</strong> — <em>Operations Head</em>: Manages
            partnerships with local authorities and ensures smooth fair
            execution.
          </li>
          <li className={styles.listItem}>
            <strong>Dharmesh Kashyap</strong> — <em>Creative Lead</em>: Designs
            vibrant visual experiences and promotional materials for events.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>Why Choose Us?</h2>
        <p>
          With <strong>MelaConnect</strong>, you're not just attending an event
          — you're joining a celebration of tradition, creativity, and
          community. Our dedication to quality experiences, cultural
          preservation, and inclusive fun makes us the preferred choice for both
          mela-goers and organizers.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>Contact Us</h2>
        <p>
          We'd love to hear from you — whether you’re a visitor, vendor, or
          organizer. Reach out to us anytime!
        </p>
        <p>
          <strong>Email:</strong> contact@melaconnect.in <br />
          <strong>Phone:</strong> +91 98765 43210 <br />
          <strong>Address:</strong> 401 Culture Hub, Ahmedabad, Gujarat, India
        </p>
      </section>
    </div>
  );
}

export default AboutUs;
