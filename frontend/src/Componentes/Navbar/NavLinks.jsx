import { useState, useEffect, useContext } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { CartContext } from "../Store/CartContext";
import { useTheme } from "../Store/theme.jsx";
import { FaShoppingBag, FaUserPlus, FaSignInAlt } from "react-icons/fa";
import { IoMoonOutline, IoSunnyOutline, IoHomeOutline } from "react-icons/io5";
import { FcAbout } from "react-icons/fc";
import { IoMdContact } from "react-icons/io";
import { GiHotMeal } from "react-icons/gi";
import LogoImage from "../../assets/main-logo.png";
import { supabase } from "../../../supabaseClient.js";
import Sidebar from "./Sidebar";
import AvatarDropdown from "../AvatarDropdown.jsx";

function Navlinks() {
  const location = useLocation();
  const navigate = useNavigate();
  const CartCtx = useContext(CartContext);
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navState, setNavState] = useState("signup");

  const totalItems = CartCtx.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {
    const checkAuthStatus = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setNavState("logout");
      } else {
        const justSignedUp = localStorage.getItem("justSignedUp");
        setNavState(justSignedUp ? "login" : "signup");
      }
    };

    checkAuthStatus();
  }, [location.pathname]);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setNavState("logout");
        } else {
          setNavState("signup");
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    localStorage.removeItem("justSignedUp");
    await supabase.auth.signOut();
    setNavState("signup");
    navigate("/login");
  }

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const CartLink = ({ className }) => (
    <NavLink
      to="/cart"
      className={({ isActive }) =>
        `${styles.Link} ${styles.cart} ${isActive ? styles.active : ""} ${
          className || ""
        }`
      }
    >
      <FaShoppingBag size={24} />
      {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
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

  const mainLinks = (
    <>
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
      <li>
        <NavLink
          to="/meals"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          <span className={styles.mobileIcon}>
            <GiHotMeal size={18} />
          </span>{" "}
          Menu
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
          Reservation
        </NavLink>
      </li>
    </>
  );

  const authLink =
    navState === "signup" ? (
      <NavLink
        to="/signup"
        className={({ isActive }) =>
          isActive ? styles.active : styles.authLink
        }
      >
        <span className={styles.mobileIcon}>
          <FaUserPlus size={16} />
        </span>{" "}
        Signup
      </NavLink>
    ) : navState === "login" ? (
      <NavLink
        to="/login"
        className={({ isActive }) =>
          isActive ? styles.active : styles.authLink
        }
      >
        <span className={styles.mobileIcon}>
          <FaSignInAlt size={16} />
        </span>{" "}
        Login
      </NavLink>
    ) : null;

  const navLinks = (
    <ul className={styles.navList}>
      {mainLinks}
      <li className={styles.rightSection}>{authLink}</li>
    </ul>
  );

  return (
    <div className={styles.navbar}>
      <button
        className={styles.menuToggle}
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Mobile view extras (cart, theme, avatar) */}
      <div className={styles.mobileExtras}>
        <CartLink />
        <ThemeToggle />
        {navState === "logout" && <AvatarDropdown onLogout={handleLogout} />}
      </div>

      <div className={styles.logo}>
        <Link to="/">
          <img src={LogoImage} alt="Logo" />
        </Link>
      </div>

      <div className={styles.links}>
        {navLinks}
        <CartLink className={styles.desktopOnly} />
        <ThemeToggle className={styles.desktopOnly} />
        {navState === "logout" && (
          <div className={styles.desktopOnly}>
            <AvatarDropdown onLogout={handleLogout} />
          </div>
        )}
      </div>

      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
        <ul className={styles.navList}>
          {mainLinks}
          <li className={styles.rightSection}>{authLink}</li>
        </ul>
      </Sidebar>
    </div>
  );
}

export default Navlinks;
