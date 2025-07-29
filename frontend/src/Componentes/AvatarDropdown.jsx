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
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import userLogo from "../assets/user.png";
import { useTheme } from "./Store/theme";
import { supabase } from "../../supabaseClient";

export default function AvatarDropdown({ onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [avatar, setAvatar] = useState(userLogo);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const stringToInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    localStorage.clear();
    await supabase.auth.signOut();
    if (onLogout) onLogout();
    navigate("/signup");
    window.location.reload();
  };

  useEffect(() => {
    const loadAvatar = async () => {
      const cachedImage = localStorage.getItem("image");
      if (cachedImage) {
        setAvatar(cachedImage);
        return;
      }

      let name = "User";
      let avatarUrl = null;

      const localUser = localStorage.getItem("user");
      let userMetadata = null;

      if (localUser) {
        try {
          const parsed = JSON.parse(localUser);
          userMetadata = parsed?.user_metadata;
        } catch (err) {
          console.warn("Error parsing user from localStorage:", err);
        }
      }

      if (!userMetadata) {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Supabase getUser failed:", error.message);
          return;
        }
        userMetadata = data.user?.user_metadata;
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      name =
        userMetadata?.name ||
        userMetadata?.full_name ||
        userMetadata?.email?.split("@")[0] ||
        "User";

      avatarUrl =
        userMetadata?.avatar_url ||
        userMetadata?.picture ||
        userMetadata?.full_picture ||
        null;

      if (avatarUrl?.startsWith("http")) {
        setAvatar(avatarUrl);
        localStorage.setItem("image", avatarUrl);
      } else {
        const initials = stringToInitials(name);
        const initialsAvatar = `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&bold=true&size=128`;
        setAvatar(initialsAvatar);
        localStorage.setItem("image", initialsAvatar);
      }
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
            minWidth: 200,
            borderRadius: 2,
            bgcolor: theme === "dark" ? "#2d2d2d" : "#fff",
            color: theme === "dark" ? "#fff" : "#000",
          },
        }}
      >
        <MenuItem component={Link} to="/profile">
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" sx={{ color: iconColor }} />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </MenuItem>

        <Divider />

        <MenuItem component={Link} to="/payment-history">
          <ListItemIcon>
            <HistoryIcon fontSize="small" sx={{ color: iconColor }} />
          </ListItemIcon>
          <ListItemText primary="Payment History" />
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: iconColor }} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </>
  );
}
