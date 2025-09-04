import { Box, Typography } from "@mui/material";

export default function FooterBottom() {
  return (
    <Box textAlign="center" mt={5}>
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Pragmatic Coders. All rights reserved.
      </Typography>
    </Box>
  );
}
