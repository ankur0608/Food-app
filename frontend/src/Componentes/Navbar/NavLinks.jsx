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
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  const { theme: currentTheme, toggleTheme, theme } = useCustomTheme();
  const { items } = useContext(CartContext);
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session?.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setIsAuthenticated(!!session?.user)
    );

    return () => listener?.subscription?.unsubscribe?.();
  }, []);

  const navbarBgColor = currentTheme === "dark" ? "#0d1117" : "#ffffff";
  const iconColor = theme === "light" ? "#333" : "#fff";

  return isMobile ? (
    <MobileNavbar
      iconColor={iconColor}
      navbarBgColor={navbarBgColor}
      isAuthenticated={isAuthenticated}
      totalItems={totalItems}
    />
  ) : (
    <DesktopNavbar
      currentTheme={currentTheme}
      theme={theme}
      toggleTheme={toggleTheme}
      iconColor={iconColor}
      isAuthenticated={isAuthenticated}
      totalItems={totalItems}
      navbarBgColor={navbarBgColor}
    />
  );
}
