// components/Navbar/Navbar.jsx
import { useMediaQuery } from "@mui/material";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { useTheme as useCustomTheme } from "../Store/theme";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../Store/CartContext";
import { supabase } from "../../../supabaseClient";

import MobileNavbar from "./MobileNavbar";
import DesktopNavbar from "./DesktopNavbar";

export default function Navbar() {
  // MUI theme and breakpoints
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  // Custom theme context
  const { theme: currentTheme, toggleTheme } = useCustomTheme();

  // Cart context
  const { items } = useContext(CartContext);
  const navigate = useNavigate();

  // State for auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Calculate total items in cart
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  // Fetch session and listen for auth changes
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session?.user);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setIsAuthenticated(!!session?.user)
    );

    return () => listener?.subscription?.unsubscribe?.();
  }, []);

  // Theme-based styles
  const navbarBgColor = currentTheme === "dark" ? "#0d1117" : "#ffffff";
  const iconColor = currentTheme === "light" ? "#333" : "#fff";

  // Layout selection: Mobile or Desktop
  return (
    <header
      style={{
        backgroundColor: navbarBgColor,
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {isMobile ? (
        <MobileNavbar
          iconColor={iconColor}
          navbarBgColor={navbarBgColor}
          isAuthenticated={isAuthenticated}
          totalItems={totalItems}
          onNavigate={navigate}
        />
      ) : (
        <DesktopNavbar
          currentTheme={currentTheme}
          toggleTheme={toggleTheme}
          iconColor={iconColor}
          isAuthenticated={isAuthenticated}
          totalItems={totalItems}
          navbarBgColor={navbarBgColor}
          onNavigate={navigate}
        />
      )}
    </header>
  );
}
