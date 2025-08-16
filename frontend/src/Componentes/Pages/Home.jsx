import { useNavigate } from "react-router-dom";
import homeimage from "../../assets/bg (1).png";
import Slider from "../Slider/ProductSlider.jsx";
import { useTheme } from "../Store/theme.jsx";
import { FaLeaf, FaCarrot, FaAppleAlt, FaDrumstickBite } from "react-icons/fa";
import SmallBlog from "../SmallBlog.jsx";

import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  useMediaQuery,
} from "@mui/material";

function Home() {
  const { theme } = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");

  const navigate = useNavigate();
  const handleMenu = () => navigate("/meals");
  const handleContact = () => navigate("/contact");
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
          background: isMobile
            ? "" // solid background on mobile
            : `url("${homeimage}") center/cover no-repeat`,
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

      {/* FEATURES SECTION */}
      <Container>
        <Typography
          variant="h4"
          fontWeight={700}
          align="center"
          marginTop={{ xs: 5, md: 8 }}
          marginBottom={{ xs: 3, md: 5 }}
          gutterBottom
          sx={{ fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" } }}
        >
          Why Choose Us?
        </Typography>

        <Grid
          container
          spacing={{ xs: 2, sm: 3, md: 5 }}
          justifyContent="center"
        >
          {[
            {
              icon: <FaLeaf size={32} color="#0bbf54" />,
              title: "Premium Quality",
              desc: "Only the finest ingredients curated for freshness and taste.",
            },
            {
              icon: <FaCarrot size={32} color="#f7571e" />,
              title: "Seasonal Vegetables",
              desc: "Handpicked veggies sourced directly from local farmers.",
            },
            {
              icon: <FaAppleAlt size={32} color="#ff3131" />,
              title: "Fresh Fruit",
              desc: "Juicy, organic fruits to make every bite healthy and tasty.",
            },
            {
              icon: <FaDrumstickBite size={32} color="#7c5353" />,
              title: "Non-Vegetarian Delights",
              desc: "A wide range of fresh and delicious meat options for you.",
            },
          ].map((item, index) => (
            <Grid item xs={6} sm={6} md={3} key={index}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: 3,
                  textAlign: "center",
                  py: { xs: 2, sm: 3 }, // smaller padding in mobile
                  px: { xs: 1, sm: 2 },
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                  {item.icon}
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    mt={1}
                    sx={{
                      fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.9rem" },
                    }}
                  >
                    {item.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* SLIDER SECTION */}
      <Box sx={{ bgcolor: theme === "dark" ? "#1a1a1a" : "#fafafa" }}>
        <Container maxWidth="lg">
          <Slider />
        </Container>
      </Box>

      {/* BLOG SECTION */}
      <Container sx={{ py: 0 }}>
        <SmallBlog />
      </Container>
    </>
  );
}

export default Home;
