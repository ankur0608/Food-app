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
  Button,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";

const navLinks = [
  { text: "Home", icon: <FaHome />, path: "/home" },
  { text: "Menu", icon: <FaMapMarkedAlt />, path: "/meals" },
  { text: "About", icon: <FaInfoCircle />, path: "/about" },
  { text: "Reservation", icon: <FaEnvelope />, path: "/contact" },
  { text: "Blog", icon: <FaBlog />, path: "/blog" },
];

export default function MobileNavbar({ iconColor, navbarBgColor, totalItems }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMetadata, setUserMetadata] = useState(null);
  const [avatar, setAvatar] = useState(null);

  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("user");

  useEffect(() => {
    const loadUser = async () => {
      if (!isAuthenticated) return;

      const localUser = JSON.parse(localStorage.getItem("user"));
      const meta = localUser?.user_metadata || {};

      const name =
        meta?.name || meta?.full_name || meta?.email?.split("@")[0] || "User";
      const avatarUrl = meta?.avatar_url || meta?.picture || null;

      if (avatarUrl?.startsWith("http")) setAvatar(avatarUrl);

      setUserMetadata({ name, email: meta?.email || "email@example.com" });
    };

    loadUser();
  }, [isAuthenticated]);

  const handleLogout = async () => {
    localStorage.clear();
    await supabase.auth.signOut();
    navigate("/signup");
    window.location.reload();
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: navbarBgColor,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Menu button */}
        <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
          <MenuIcon sx={{ color: iconColor }} />
        </IconButton>

        {/* Logo */}
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
          My <span style={{ color: "#3678f4ff" }}>Food</span> App
        </Typography>

        {/* Cart */}
        <IconButton color="inherit" component={Link} to="/cart">
          <Badge badgeContent={totalItems} color="error">
            <ShoppingCartOutlinedIcon sx={{ color: iconColor }} />
          </Badge>
        </IconButton>
      </Toolbar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 270, p: 2 }}>
          {/* Drawer header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              Menu
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          {isAuthenticated && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mt: 2,
                mb: 2,
              }}
            >
              <Avatar
                src={avatar}
                alt={userMetadata?.name}
                sx={{ width: 56, height: 56 }}
              />
              <Box>
                <Typography fontWeight="600">{userMetadata?.name}</Typography>
                <Typography fontSize="0.8rem" color="text.secondary">
                  {userMetadata?.email}
                </Typography>
              </Box>
            </Box>
          )}
          <Divider />
          {/* Nav Links */}
          <List>
            {navLinks.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 1 }} />

          {/* Authenticated User Section */}
          {isAuthenticated ? (
            <>
              <List>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to="/profile"
                    onClick={() => setDrawerOpen(false)}
                  >
                    <ListItemIcon>
                      <AccountCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to="/payment-history"
                    onClick={() => setDrawerOpen(false)}
                  >
                    <ListItemIcon>
                      <HistoryIcon />
                    </ListItemIcon>
                    <ListItemText primary="Payment History" />
                  </ListItemButton>
                </ListItem>
              </List>
              <Divider sx={{ my: 1 }} />
              <List>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </ListItem>
              </List>
            </>
          ) : (
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/login"
                onClick={() => setDrawerOpen(false)}
              >
                Login
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
}
