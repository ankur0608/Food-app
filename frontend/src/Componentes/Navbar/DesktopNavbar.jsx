// components/Navbar/DesktopNavbar.jsx
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Badge,
} from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import {
  FaHome,
  FaMapMarkedAlt,
  FaInfoCircle,
  FaEnvelope,
  FaBlog,
} from "react-icons/fa";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import AvatarDropdown from "../AvatarDropdown";

const navLinks = [
  { text: "Home", icon: <FaHome />, path: "/home" },
  { text: "Menu", icon: <FaMapMarkedAlt />, path: "/meals" },
  { text: "About", icon: <FaInfoCircle />, path: "/about" },
  { text: "Reservation", icon: <FaEnvelope />, path: "/contact" },
  { text: "Blog", icon: <FaBlog />, path: "/blog" },
];

export default function DesktopNavbar({
  currentTheme,
  theme,
  toggleTheme,
  iconColor,
  isAuthenticated,
  totalItems,
  navbarBgColor,
}) {
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: navbarBgColor,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        transition: "background-color 0.3s ease",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          component={Link}
          to="/home"
          sx={{
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "1.4rem",
            color: iconColor,
          }}
        >
          My Food App
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          {navLinks.map((item) => (
            <NavLink
              key={item.text}
              to={item.path}
              style={{
                textDecoration: "none",
                color: currentTheme === "dark" ? "#fff" : "#333",
              }}
            >
              {({ isActive }) => (
                <Button
                  sx={{
                    color: isActive ? "primary.main" : "inherit",
                    fontWeight: isActive ? "bold" : "normal",
                    backgroundColor: isActive
                      ? currentTheme === "dark"
                        ? "#313131ff"
                        : "#dedfddff"
                      : "transparent",
                    borderRadius: 2,
                    px: 2,
                    transition: "all 0.3s ease",
                  }}
                >
                  {item.text}
                </Button>
              )}
            </NavLink>
          ))}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={toggleTheme}>
            {theme === "light" ? (
              <DarkModeOutlinedIcon sx={{ color: iconColor }} />
            ) : (
              <LightModeOutlinedIcon sx={{ color: iconColor }} />
            )}
          </IconButton>
          <IconButton color="inherit" component={Link} to="/cart">
            <Badge badgeContent={totalItems} color="error">
              <ShoppingCartOutlinedIcon sx={{ color: iconColor }} />
            </Badge>
          </IconButton>

          {isAuthenticated ? (
            <AvatarDropdown />
          ) : (
            <Button
              component={Link}
              to="/login"
              sx={{
                color: currentTheme === "dark" ? "#fff" : "#000",
                border: `1px solid ${
                  currentTheme === "dark" ? "#fff" : "#000"
                }`,
                backgroundColor: "transparent",
                fontWeight: "500",
                borderRadius: 2,
                px: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor:
                    currentTheme === "dark"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.05)",
                },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
