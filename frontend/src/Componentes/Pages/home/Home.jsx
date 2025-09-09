import { lazy, Suspense } from "react";
import { Box } from "@mui/material";
import { useTheme } from "../../Store/theme.jsx";
import FeaturesSection from "./FeatureCard.jsx";
import HeroSection from "./HeroSection.jsx";

const Slider = lazy(() => import("../../Slider/ProductSlider.jsx"));
const SmallBlog = lazy(() => import("../../SmallBlog.jsx"));

function Home() {
  const { theme } = useTheme();

  return (
    <>
      <HeroSection />
      <FeaturesSection />

      {/* Slider */}
      <Box sx={{ bgcolor: theme === "dark" ? "#1a1a1a" : "#fafafa" }}>
        <Suspense
          fallback={<div style={{ height: 200 }}>Loading Slider...</div>}
        >
          <Slider />
        </Suspense>
      </Box>

      {/* Blog */}
      <div style={{ padding: 35 }}>
        <Suspense fallback={<div>Loading Blog...</div>}>
          <SmallBlog />
        </Suspense>
      </div>
    </>
  );
}

export default Home;
