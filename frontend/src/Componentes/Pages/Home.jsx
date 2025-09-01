import { useNavigate } from "react-router-dom";
// import homeimage from "../../assets/bg (1).png";
import { useCallback } from "react";
import { useTheme } from "../Store/theme.jsx";
import { lazy } from "react";
const Slider = lazy(() => import("../Slider/ProductSlider.jsx"));
const SmallBlog = lazy(() => import("../SmallBlog.jsx"));
import FeaturesSection from "../FeatureCard.jsx";

import {
  Box,
  Typography,
  Button,
  Container,
  useMediaQuery,
} from "@mui/material";

function Home() {
  const { theme } = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");

  const navigate = useNavigate();
  const handleMenu = useCallback(() => navigate("/meals"), [navigate]);
  const handleContact = useCallback(() => navigate("/contact"), [navigate]);

  return (
    <>
      {/* HERO SECTION */}
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: "80vh", md: "95vh" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "#fff",
          background: "#faf3f3d7",
        }}
      >
        {/* Semi-transparent overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: isMobile ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.5)",
          }}
        />

        {/* Centered Content */}
        <Container sx={{ position: "relative", zIndex: 2, px: 2 }}>
          {/* Gradient Title */}
          <Typography
            variant={isMobile ? "h4" : "h3"}
            fontWeight={900}
            gutterBottom
            sx={{
              lineHeight: 1.2,
              mb: 3,
              color: "#fff",
            }}
          >
            Welcome to{" "}
            <Box
              component="span"
              sx={{
                background: "linear-gradient(90deg,#4facfe,#00c6ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Our Platform
            </Box>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
              mb: 4,
              maxWidth: "700px",
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Step into the vibrant world of{" "}
            <strong>local melas and cultural fairs</strong>, all in one place!
            From traditional crafts and festive foods to thrilling rides and
            live performances — there&apos;s something for everyone to enjoy.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              onClick={handleMenu}
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.2,
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              Explore Menu
            </Button>
            <Button
              onClick={handleContact}
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.2,
                borderRadius: 2,
                fontWeight: 600,
                color: "#fff",
                borderColor: "#fff",
                "&:hover": {
                  borderColor: "#fff",
                  background: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Book A Table
            </Button>
          </Box>
        </Container>
      </Box>
      <FeaturesSection />

      {/* SLIDER SECTION */}
      <Box sx={{ bgcolor: theme === "dark" ? "#1a1a1a" : "#fafafa" }}>
        <Slider />
      </Box>

      {/* BLOG SECTION */}
      <div
        style={{
          padding: 35,
        }}
      >
        <SmallBlog />
      </div>
    </>
  );
}

export default Home;
