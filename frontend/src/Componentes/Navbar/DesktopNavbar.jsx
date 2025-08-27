// components/Navbar/DesktopNavbar.jsx
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Badge,
  Button,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SearchBar from "../SearchBar";
import AvatarDropdown from "../AvatarDropdown";
import { useState } from "react";
// import MiniCartDrawer from "../MiniCartDrawer";
const navLinks = [
  { text: "Home", path: "/home" },
  { text: "Menu", path: "/meals" },
  { text: "About", path: "/about" },
  { text: "Reservation", path: "/contact" },
  { text: "Blog", path: "/blog" },
];

export default function DesktopNavbar({
  iconColor,
  navbarBgColor,
  totalItems,
  isAuthenticated,
  onLogout,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AppBar
      position="fixed"
      sx={{
        top: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: navbarBgColor,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography
          variant="h6"
          component={NavLink}
          to="/home"
          sx={{
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "1.4rem",
            color: iconColor,
          }}
        >
          <span style={{ color: "#3678f4ff" }}>Food</span> App
        </Typography>

        {/* Nav links */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mx: 3 }}>
          {navLinks.map((link) => (
            <Button
              key={link.text}
              component={NavLink}
              to={link.path}
              style={({ isActive }) => ({
                backgroundColor: isActive ? "#1976d2" : "transparent",
                color: isActive ? "#fff" : iconColor,
                fontWeight: isActive ? "bold" : "normal",
                borderRadius: "15px",
                padding: "6px 16px",
                transition: "all 0.3s ease",
              })}
              sx={{
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#1565c0",
                  color: "#fff",
                },
              }}
            >
              {link.text}
            </Button>
          ))}
        </Box>

        {/* Right: Search + Cart + Avatar/Login */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Search */}
          <Box sx={{ maxWidth: 280, mt: 3 }}>
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </Box>

          {/* Cart */}
          <IconButton component={NavLink} to="/cart">
            <Badge
              badgeContent={totalItems}
              color="error"
              sx={{ "& .MuiBadge-badge": { fontSize: "0.75rem" } }}
            >
              <ShoppingCartOutlinedIcon sx={{ color: iconColor }} />
            </Badge>
          </IconButton>

          {/* Avatar / Login */}
          {isAuthenticated ? (
            <AvatarDropdown onLogout={onLogout} />
          ) : (
            <Button component={NavLink} to="/signup" sx={{ color: iconColor }}>
              Login
            </Button>
          )}
        </Box>
        {/* <MiniCartDrawer open={open} onClose={() => setOpen(false)} /> */}
      </Toolbar>
    </AppBar>
  );
}
