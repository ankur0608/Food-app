import { Outlet, useLocation } from "react-router-dom";
import Newsletter from "../Newsletter.jsx";
import Footer from "../Footer.jsx";
import Reservation from "../Reservation.jsx";
import ScrollToTop from "../ScrollToTop.jsx";
import OpeningHours from "../OpeningHours.jsx";
import { Toaster } from "react-hot-toast";
import Navbar from "./NavLinks.jsx";
function Layout() {
  const { pathname } = useLocation();

  // Define routes where extras should be hidden (exact or prefix)
  const hiddenPaths = ["/about", "/contact", "/meals", "/profile", "/signup" ,"/login"];

  // Check if current path starts with any of the restricted routes
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

      <Footer />
    </>
  );
}

export default Layout;
