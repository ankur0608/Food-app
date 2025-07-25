import { Outlet, useLocation } from "react-router-dom";
import Navlinks from "./NavLinks.jsx";
import Newsletter from "../Newsletter.jsx";
import Footer from "../Footer.jsx";
import Reservation from "../Reservation.jsx";
import ScrollToTop from "../ScrollToTop.jsx";
import OpeningHours from "../OpeningHours.jsx";
import { Toaster } from "react-hot-toast";
function Layout() {
  const { pathname } = useLocation();

  // Define routes where extras should be hidden (exact or prefix)
  const hiddenPaths = ["/about", "/contact", "/meals", "/profile"];

  // Check if current path starts with any of the restricted routes
  const shouldHideExtras = hiddenPaths.some((path) =>
    pathname.startsWith(path)
  );

  return (
    <>
      <nav>
        <Navlinks />
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
