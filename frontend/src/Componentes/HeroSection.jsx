import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  useMediaQuery,
} from "@mui/material";

function HeroSection() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();

  const handleMenu = useCallback(() => navigate("/meals"), [navigate]);
  const handleContact = useCallback(() => navigate("/contact"), [navigate]);

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: { xs: "80vh", md: "100vh" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#fff",
        background: "#faf3f3d7",
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: isMobile ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.5)",
        }}
      />

      {/* Content */}
      <Container sx={{ position: "relative", zIndex: 2, px: 2 }}>
        <Typography
          variant={isMobile ? "h4" : "h3"}
          fontWeight={900}
          gutterBottom
          sx={{ lineHeight: 1.2, mb: 3, color: "#fff" }}
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
          <strong>local melas and cultural fairs</strong>, all in one place! From traditional crafts and festive foods to thrilling rides and live performances — there&apos;s something for everyone to enjoy.
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
            sx={{ px: 4, py: 1.2, borderRadius: 2, fontWeight: 600 }}
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
  );
}

export default HeroSection;
