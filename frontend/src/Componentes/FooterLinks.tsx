import { Typography, Divider, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";

interface FooterLinksProps {
  title: string;
  links: { to: string; label: string }[];
}

export default function FooterLinks({ title, links }: FooterLinksProps) {
  return (
    <div>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Divider sx={{ mb: 2, width: 60, borderBottomWidth: 2 }} />
      {links.map(({ to, label }) => (
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
    </div>
  );
}
