import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import {
  FaHome,
  FaMapMarkedAlt,
  FaInfoCircle,
  FaEnvelope,
  FaBlog,
} from "react-icons/fa";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCart";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import AvatarDropdown from "../AvatarDropdown";

import { CartContext } from "../Store/CartContext";
import { supabase } from "../../../supabaseClient";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { useTheme as useCustomTheme } from "../Store/theme";

const navLinks = [
  { text: "Home", icon: <FaHome />, path: "/home" },
  { text: "Menu", icon: <FaMapMarkedAlt />, path: "/meals" },
  { text: "About", icon: <FaInfoCircle />, path: "/about" },
  { text: "Reservation", icon: <FaEnvelope />, path: "/contact" },
  { text: "Blog", icon: <FaBlog />, path: "/blog" },
];

export default function Navbar() {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  const { theme: currentTheme, toggleTheme, theme } = useCustomTheme();
  const { items } = useContext(CartContext);
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const openMenu = Boolean(anchorEl);

  // Supabase auth check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session?.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setIsAuthenticated(!!session?.user)
    );

    return () => listener?.subscription?.unsubscribe?.();
  }, []);

  const handleAvatarClick = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("justSignedUp");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const ThemeToggle = () => (
    <IconButton onClick={toggleTheme} color="inherit">
      {currentTheme === "light" ? (
        <IoMoonOutline size={22} />
      ) : (
        <IoSunnyOutline size={22} />
      )}
    </IconButton>
  );

  const navbarBgColor = currentTheme === "dark" ? "#0d1117" : "#ffffff";
  // const textColor = theme === "dark" ? "#ffffff" : "#1a1a1a";

  const iconColor = theme === "light" ? "#333" : "#fff";
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: navbarBgColor,
        // color: textColor,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        transition: "background-color 0.3s ease",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
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
          My Food App
        </Typography>

        {/* Navigation Links */}
        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon sx={{ color: iconColor }} />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              <Box sx={{ width: 250 }}>
                <IconButton onClick={() => setDrawerOpen(false)}>
                  <CloseIcon />
                </IconButton>
                <List>
                  {navLinks.map((item) => (
                    <ListItem key={item.text} disablePadding>
                      <ListItemButton component={Link} to={item.path}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
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
        )}

        {/* Right Icons */}
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
