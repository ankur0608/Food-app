import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AvatarDropdown.module.css";
import userLogo from "../assets/user.png"; // Default fallback image
import { useTheme } from "./Store/theme.jsx";
import { supabase } from "../../supabaseClient";

export default function AvatarDropdown({ onLogout }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [avatar, setAvatar] = useState(userLogo);
  const dropdownRef = useRef();

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    const customImage = localStorage.getItem("image");

    if (localUser) {
      const parsedUser = JSON.parse(localUser);
      const isGoogleUser = parsedUser?.app_metadata?.provider === "google";
      const googleAvatar = parsedUser?.user_metadata?.avatar_url;

      if (isGoogleUser && googleAvatar) {
        setAvatar(googleAvatar); // ✅ Google user: use avatar_url
      } else if (customImage) {
        setAvatar(customImage); // ✅ Regular user: use custom image if available
      } else {
        setAvatar(userLogo); // 🧍 Fallback default
      }
    } else {
      // Try Supabase in case localStorage was cleared (like your Profile.jsx)
      supabase.auth.getUser().then(({ data }) => {
        const url = data?.user?.user_metadata?.avatar_url;
        if (url) setAvatar(url);
      });
    }
  }, []);

  // Close dropdown on click outside or escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogoutClick = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("image");
    localStorage.removeItem("justSignedUp");

    await supabase.auth.signOut();
    if (onLogout) onLogout();
    navigate("/signup");
    window.location.reload();
  };

  return (
    <div className={styles.dropdownWrapper} ref={dropdownRef}>
      <img
        src={avatar}
        alt="User Avatar"
        className={styles.avatar}
        onClick={() => setOpen((prev) => !prev)}
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={open}
        style={{
          cursor: "pointer",
          width: 35,
          height: 35,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid #f1c40f",
          backgroundColor: theme === "dark" ? "#333" : "#eee",
          boxShadow: open ? "0 0 0 2px #f1c40f88" : "none",
        }}
      />

      {open && (
        <div className={styles.dropdownMenu}>
          <Link to="/profile" className={styles.dropdownMenuItem}>
            👤 Profile
          </Link>
          <Link to="/order-summary" className={styles.dropdownMenuItem}>
            📝 Order Summary
          </Link>
          <Link to="/payment-history" className={styles.dropdownMenuItem}>
            💳 Payment History
          </Link>
          <button
            onClick={handleLogoutClick}
            className={styles.dropdownMenuItem}
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
}
