import { Box, Container, Grid, Divider, Button } from "@mui/material";
// import { FaArrowUp } from "react-icons/fa";
import FooterCompanyInfo from "./FooterCompanyInfo";
import FooterLinks from "./FooterLinks";
import FooterSocial from "./FooterSocial";
import FooterBottom from "./FooterBottom";

export default function Footer() {
  // const handleScrollTop = () => {
  //   const root = document.getElementById("root");
  //   const target = root?.scrollTop && root.scrollTop > 0 ? root : window;
  //   target.scrollTo({ top: 0, behavior: "smooth" });
  // };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        py: { xs: 4, md: 8 },
        borderColor: "divider",
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
        {/* <Box textAlign="center">
          <Button
            variant="contained"
            startIcon={<FaArrowUp />}
            onClick={handleScrollTop}
            sx={{ borderRadius: 8, mt: 2 }}
          >
            Back to Top
          </Button>
        </Box> */}
      </Container>
    </Box>
  );
}
