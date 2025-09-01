import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
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

export default function Footer() {
  const handleScrollTop = () => {
    const root = document.getElementById("root");
    const target = root?.scrollTop && root.scrollTop > 0 ? root : window;
    target.scrollTo({ top: 0, behavior: "smooth" });
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt />,
      text: "ul. Opolska 100, 31-323 Kraków, Poland",
    },
    { icon: <FaPhoneAlt />, text: "+91 783 871 783", href: "tel:+91783871783" },
    {
      icon: <FaEnvelope />,
      text: "contact@pragmaticcoders.com",
      href: "mailto:contact@pragmaticcoders.com",
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
    { href: "https://facebook.com", icon: <FaFacebook />, label: "Facebook" },
    {
      href: "https://instagram.com",
      icon: <FaInstagram />,
      label: "Instagram",
    },
    { href: "https://twitter.com", icon: <FaTwitter />, label: "Twitter" },
    {
      href: "https://www.linkedin.com/in/ankur-patel-86b65a35a",
      icon: <FaLinkedin />,
      label: "LinkedIn",
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        py: { xs: 4, md: 8 },
        // mt: 8,
        // borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        {/* Top Section */}
        <Grid container spacing={{ xs: 6, md: 15, lg: 35 }}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Pragmatic Coders
            </Typography>
            <Typography variant="body2" mb={3} color="text.secondary">
              Empowering your ideas through software.
            </Typography>
            {contactInfo.map(({ icon, text, href }, i) => (
              <Box
                key={i}
                display="flex"
                alignItems="center"
                mb={1.5}
                sx={{ fontSize: 14 }}
              >
                <Box sx={{ mr: 1.5, fontSize: 18, color: "primary.main" }}>
                  {icon}
                </Box>
                {href ? (
                  <MuiLink
                    href={href}
                    underline="hover"
                    color="inherit"
                    sx={{ fontSize: 14 }}
                  >
                    {text}
                  </MuiLink>
                ) : (
                  <Typography variant="body2">{text}</Typography>
                )}
              </Box>
            ))}
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Links
            </Typography>
            <Divider sx={{ mb: 2, width: 60, borderBottomWidth: 2 }} />
            {quickLinks.map(({ to, label }) => (
              <Typography key={to} variant="body2" mb={1.5}>
                <MuiLink
                  component={Link}
                  to={to}
                  underline="hover"
                  color="text.secondary"
                  sx={{ "&:hover": { color: "primary.main" } }}
                >
                  {label}
                </MuiLink>
              </Typography>
            ))}
          </Grid>

          {/* Useful Links */}
          <Grid item xs={6} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Useful Links
            </Typography>
            <Divider sx={{ mb: 2, width: 60, borderBottomWidth: 2 }} />
            {usefulLinks.map(({ to, label }) => (
              <Typography key={to} variant="body2" mb={1.5}>
                <MuiLink
                  component={Link}
                  to={to}
                  underline="hover"
                  color="text.secondary"
                  sx={{ "&:hover": { color: "primary.main" } }}
                >
                  {label}
                </MuiLink>
              </Typography>
            ))}
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider sx={{ my: 4 }} />

        {/* Social Media Section */}
        <Box textAlign="center" mb={3}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: 600, mb: 2 }}
          >
            Follow Us
          </Typography>
          {socialLinks.map(({ href, icon, label }) => (
            <IconButton
              key={label}
              component="a"
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              sx={{
                mx: 1,
                color: "text.secondary",
                border: "1px solid",
                borderColor: "divider",
                "&:hover": {
                  bgcolor: "primary.main",
                  color: "#fff",
                },
              }}
            >
              {icon}
            </IconButton>
          ))}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Bottom Section */}
        <Box textAlign="center"mt={5}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Pragmatic Coders. All rights reserved.
          </Typography>
        </Box>
        {/* Back to Top */}
        <Box textAlign="" >
          <Button
            variant="contained"
            startIcon={<FaArrowUp />}
            onClick={handleScrollTop}
            sx={{ borderRadius: 8 }}
          >
            Back to Top
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
