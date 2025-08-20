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
import SearchBar from "../../Componentes/SearchBar";

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
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMetadata, setUserMetadata] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  // ✅ load avatar + user info
  useEffect(() => {
    const loadAvatar = async () => {
      let meta = null;
      const localUser = localStorage.getItem("user");

      if (localUser) {
        try {
          const parsed = JSON.parse(localUser);
          meta = parsed?.user_metadata;
        } catch (err) {
          console.warn("Error parsing user from localStorage:", err);
        }
      }

      if (!meta) {
        const { data, error } = await supabase.auth.getUser();
        if (!error && data.user) {
          meta = data.user.user_metadata;
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      }

      const name =
        meta?.name || meta?.full_name || meta?.email?.split("@")[0] || "User";
      const avatarUrl =
        meta?.avatar_url || meta?.picture || meta?.full_picture || null;

      if (avatarUrl?.startsWith("http")) {
        setAvatar(avatarUrl);
        localStorage.setItem("image", avatarUrl);
      }

      setUserMetadata({
        name,
        email: meta?.email || "email@example.com",
      });
    };

    loadAvatar();
  }, []);

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
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
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
          My <span style={{ color: "#3678f4ff" }}>Food</span> App
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
          {" "}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
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
          {/* ✅ Avatar at Top as Menu Link */}
          {isAuthenticated && (
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/profile"
                  onClick={() => setDrawerOpen(false)}
                  sx={{ gap: 1 }}
                >
                  <Avatar src={avatar} alt={userMetadata.name} />
                  <ListItemText
                    primary={userMetadata.name}
                    secondary={userMetadata.email}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          )}
          <Divider sx={{ my: 1 }} />
          {/* ✅ User Section (Details below avatar) */}
          {isAuthenticated && (
            <Box sx={{ mb: 2 }}>
              <List>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/profile">
                    <ListItemIcon>
                      <AccountCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/payment-history">
                    <ListItemIcon>
                      <HistoryIcon />
                    </ListItemIcon>
                    <ListItemText primary="Payment History" />
                  </ListItemButton>
                </ListItem>
              </List>
              <Divider sx={{ my: 1 }} />
            </Box>
          )}
          {/* Navigation Links */}
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
          {/* Logout button if authenticated */}
          {isAuthenticated && (
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
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
}
