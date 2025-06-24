import { Outlet } from "react-router-dom";
import Navlinks from "./NavLinks.jsx";
import Newsletter from "../Newsletter.jsx";
import Footer from "../Footer.jsx";
import Reservation from "../Reservation.jsx";
import { useLocation } from "react-router-dom";

function Layout() {
  const location = useLocation();
  const hideReservationOn = [
    "/login",
    "/signup",
    "/contact",
    "/ForgotPassword",
  ];
  const hideFooter = ["/login", "/signup", "contact", "/ForgotPassword"];

  const shouldShowReservation = !hideReservationOn.includes(location.pathname);
  const shouldShowFooter = !hideFooter.includes(location.pathname);
  return (
    <>
      <nav>
        <Navlinks />
      </nav>

      <Outlet />

      {shouldShowReservation && <Reservation />}
      {shouldShowFooter && <Newsletter />}
      <Footer />
    </>
  );
}

export default Layout;
