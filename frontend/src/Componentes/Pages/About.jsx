import styles from "./AboutUs.module.css";
import { useTheme } from "../Store/theme";
import storyImage from "../../assets/story.png";
import ExecutiveChef from "../../assets/Chef.png";
import Slice from "../../assets/Slice.png";
import Pickled from "../../assets/Pickled.png";
import Bake from "../../assets/Bake.png";

const steps = [
  {
    number: "01",
    title: "Slice",
    image: Slice,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus lorem id penatibus imperdiet. Turpis egestas ultricies purus auctor tincidunt lacus nunc. Convallis pellentesque quis fringilla sagittis. Egestas in risus sit nunc nunc, arcu donec nam etiam.",
  },
  {
    number: "02",
    title: "Pickled",
    image: Pickled,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus lorem id penatibus imperdiet.",
  },
  {
    number: "03",
    title: "Bake",
    image: Bake,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus lorem id penatibus imperdiet.",
  },
];

function AboutUs() {
  const { theme } = useTheme();

  return (
    <div className={`${styles.wrapper} ${styles[theme]}`}>
      <Header title="About Us" />

      <HeroSection
        title="Our Story"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus lorem in peadimus imperdiet. Turpis egestas ultricies purus auctor tincidunt lacus nunc."
        image={storyImage}
      />

      <TeamMember
        name="Carson Hugn"
        title="Restaurant Manager"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et in sed in pellentesque ornare nunc nisl."
        reverse
      />

      <TeamMember
        name="Riya Shah"
        title="Executive Chef"
        description="With a passion for culinary arts and over 15 years of experience, Riya leads our kitchen with creativity and precision. She brings local flavors and global techniques together to craft memorable dining experiences."
        image={ExecutiveChef}
      />

      <Section title="Who We Are" customClass={styles.enhancedSection}>
        <p>
          Welcome to <strong>MelaConnect</strong> — a passionate team bringing
          the joy and culture of traditional melas (fairs) to a modern audience.
        </p>
        <p>
          Since our founding in <strong>2023</strong>, MelaConnect has grown
          into a nationwide platform connecting visitors, vendors, and
          organizers with melas across India.
        </p>
      </Section>
{/* 
      <Section title="What We Do" customClass={styles.enhancedSection}>
        <p>
          We organize, promote, and support melas — from festive fairs and
          seasonal markets to art showcases and food carnivals. Our platform
          helps users explore, attend, or register for these events.
        </p>
      </Section>

      <Section title="Our Vision" customClass={styles.enhancedSection}>
        <p>
          We envision a world where communities celebrate their culture, where
          artisans thrive, and where traditions meet technology.
        </p>
      </Section>

      <Section title="Our Values" customClass={styles.enhancedSection}>
        <ul className={styles.valuesList}>
          <li>
            <strong>Culture & Heritage:</strong> We honor traditional festivals.
          </li>
          <li>
            <strong>Inclusion:</strong> Everyone is welcome at our events.
          </li>
          <li>
            <strong>Empowerment:</strong> We uplift local vendors and artisans.
          </li>
          <li>
            <strong>Innovation:</strong> We simplify event discovery with tech.
          </li>
        </ul>
      </Section> */}

      {/* <Section title="Meet Our Team">
        <ul className={styles.list}>
          <li>
            <strong>Ankur Patel</strong> — <em>Founder & Director</em>: Drives
            MelaConnect's cultural vision.
          </li>
        </ul>
      </Section> */}

      <Section title="Why Choose Us?">
        <p>
          With <strong>MelaConnect</strong>, you're not just attending an event
          — you're part of a cultural movement. We bring inclusivity,
          authenticity, and fun to every mela.
        </p>
      </Section>

      {/* MODIFIED PROCESS SECTION BELOW */}
      <section className={styles.processSection}>
        <h2 className={styles.heading}>Sophisticated Process</h2>
        <div className={styles.steps}>
          {steps.map(
            (
              step,
              index // Added index here
            ) => (
              <div
                key={step.number}
                className={`${styles.stepItem} ${
                  index % 2 !== 0 ? styles.reverseStep : "" // Apply reverse class for odd indices (0-based)
                }`}
              >
                <div className={styles.stepImageWrapper}>
                  <img
                    src={step.image}
                    alt={step.title}
                    className={styles.stepImage}
                  />
                </div>
                <div className={styles.stepContent}>
                  <span className={styles.stepNumber}>{step.number}</span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDescription}>{step.description}</p>
                </div>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}

function Header({ title }) {
  return (
    <header className={styles.header}>
      <h1 className={styles.heading}>{title}</h1>
    </header>
  );
}

function HeroSection({ title, description, image }) {
  return (
    <section className={styles.heroSection}>
      <div className={styles.text}>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className={styles.imageWrapper}>
        <img src={image} alt={title} className={styles.image} />
      </div>
    </section>
  );
}

function TeamMember({ name, title, description, image, reverse = false }) {
  return (
    <section
      className={`${styles.heroSection} ${reverse ? styles.reverse : ""}`}
    >
      {image && (
        <div className={styles.imageWrapper}>
          <img src={image} alt={title} className={styles.image} />
        </div>
      )}
      <div className={styles.text}>
        <h3>{title}</h3>
        <p className={styles.managerName}>{name}</p>
        <p>{description}</p>
      </div>
    </section>
  );
}

function Section({ title, children, customClass }) {
  return (
    <section className={`${styles.section} ${customClass || ""}`}>
      <h2 className={styles.subheading}>{title}</h2>
      {children}
    </section>
  );
}

export default AboutUs;
