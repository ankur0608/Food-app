import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Newsletter from "../Newsletter.jsx";
import Footer from "../Footer.jsx";
import Reservation from "../Reservation.jsx";
import ScrollToTop from "../ScrollToTop.jsx";
import OpeningHours from "../OpeningHours.jsx";
import { Toaster } from "react-hot-toast";
import Navbar from "./NavLinks.jsx";
import ChatBox from "../Pages/ChatBox/ChatBox.jsx";
import { supabase } from "../../../supabaseClient.js";

function Layout() {
  const { pathname } = useLocation();
  const [user, setUser] = useState({ id: "guest" });

  // Get Supabase session
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) setUser({ id: data.session.user.id });
    };
    getSession();
  }, []);

  // Routes where extras (OpeningHours/Reservation/Newsletter) are hidden
  const hiddenPaths = [
    "/about",
    "/contact",
    "/meals",
    "/profile",
    "/signup",
    "/login",
    "/blog",
    "/cart",
    "/checkout",
    "/payment-history",
  ];

  const shouldHideExtras = hiddenPaths.some((path) =>
    pathname.startsWith(path)
  );

  return (
    <>
      <nav>
        <Navbar />
        <ScrollToTop />
        <Toaster />
      </nav>

      <Outlet />

      {!shouldHideExtras && (
        <>
          <OpeningHours />
          <Reservation />
          <Newsletter />
        </>
      )}

      {/* Floating ChatBox */}
      <ChatBox user={user} />

      <Footer />
    </>
  );
}

export default Layout;
