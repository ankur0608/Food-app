import { Outlet } from "react-router-dom";
import Navlinks from "./NavLinks";
import Newsletter from "../Newsletter.jsx";
import Footer from "../Footer";

function Navbar() {
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

export default Navbar;
