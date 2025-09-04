import { Box, Typography, IconButton } from "@mui/material";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const socialLinks = [
  { href: "https://facebook.com", icon: <FaFacebook />, label: "Facebook" },
  { href: "https://instagram.com", icon: <FaInstagram />, label: "Instagram" },
  { href: "https://twitter.com", icon: <FaTwitter />, label: "Twitter" },
  {
    href: "https://www.linkedin.com/in/ankur-patel-86b65a35a",
    icon: <FaLinkedin />,
    label: "LinkedIn",
  },
];

export default function FooterSocial() {
  return (
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
  );
}
