// components/Navbar/MobileNavbar.jsx
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Avatar,
  Badge,
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import {
  FaHome,
  FaMapMarkedAlt,
  FaInfoCircle,
  FaEnvelope,
  FaBlog,
} from "react-icons/fa";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useState } from "react";

const navLinks = [
  { text: "Home", icon: <FaHome />, path: "/home" },
  { text: "Menu", icon: <FaMapMarkedAlt />, path: "/meals" },
  { text: "About", icon: <FaInfoCircle />, path: "/about" },
  { text: "Reservation", icon: <FaEnvelope />, path: "/contact" },
  { text: "Blog", icon: <FaBlog />, path: "/blog" },
];

export default function MobileNavbar({
  iconColor,
  navbarBgColor,
  isAuthenticated,
  totalItems,
  user, // 👈 pass { name, email, image } as props
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

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
        {/* Left: Menu button */}
        <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
          <MenuIcon sx={{ color: iconColor }} />
        </IconButton>

        {/* Center: Logo */}
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
          My <span style={{ color: "blue" }}>Food</span> App
        </Typography>

        {/* Right: Cart */}
        <IconButton color="inherit" component={Link} to="/cart">
          <Badge badgeContent={totalItems} color="error">
            <ShoppingCartOutlinedIcon sx={{ color: iconColor }} />
          </Badge>
        </IconButton>
      </Toolbar>

      {/* Sidebar Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 270, p: 2 }}>
          {/* Close Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* User Info */}
          {isAuthenticated && user && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 2, mt: 1 }}>
              <Avatar src={user.image} alt={user.name} sx={{ mr: 2 }} />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Divider */}
          <Divider sx={{ mb: 1 }} />

          {/* Nav Links */}
          <List>
            {navLinks.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
