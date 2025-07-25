import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import userLogo from "../assets/user.png";
import { useTheme } from "./Store/theme";
import { supabase } from "../../supabaseClient";

export default function AvatarDropdown({ onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [avatar, setAvatar] = useState(userLogo);
  const navigate = useNavigate();
  const { theme } = useTheme();

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

  // Avatar loading logic
  useEffect(() => {
    const localUser = localStorage.getItem("user");
    const storedImage = localStorage.getItem("image");

    if (storedImage?.startsWith("http")) {
      setAvatar(storedImage);
      return;
    }

    if (localUser) {
      const parsed = JSON.parse(localUser);
      const url =
        parsed?.user_metadata?.avatar_url || parsed?.user_metadata?.picture;
      if (url?.startsWith("http")) {
        setAvatar(url);
        localStorage.setItem("image", url);
      } else {
        setAvatar(userLogo);
      }
    } else {
      supabase.auth.getUser().then(({ data }) => {
        const url =
          data?.user?.user_metadata?.avatar_url ||
          data?.user?.user_metadata?.picture;
        if (url?.startsWith("http")) {
          setAvatar(url);
          localStorage.setItem("image", url);
        } else {
          setAvatar(userLogo);
        }
      });
    }
  }, []);

  return (
    <>
      <Tooltip title="Account">
        <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
          <Avatar
            src={avatar}
            alt="User Avatar"
            sx={{ width: 40, height: 40 }}
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
            mt: 2.5,
            minWidth: 200,
            borderRadius: 2,
            bgcolor: theme === "dark" ? "#2d2d2d" : "#fff",
            color: theme === "dark" ? "#fff" : "#000",
          },
        }}
      >
        <MenuItem component={Link} to="/profile">
          👤 Profile
        </MenuItem>
        <Divider />
        {/* <MenuItem component={Link} to="/order-summary">
          📝 Order Summary
        </MenuItem> */}
        {/* <Divider /> */}
        <MenuItem component={Link} to="/payment-history">
          💳 Payment History
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>🚪 Logout</MenuItem>
      </Menu>
    </>
  );
}
