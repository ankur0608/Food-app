import { Outlet, useLocation } from "react-router-dom";
import Navlinks from "./NavLinks.jsx";
import Newsletter from "../Newsletter.jsx";
import Footer from "../Footer.jsx";
import Reservation from "../Reservation.jsx";
import ScrollToTop from "../ScrollToTop.jsx";
import OpeningHours from "../OpeningHours.jsx";

function Layout() {
  const location = useLocation();

  // Pages where these features should be hidden
  const hideOn = ["/about", "/contact", "/meals"];

  // Only show if not on About Us, Contact Us, or Meals
  const shouldShowExtras = !hideOn.includes(location.pathname);

  return (
    <>
      <nav>
        <Navlinks />
        <ScrollToTop />
      </nav>

      <Outlet />

      {shouldShowExtras && <OpeningHours />}
      {shouldShowExtras && <Reservation />}
      {shouldShowExtras && <Newsletter />}
      <Footer />
    </>
  );
}

export default Layout;
