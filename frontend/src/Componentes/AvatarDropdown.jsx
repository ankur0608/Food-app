import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar/Navbar.module.css";
import { useTheme } from "./Store/theme.jsx";
import { supabase } from "../../supabaseClient";

export default function AvatarDropdown({ onLogout }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

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
    localStorage.removeItem("user");
    localStorage.removeItem("justSignedUp");
    await supabase.auth.signOut();
    if (onLogout) onLogout();
    navigate("/signup");
    window.location.reload(); // ensure full state reset
  };

  return (
    <div className={styles.dropdownWrapper} ref={dropdownRef}>
      <div
        className={styles.avatar}
        onClick={() => setOpen((prev) => !prev)}
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={open}
        style={{
          cursor: "pointer",
          fontSize: "1.8rem",
          width: 38,
          height: 38,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme === "dark" ? "#333" : "#eee",
        }}
      >
        👤
      </div>

      {open && (
        <div className={styles.dropdownMenu}>
          <Link to="/profile" className={styles.dropdownMenuItem}>
            👤 Profile
          </Link>
          <Link to="/SavedPlace" className={styles.dropdownMenuItem}>
            📌 Saved Places
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
