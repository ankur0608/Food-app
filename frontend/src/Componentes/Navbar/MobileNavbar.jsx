import { useState, useEffect, useCallback } from "react";
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
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  FaHome,
  FaMapMarkedAlt,
  FaInfoCircle,
  FaEnvelope,
  FaBlog,
} from "react-icons/fa";
import { supabase } from "../../../supabaseClient";
import userLogo from "../../assets/user.png";

const navLinks = [
  { text: "Home", icon: <FaHome />, path: "/home" },
  { text: "Menu", icon: <FaMapMarkedAlt />, path: "/meals" },
  { text: "About", icon: <FaInfoCircle />, path: "/about" },
  { text: "Reservation", icon: <FaEnvelope />, path: "/contact" },
  { text: "Blog", icon: <FaBlog />, path: "/blog" },
];

export default function MobileNavbar({
  iconColor = "#fff",
  navbarBgColor = "#1976d2",
  totalItems = 0,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMetadata, setUserMetadata] = useState({
    name: "User",
    email: "email@example.com",
  });
  const [avatar, setAvatar] = useState(userLogo);
  const navigate = useNavigate();

  const stringToInitials = useCallback((name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }, []);

  const loadUser = useCallback(async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) return console.error(error.message);

    if (user) {
      const meta = user.user_metadata || {};
      const name = meta.name || meta.full_name || user.email.split("@")[0];
      const avatarUrl = meta.avatar_url || meta.picture || null;

      setUserMetadata({ name, email: user.email });
      setAvatar(
        avatarUrl?.startsWith("http")
          ? avatarUrl
          : `https://ui-avatars.com/api/?name=${stringToInitials(
              name
            )}&background=random&color=fff&bold=true&size=128`
      );

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("image", avatarUrl);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("image");
      setAvatar(userLogo);
      setUserMetadata({ name: "User", email: "email@example.com" });
    }
  }, [stringToInitials]);

  useEffect(() => {
    loadUser();
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });
    return () => authListener.subscription.unsubscribe();
  }, [loadUser]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      navigate("/signup");
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  const isAuthenticated = !!localStorage.getItem("user");

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
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left: App Name */}
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
          <span style={{ color: "#3678f4ff" }}>Food</span> App
        </Typography>

        {/* Right: Cart + Menu */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton color="inherit" component={Link} to="/cart">
            <Badge badgeContent={totalItems} color="error">
              <ShoppingCartOutlinedIcon sx={{ color: iconColor }} />
            </Badge>
          </IconButton>

          <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
            <MenuIcon sx={{ color: iconColor }} />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: 270, sm: 320 }, height: "100%" } }}
      >
        <Box sx={{ width: "100%", p: 1, overflowY: "auto" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h5" fontWeight="650">
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
                alt={userMetadata.name}
                sx={{ width: 56, height: 56 }}
              />
              <Box>
                <Typography fontWeight="600">{userMetadata.name}</Typography>
                <Typography fontSize="0.8rem" color="text.secondary">
                  {userMetadata.email}
                </Typography>
              </Box>
            </Box>
          )}
          <Divider />

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
