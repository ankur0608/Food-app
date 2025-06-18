import { lazy, Suspense } from "react";
import Signup from "./Componentes/Sign-up.jsx";
import About from "./Componentes/Pages/About.jsx";
import Login from "./Componentes/Login.jsx";
import ForgotPassword from "./Componentes/ForgotPassword.jsx";
import Contact from "./Componentes/Pages/Contact.jsx";
import PrivacyPolicy from "./Componentes/PrivacyPolicy.jsx";
import Cart from "./Componentes/Pages/Cart.jsx";
import Checkout from "./Componentes/Pages/Checkout.jsx";
import Navbar from "./Componentes/Navbar/Navbar.jsx";

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";

const Meals = lazy(() => import("./Componentes/Pages/Meals.jsx"));
const Home = lazy(() => import("./Componentes/Pages/Home.jsx"));
const OrderSummary = lazy(() =>
  import("./Componentes/Pages/Order_summary.jsx")
);

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/home" replace />,
    },
    {
      path: "/",
      element: <Navbar />,
      children: [
        {
          path: "home",
          element: (
            <Suspense fallback={<div>Loading Home...</div>}>
              <Home />
            </Suspense>
          ),
        },
        {
          path: "meals",
          element: (
            <Suspense fallback={<div>Loading Meals...</div>}>
              <Meals />
            </Suspense>
          ),
        },
        { path: "about", element: <About /> },
        { path: "contact", element: <Contact /> },
        { path: "signup", element: <Signup /> },
        { path: "login", element: <Login /> },
        { path: "forgotpassword", element: <ForgotPassword /> },
        { path: "privacypolicy", element: <PrivacyPolicy /> },
        { path: "cart", element: <Cart /> },
        { path: "checkout", element: <Checkout /> },
        {
          path: "order-summary",
          element: (
            <Suspense fallback={<div>Loading Summary...</div>}>
              <OrderSummary />
            </Suspense>
          ),
        },
        { path: "*", element: <div>404 - Page Not Found</div> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
