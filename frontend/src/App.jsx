import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Layout from "./Componentes/Navbar/Layout.jsx";
import Checkout from "./Componentes/Pages/Checkout/steps/Checkout.jsx";
import GoogleRedirectHandler from "./Componentes/GoogleRedirectHandler.jsx";
import ResetPassword from "./Componentes/ResetPassword.jsx";
import PaymentHistory from "./Componentes/Pages/PaymentHistory.jsx";
import Profile from "./Componentes/Pages/Profile.jsx";
import Verify from "./Componentes/Verify.jsx";
import Home from "./Componentes/Pages/Home.jsx";
// Lazy-loaded pages
// const Home = lazy(() => import("./Componentes/Pages/Home.jsx"));
const Meals = lazy(() => import("./Componentes/Pages/Meals.jsx"));
const MealsDetail = lazy(() => import("./Componentes/Pages/MealsDetails.jsx"));
const About = lazy(() => import("./Componentes/Pages/AboutUs/About.jsx"));
const Contact = lazy(() => import("./Componentes/Pages/Contact/Contact.jsx"));
const Signup = lazy(() => import("./Componentes/Sign-up.jsx"));
const Login = lazy(() => import("./Componentes/Login.jsx"));
const ForgotPassword = lazy(() => import("./Componentes/ForgotPassword.jsx"));
const PrivacyPolicy = lazy(() => import("./Componentes/PrivacyPolicy.jsx"));
const Cart = lazy(() => import("./Componentes/Pages/Cart.jsx"));
const BlogList = lazy(() => import("./Componentes/BlogList.jsx"));
const BlogDetail = lazy(() => import("./Componentes/BlogDetail.jsx"));
// const Wishlist = lazy(() => import("./Componentes/Pages/Wishlist.jsx"));
// Simple fallback loader
const Loader = () => (
  <div style={{ textAlign: "center", padding: "2rem" }}>
    <h2>Loading...</h2>
  </div>
);

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/home" replace /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "meals",
        element: <Meals />,
      },
      {
        path: "meals/:name",
        element: <MealsDetail />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgotpassword",
        element: (
          <Suspense fallback={<Loader />}>
            <ForgotPassword />
          </Suspense>
        ),
      },
      // {
      //   path: "wishlist",
      //   element: <Wishlist />,
      // },
      {
        path: "privacypolicy",
        element: (
          <Suspense fallback={<Loader />}>
            <PrivacyPolicy />
          </Suspense>
        ),
      },
      {
        path: "cart",
        element: (
          <Suspense fallback={<Loader />}>
            <Cart />
          </Suspense>
        ),
      },
      {
        path: "checkout",
        element: (
          <Suspense fallback={<Loader />}>
            <Checkout />
          </Suspense>
        ),
      },
      { path: "google-redirect", element: <GoogleRedirectHandler /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "payment-history", element: <PaymentHistory /> },
      { path: "profile", element: <Profile /> },
      { path: "verify", element: <Verify /> },
      {
        path: "blog",
        element: (
          <Suspense fallback={<Loader />}>
            <BlogList />
          </Suspense>
        ),
      },
      {
        path: "blog/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <BlogDetail />
          </Suspense>
        ),
      },

      {
        path: "*",
        element: (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <h1>404 - Page Not Found</h1>
            <p>Sorry, the page you’re looking for does not exist.</p>
          </div>
        ),
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
