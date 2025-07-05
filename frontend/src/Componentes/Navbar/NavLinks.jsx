import { useState, useEffect, useContext } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { CartContext } from "../Store/CartContext";
import { useTheme } from "../Store/theme.jsx";
import {
  FaShoppingBag,
  FaUserPlus,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { IoMoonOutline, IoSunnyOutline, IoHomeOutline } from "react-icons/io5";
import { FcAbout } from "react-icons/fc";
import { IoMdContact } from "react-icons/io";
import { GiHotMeal } from "react-icons/gi";
import LogoImage from "../../assets/main-logo.png";
import { supabase } from "../../../supabaseClient.js";
import Sidebar from "./Sidebar";

function Navlinks() {
  const location = useLocation();
  const navigate = useNavigate();
  const CartCtx = useContext(CartContext);
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navState, setNavState] = useState("signup");

  const TotalNumber = CartCtx.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setNavState("logout");
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setNavState("logout");
      } else {
        setNavState("signup");
      }
    };

    checkAuthStatus();
  }, [location.pathname]);

  async function handleLogout() {
    if (!window.confirm("Are you sure you want to logout?")) return;

    localStorage.removeItem("token");
    localStorage.removeItem("justSignedUp");

    await supabase.auth.signOut();

    setNavState("signup");
    navigate("/signup");
    setMenuOpen(false);
  }

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const CartLink = ({ className }) => (
    <NavLink
      to="/cart"
      className={({ isActive }) =>
        isActive
          ? `${styles.Link} ${styles.active} ${styles.cart} ${className || ""}`
          : `${styles.Link} ${styles.cart} ${className || ""}`
      }
    >
      <FaShoppingBag size={24} />
      {TotalNumber > 0 && <span className={styles.badge}>{TotalNumber}</span>}
    </NavLink>
  );

  const ThemeToggle = ({ className, as = "button" }) =>
    as === "button" ? (
      <button
        onClick={toggleTheme}
        className={`${styles.themeLink} ${className || ""}`}
        aria-label="Toggle Theme"
      >
        {theme === "light" ? (
          <IoMoonOutline size={25} />
        ) : (
          <IoSunnyOutline size={25} />
        )}
      </button>
    ) : (
      <Link
        onClick={toggleTheme}
        className={`${styles.themeLink} ${className || ""}`}
        aria-label="Toggle Theme"
      >
        {theme === "light" ? (
          <IoMoonOutline size={25} />
        ) : (
          <IoSunnyOutline size={25} />
        )}
      </Link>
    );

  const navLinks = (
    <ul className={styles.navList}>
      <li>
        <NavLink
          to="/home"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          <span className={styles.mobileIcon}>
            <IoHomeOutline size={18} />
          </span>{" "}
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          <span className={styles.mobileIcon}>
            <FcAbout size={18} />
          </span>{" "}
          About us
        </NavLink>
      </li>
      {navState === "signup" && (
        <li>
          <NavLink
            to="/signup"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            <span className={styles.mobileIcon}>
              <FaUserPlus size={16} />
            </span>{" "}
            Signup
          </NavLink>
        </li>
      )}
      {navState === "login" && (
        <li>
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            <span className={styles.mobileIcon}>
              <FaSignInAlt size={16} />
            </span>{" "}
            Login
          </NavLink>
        </li>
      )}
      {navState === "logout" && (
        <li>
          <button
            onClick={handleLogout}
            className={`${styles.logoutButton} ${styles.Link}`}
          >
            <span className={styles.mobileIcon}>
              <FaSignOutAlt size={16} />
            </span>{" "}
            Logout
          </button>
        </li>
      )}
      <li>
        <NavLink
          to="/meals"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          <span className={styles.mobileIcon}>
            <GiHotMeal size={18} />
          </span>{" "}
          Meals
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          <span className={styles.mobileIcon}>
            <IoMdContact size={18} />
          </span>{" "}
          Contact us
        </NavLink>
      </li>
    </ul>
  );

  return (
    <div className={styles.navbar}>
      {/* Hamburger menu toggle */}
      <button
        className={styles.menuToggle}
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Mobile-only cart and theme toggle */}
      <div className={styles.mobileExtras}>
        <CartLink />
        <ThemeToggle />
      </div>

      {/* Logo */}
      <div className={styles.logo}>
        <Link to="/">
          <img src={LogoImage} alt="Logo" />
        </Link>
      </div>

      {/* Desktop links */}
      <div className={styles.links}>
        {navLinks}
        <CartLink className={styles.desktopOnly} />
        <ThemeToggle className={styles.desktopOnly} />
      </div>

      {/* Mobile Sidebar */}
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
        {navLinks}
      </Sidebar>
    </div>
  );
}

export default Navlinks;
