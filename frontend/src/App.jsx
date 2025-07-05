import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Checkout from "./Componentes/Pages/Checkout.jsx";
import Layout from "./Componentes/Navbar/Layout.jsx";
import GoogleRedirectHandler from "./Componentes/GoogleRedirectHandler.jsx";
import ResetPassword from "./Componentes/ResetPassword.jsx";
import PaymentHistory from "./Componentes/Pages/PaymentHistory.jsx";
import Profile from "./Componentes/Pages/Profile.jsx";
// Lazy-loaded components
const Meals = lazy(() => import("./Componentes/Pages/Meals.jsx"));
const Home = lazy(() => import("./Componentes/Pages/Home.jsx"));
const OrderSummary = lazy(() =>
  import("./Componentes/Pages/Order_summary.jsx")
);
const About = lazy(() => import("./Componentes/Pages/About.jsx"));
const Contact = lazy(() => import("./Componentes/Pages/Contact/Contact.jsx"));
const Signup = lazy(() => import("./Componentes/Sign-up.jsx"));
const Login = lazy(() => import("./Componentes/Login.jsx"));
const ForgotPassword = lazy(() => import("./Componentes/ForgotPassword.jsx"));
const PrivacyPolicy = lazy(() => import("./Componentes/PrivacyPolicy.jsx"));
const Cart = lazy(() => import("./Componentes/Pages/Cart.jsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" replace />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "home", element: <Home /> },
      { path: "meals", element: <Meals /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "signup", element: <Signup /> },
      { path: "login", element: <Login /> },
      { path: "forgotpassword", element: <ForgotPassword /> },
      { path: "privacypolicy", element: <PrivacyPolicy /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "order-summary", element: <OrderSummary /> },
      { path: "google-redirect", element: <GoogleRedirectHandler /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "payment-history", element: <PaymentHistory /> },
      { path: "Profile", element: <Profile /> },
      { path: "*", element: <div>404 - Page Not Found</div> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
