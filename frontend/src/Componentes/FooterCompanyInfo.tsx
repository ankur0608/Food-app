import { Box, Typography, Link as MuiLink } from "@mui/material";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

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

export default function FooterCompanyInfo() {
  return (
    <Box>
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
          <Box sx={{ mr: 1.5, fontSize: 18, color: "primary.main" }}>{icon}</Box>
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
    </Box>
  );
}
