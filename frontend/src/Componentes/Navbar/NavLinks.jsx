import { useState, useEffect, useContext } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { CartContext } from "../Store/CartContext";
import { useTheme } from "../Store/theme.jsx";
import { FaShoppingBag } from "react-icons/fa";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import LogoImage from "../../assets/5610944.png";

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

    if (token && justSignedUp === "true") {
      setNavState("login");
    } else if (token) {
      setNavState("logout");
    } else {
      setNavState("signup");
    }
  }, [location.pathname]);

  function handleLogout() {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("justSignedUp");
    setNavState("signup");
    navigate("/signup");
    setMenuOpen(false); // close menu on logout
  }

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className={styles.navbar}>
      {/* Logo */}
      <div className={styles.logo}>
        <Link to="/">
          <img src={LogoImage} alt="Logo" />
        </Link>
      </div>

      {/* Mobile-only cart and theme toggle (outside burger) */}
      <div className={styles.mobileExtras}>
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            isActive
              ? `${styles.Link} ${styles.active} ${styles.cart}`
              : `${styles.Link} ${styles.cart}`
          }
        >
          <FaShoppingBag size={24} />
          {TotalNumber > 0 && (
            <span className={styles.badge}>{TotalNumber}</span>
          )}
        </NavLink>

        <Link
          onClick={toggleTheme}
          className={styles.themeLink}
          aria-label="Toggle Theme"
        >
          {theme === "light" ? (
            <IoMoonOutline size={25} />
          ) : (
            <IoSunnyOutline size={25} />
          )}
        </Link>
      </div>

      {/* Hamburger menu toggle */}
      <button
        className={styles.menuToggle}
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Links container */}
      <div className={`${styles.links} ${menuOpen ? styles.open : ""}`}>
        <ul className={styles.navList}>
          <li>
            <NavLink
              to="/home"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              About us
            </NavLink>
          </li>

          {navState === "signup" && (
            <li>
              <NavLink
                to="/signup"
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
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
                Logout
              </NavLink>
            </li>
          )}

          <li>
            <NavLink
              to="/meals"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              Meals
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              Contact us
            </NavLink>
          </li>
        </ul>

        {/* Cart and theme toggle (inside menu - desktop only) */}
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            isActive
              ? `${styles.Link} ${styles.active} ${styles.cart} ${styles.desktopOnly}`
              : `${styles.Link} ${styles.cart} ${styles.desktopOnly}`
          }
        >
          <FaShoppingBag size={24} />
          {TotalNumber > 0 && (
            <span className={styles.badge}>{TotalNumber}</span>
          )}
        </NavLink>

        <button
          onClick={toggleTheme}
          className={`${styles.themeLink} ${styles.desktopOnly}`}
          aria-label="Toggle Theme"
        >
          {theme === "light" ? (
            <IoMoonOutline size={25} />
          ) : (
            <IoSunnyOutline size={25} />
          )}
        </button>
      </div>
    </div>
  );
}

export default Navlinks;
