import { useState, useEffect } from "react";
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
import userLogo from "../assets/user.png";
import { useTheme } from "./Store/theme";
import { supabase } from "../../supabaseClient";
import FavoriteIcon from "@mui/icons-material/Favorite"; // import heart icon

export default function AvatarDropdown({ onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [avatar, setAvatar] = useState(userLogo);
  const [userMetadata, setUserMetadata] = useState({});
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const stringToInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleLogout = async () => {
    localStorage.clear();
    await supabase.auth.signOut();
    if (onLogout) onLogout();
    navigate("/signup");
    window.location.reload();
  };

  const openLogoutDialog = () => setLogoutDialogOpen(true);
  const closeLogoutDialog = () => setLogoutDialogOpen(false);

  useEffect(() => {
    const loadAvatar = async () => {
      const cachedImage = localStorage.getItem("image");
      if (cachedImage) setAvatar(cachedImage);

      let name = "User";
      let avatarUrl = null;

      const localUser = localStorage.getItem("user");
      let meta = null;

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
        if (error) return console.error(error.message);
        meta = data.user?.user_metadata;
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      name =
        meta?.name || meta?.full_name || meta?.email?.split("@")[0] || "User";
      avatarUrl =
        meta?.avatar_url || meta?.picture || meta?.full_picture || null;

      if (avatarUrl?.startsWith("http")) {
        setAvatar(avatarUrl);
        localStorage.setItem("image", avatarUrl);
      } else {
        const initials = stringToInitials(name);
        const initialsAvatar = `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&bold=true&size=128`;
        setAvatar(initialsAvatar);
        localStorage.setItem("image", initialsAvatar);
      }

      setUserMetadata({
        name,
        email: meta?.email || "email@example.com",
      });
    };

    loadAvatar();
  }, []);

  const iconColor = theme === "light" ? "#333" : "#fff";

  return (
    <>
      <Tooltip title="Account">
        <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
          <Avatar
            src={avatar}
            alt="User Avatar"
            sx={{ width: 37, height: 37 }}
            onError={() => {
              setAvatar(userLogo);
              localStorage.removeItem("image");
            }}
          />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        onClick={handleCloseMenu}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 4,
          sx: {
            mt: 1.8,
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
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ color: theme === "dark" ? "#fff" : "#000" }}
            >
              {userMetadata.name || "User"}
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

        {/* Wishlist menu item */}
        <MenuItem component={Link} to="/wishlist">
          <ListItemIcon>
            <FavoriteIcon fontSize="small" sx={{ color: iconColor }} />
          </ListItemIcon>
          <ListItemText primary="Wishlist" />
        </MenuItem>

        <Divider />

        <MenuItem onClick={openLogoutDialog}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: iconColor }} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onClose={closeLogoutDialog}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>Are you sure you want to log out?</DialogContent>
        <DialogActions>
          <Button onClick={closeLogoutDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleLogout();
              closeLogoutDialog();
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
