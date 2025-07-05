// AvatarDropdown.jsx
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar/Navbar.module.css";
import userLight from "../assets/user.png";
import userDark from "../assets/user1.png";
import { useTheme } from "./Store/theme.jsx";
import { supabase } from "../../supabaseClient";

export default function AvatarDropdown({ onLogout }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // Get avatar from localStorage or use default
  const storedAvatar = localStorage.getItem("image");
  const avatar = storedAvatar || (theme === "dark" ? userDark : userLight);

  // Close dropdown on outside click or Escape
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
    localStorage.removeItem("justSignedUp");
    await supabase.auth.signOut();
    if (onLogout) onLogout();
    navigate("/signup");
  };

  return (
    <div className={styles.dropdownWrapper} ref={dropdownRef}>
      <img
        src={avatar}
        alt="User Avatar"
        className={styles.avatar}
        onClick={() => setOpen((prev) => !prev)}
        tabIndex={0}
        style={{ cursor: "pointer", width: 38, height: 38, borderRadius: "50%" }}
      />
      {open && (
        <div className={styles.dropdownMenu}>
          <Link to="/profile" className={styles.dropdownMenuItem}>
            👤 Profile
          </Link>
          <Link to="/SavedPlace" className={styles.dropdownMenuItem}>
            📌 Saved Places
          </Link>
          <button onClick={handleLogoutClick} className={styles.dropdownMenuItem}>
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
}
