import {
  Box,
  Container,
  Grid,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import FooterCompanyInfo from "./FooterCompanyInfo";
import FooterLinks from "./FooterLinks";
import FooterSocial from "./FooterSocial";
import FooterBottom from "./FooterBottom";

export default function Footer() {
  const handleScrollTop = () => {
    const root = document.getElementById("root");
    const target = root?.scrollTop && root.scrollTop > 0 ? root : window;
    target.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        py: { xs: 4, md: 8 },
        borderColor: "divider",
        minHeight: "250px",
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        {/* Top Section */}
        <Grid container spacing={{ xs: 6, md: 15, lg: 35 }}>
          <FooterCompanyInfo />
          <FooterLinks
            title="Quick Links"
            links={[
              { to: "/home", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/meals", label: "Meals" },
              { to: "/contact", label: "Contact Us" },
            ]}
          />
          <FooterLinks
            title="Useful Links"
            links={[
              { to: "/PrivacyPolicy", label: "Privacy Policy" },
              { to: "/terms-of-use", label: "Terms of Use" },
              { to: "/sitemap", label: "Sitemap" },
            ]}
          />
        </Grid>

        {/* Divider */}
        <Divider sx={{ my: 4 }} />

        {/* Social */}
        <FooterSocial />

        <Divider sx={{ mb: 3 }} />

        {/* Bottom */}
        <FooterBottom />

        {/* Back to Top */}
        <Box
          sx={{
            position: "absolute",
            right: { xs: "50%", md: "2%" },
            bottom: 20,
            transform: { xs: "translateX(50%)", md: "none" },
          }}
        >
          <Tooltip title="Back to Top">
            <IconButton
              onClick={handleScrollTop}
              sx={{
                bgcolor: "primary.main",
                color: "white",
                "&:hover": { bgcolor: "primary.dark" },
                boxShadow: 3,
                p: 1.5,
                borderRadius: "50%",
              }}
            >
              <ArrowUpwardIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Container>
    </Box>
  );
}
