import { Outlet } from "react-router-dom";
import Navlinks from "./NavLinks.jsx";
import Newsletter from "../Newsletter.jsx";
import Footer from "../Footer.jsx";

function Layout() {
  return (
    <>
      <nav>
        <Navlinks />
      </nav>
      <Outlet />
      <Newsletter />
      <Footer />
    </>
  );
}

export default Layout;
