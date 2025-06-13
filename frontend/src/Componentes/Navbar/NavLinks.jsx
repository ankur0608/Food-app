import { useState, useEffect, useContext } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { CartContext } from "../Store/CartContext";
import { useTheme } from "../Store/theme.jsx";
import { FaShoppingBag } from "react-icons/fa";
import { IoMoonOutline, IoSunnyOutline, IoHomeOutline } from "react-icons/io5";
import { FcAbout } from "react-icons/fc";
import { IoMdContact } from "react-icons/io";
import { GiHotMeal } from "react-icons/gi";
import { FaUserPlus, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import LogoImage from "../../assets/main-logo.png";

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
    const token = localStorage.getItem("token");
    const justSignedUp = localStorage.getItem("justSignedUp");
    setNavState(
      token ? (justSignedUp === "true" ? "login" : "logout") : "signup"
    );
  }, [location.pathname]);

  function handleLogout() {
    if (!window.confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem("token");
    localStorage.removeItem("justSignedUp");
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

      <div className={styles.logo}>
        <Link to="/">
          <img src={LogoImage} alt="Logo" />
        </Link>
      </div>

      {/* Links container */}
      <div className={`${styles.links} ${menuOpen ? styles.open : ""}`}>
        <ul className={styles.navList}>
          <li>
            <NavLink
              to="/home"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              <span className={styles.mobileIcon}>
                <IoHomeOutline size={18} />
              </span>
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
              </span>
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
                </span>
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
                </span>
                Login
              </NavLink>
            </li>
          )}
          {navState === "logout" && (
            <li>
              <NavLink
                onClick={handleLogout}
                className={`${styles.logoutButton} ${styles.Link}`}
                type="button"
              >
                <span className={styles.mobileIcon}>
                  <FaSignOutAlt size={16} />
                </span>
                Logout
              </NavLink>
            </li>
          )}
          <li>
            <NavLink
              to="/meals"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              <span className={styles.mobileIcon}>
                <GiHotMeal size={18} />
              </span>
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
              </span>
              Contact us
            </NavLink>
          </li>
        </ul>

        {/* Desktop-only cart and theme toggle */}
        <CartLink className={styles.desktopOnly} />
        <ThemeToggle className={styles.desktopOnly} />
      </div>
    </div>
  );
}

export default Navlinks;
