import { useMemo } from "react";
import styles from "./AboutUs.module.css";
import { useTheme } from "../../../Componentes/Store/theme.jsx";

import storyImage from "../../../assets/story.png";
import ExecutiveChef from "../../../assets/Chef.png";
import Slice from "../../../assets/Slice.png";
import Pickled from "../../../assets/Pickled.png";
import Bake from "../../../assets/Bake.png";

import Header from "./Header";
import HeroSection from "./HeroSection";
import TeamMember from "./TeamMember";
import Section from "./Section";
import ProcessSection from "../../Pages/AboutUs/ProcessSection";
import OpeningHours from "../../OpeningHours.jsx";

function AboutUs() {
  const { theme } = useTheme();

  const steps = useMemo(
    () => [
      {
        number: "01",
        title: "Slice",
        image: Slice,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus lorem id penatibus imperdiet...",
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
    ],
    []
  );

  return (
    <div className={`${styles.wrapper} ${styles[theme]}`}>
      <Header title="About Us" />

      <HeroSection
        title="Our Story"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus lorem in peadimus imperdiet..."
        image={storyImage}
        priority
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
        description="With a passion for culinary arts and over 15 years of experience..."
        image={ExecutiveChef}
      />

      <Section title="Who We Are" customClass={styles.enhancedSection}>
        <p>
          Welcome to <strong>MelaConnect</strong> — a passionate team bringing
          the joy and culture of traditional melas (fairs) to a modern audience.
        </p>
        <p>
          Since our founding in <strong>2023</strong>, MelaConnect has grown
          into a nationwide platform...
        </p>
      </Section>

      <Section title="Why Choose Us?">
        <p>
          With <strong>MelaConnect</strong>, you're not just attending an event
          — you're part of a cultural movement...
        </p>
      </Section>

      <ProcessSection steps={steps} />
      <OpeningHours />
    </div>
  );
}

export default AboutUs;
