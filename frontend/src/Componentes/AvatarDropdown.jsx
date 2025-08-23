import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Divider,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import FavoriteIcon from "@mui/icons-material/Favorite"; // heart icon if needed
import userLogo from "../assets/user.png";
import { useTheme } from "./Store/theme";
import { supabase } from "../../supabaseClient";

export default function AvatarDropdown({ onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [avatar, setAvatar] = useState(userLogo);
  const [userMetadata, setUserMetadata] = useState({
    name: "User",
    email: "email@example.com",
  });
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const open = Boolean(anchorEl);

  const stringToInitials = useCallback((name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }, []);

  const loadUserData = useCallback(async () => {
    try {
      // Get cached data
      const cachedUser = localStorage.getItem("user");
      const cachedImage = localStorage.getItem("image");

      if (cachedUser) {
        const parsed = JSON.parse(cachedUser);
        const meta = parsed.user_metadata || {};
        const name = meta.name || meta.full_name || parsed.email.split("@")[0];
        const avatarUrl = meta.avatar_url || meta.picture || null;

        setUserMetadata({ name, email: parsed.email });
        setAvatar(
          avatarUrl ||
            cachedImage ||
            `https://ui-avatars.com/api/?name=${stringToInitials(
              name
            )}&background=random&color=fff&bold=true&size=128`
        );
        return;
      }

      // Fetch user from Supabase
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;

      const user = data.user;
      const meta = user.user_metadata || {};
      const name = meta.name || meta.full_name || user.email.split("@")[0];
      const avatarUrl = meta.avatar_url || meta.picture || null;

      setUserMetadata({ name, email: user.email });
      const finalAvatar =
        avatarUrl ||
        `https://ui-avatars.com/api/?name=${stringToInitials(
          name
        )}&background=random&color=fff&bold=true&size=128`;
      setAvatar(finalAvatar);

      // Cache data
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("image", finalAvatar);
    } catch (err) {
      console.error("Failed to load user data:", err.message);
      setAvatar(userLogo);
    }
  }, [stringToInitials]);

  // Listen to auth state changes
  useEffect(() => {
    loadUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        loadUserData();
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, [loadUserData]);

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleLogout = async () => {
    try {
      localStorage.clear();
      await supabase.auth.signOut();
      if (onLogout) onLogout();
      navigate("/signup");
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  const iconColor = theme === "light" ? "#686666ff" : "#fff";

  return (
    <>
      <Tooltip title="Account">
        <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
          <Avatar
            src={avatar}
            alt="User Avatar"
            sx={{ width: 37, height: 37 }}
            onError={() => setAvatar(userLogo)}
          />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 4,
          sx: {
            mt: 2.5,
            minWidth: 240,
            borderRadius: 2,
            bgcolor: theme === "dark" ? "#2d2d2d" : "#fff",
            color: theme === "dark" ? "#fff" : "#000",
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.8,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            borderBottom: `1px solid ${theme === "dark" ? "#444" : "#eee"}`,
          }}
        >
          <Avatar
            src={avatar}
            alt="User Avatar"
            sx={{ width: 44, height: 44 }}
          />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {userMetadata.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: theme === "dark" ? "#ccc" : "#666" }}
            >
              {userMetadata.email}
            </Typography>
          </Box>
        </Box>

        <MenuItem component={Link} to="/profile">
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" sx={{ color: iconColor }} />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </MenuItem>

        <MenuItem component={Link} to="/payment-history">
          <ListItemIcon>
            <HistoryIcon fontSize="small" sx={{ color: iconColor }} />
          </ListItemIcon>
          <ListItemText primary="Payment History" />
        </MenuItem>

        <Divider />

        <MenuItem onClick={() => setLogoutDialogOpen(true)}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: iconColor }} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>

      {/* Logout Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>Are you sure you want to log out?</DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleLogout();
              setLogoutDialogOpen(false);
            }}
            color="error"
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
