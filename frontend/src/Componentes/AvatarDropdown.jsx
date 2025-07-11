import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AvatarDropdown.module.css";
import userLogo from "../assets/user.png";
import { useTheme } from "./Store/theme.jsx";
import { supabase } from "../../supabaseClient";

export default function AvatarDropdown({ onLogout }) {
  const [open, setOpen] = useState(false);
  const [avatar, setAvatar] = useState(userLogo);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { theme } = useTheme();

  // ✅ Close on outside click or Escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // ✅ Avatar load logic
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

  // ✅ Logout
  const handleLogoutClick = async () => {
    localStorage.clear();
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
        onError={() => {
          setAvatar(userLogo);
          localStorage.removeItem("image");
        }}
      />

      {open && (
        <div className={styles.dropdownMenu}>
          <Link
            to="/profile"
            className={styles.dropdownMenuItem}
            onClick={() => setOpen(false)}
          >
            👤 Profile
          </Link>
          <Link
            to="/order-summary"
            className={styles.dropdownMenuItem}
            onClick={() => setOpen(false)}
          >
            📝 Order Summary
          </Link>
          <Link
            to="/payment-history"
            className={styles.dropdownMenuItem}
            onClick={() => setOpen(false)}
          >
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
